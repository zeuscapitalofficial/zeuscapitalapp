"use client";

import * as React from "react";
import { format, isToday, isYesterday } from "date-fns";
import {
  Headphones,
  ArrowUpIcon,
  PlusIcon,
  X,
  MessageCircleDashedIcon,
  Wifi,
  WifiOff,
  Clock,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "@/components/ui/message";
import { useSocket } from "@/components/providers/socket-provider";

// ── Types ─────────────────────────────────────────────────────────
interface LocalMessage {
  id: string;
  role: "user" | "admin";
  content: string;
  timestamp: string;
  createdAt: string;
  senderName: string;
  seen?: boolean;
  status: "sending" | "sent";
}

interface SocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "USER" | "ADMIN";
  senderName: string;
  content: string;
  createdAt: string;
}

const QUICK_PROMPTS = [
  "Check my deposit status",
  "I need help with withdrawal",
  "Speak with a support agent",
];

function toLocal(msg: SocketMessage): LocalMessage {
  return {
    id: msg.id,
    role: msg.senderRole === "ADMIN" ? "admin" : "user",
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt: msg.createdAt,
    senderName: msg.senderRole === "ADMIN" ? "Zeus Support" : msg.senderName,
    status: "sent",
  };
}

function playPing() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore
  }
}

// ── Component ──────────────────────────────────────────────────────
export function GlobalChatbotWidget() {
  const { socket, isConnected, isAuthenticated } = useSocket();
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string>("");
  const [userName, setUserName] = React.useState("You");
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [adminIsTyping, setAdminIsTyping] = React.useState(false);

  // Refs for debouncing typing and tracking open state for callbacks
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = React.useRef(false);
  const isOpenRef = React.useRef(isOpen);

  React.useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
      markMessagesAsRead(messages);
    }
  }, [isOpen, messages]);

  const markMessagesAsRead = React.useCallback(
    (currentMessages: LocalMessage[]) => {
      if (!conversationId || !isOpenRef.current) return;
      const unreadAdminMsgIds = currentMessages
        .filter((m) => m.role === "admin" && !m.seen)
        .map((m) => m.id);

      if (unreadAdminMsgIds.length > 0 && socket) {
        socket.emit("mark-read", {
          conversationId,
          messageIds: unreadAdminMsgIds,
        });

        // Optimistically mark as seen
        setMessages((prev) =>
          prev.map((m) =>
            unreadAdminMsgIds.includes(m.id) ? { ...m, seen: true } : m
          )
        );
      }
    },
    [conversationId, socket]
  );

  // ── Fetch current user once ──
  React.useEffect(() => {
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.id) {
          setUserId(d.id);
        }
        if (d?.name) setUserName(d.name);
        if (d?.image) setUserImage(d.image);
      })
      .catch(() => {});
  }, []);

  // ── Load existing conversation from REST (initial load) ──
  React.useEffect(() => {
    if (!isOpen || !userId) return;

    async function bootstrap() {
      try {
        const r = await fetch("/api/chat/conversations");
        if (!r.ok) return;
        const data = await r.json();
        const convs = data.conversations ?? [];
        if (convs.length === 0) return;

        const latest = convs[0];
        setConversationId(latest.id);

        // Load history
        const r2 = await fetch(`/api/chat/messages?conversationId=${latest.id}`);
        if (!r2.ok) return;
        const d2 = await r2.json();
        const msgs: SocketMessage[] = d2.messages ?? [];
        setMessages(msgs.map(toLocal));

        // Join the room on the socket
        if (socket) {
          socket.emit("join-conversation", latest.id);
        }
      } catch {
        // ignore
      }
    }

    bootstrap();
  }, [isOpen, userId]);

  // ── Socket.IO connection ──
  React.useEffect(() => {
    if (!socket || !userId) return;

    if (conversationId) {
      socket.emit("join-conversation", conversationId);
    }

    const handleAuthSuccess = () => {
      if (conversationId) {
        socket.emit("join-conversation", conversationId);

        // Fetch new messages since last message
        const lastMsg = messages[messages.length - 1];
        const after = lastMsg ? lastMsg.createdAt : undefined;
        let url = `/api/chat/messages?conversationId=${conversationId}`;
        if (after) {
          url += `&after=${encodeURIComponent(after)}`;
        }

        fetch(url)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d?.messages) {
              setMessages((prev) => {
                const prevIds = new Set(prev.map((m) => m.id));
                const newMsgs = (d.messages as SocketMessage[])
                  .filter((m) => !prevIds.has(m.id))
                  .map(toLocal);
                return [...prev, ...newMsgs];
              });
            }
          })
          .catch(() => {});
      }
    };

    const handleDisconnect = () => {};

    const handleConversationCreated = ({ conversationId: id }: { conversationId: string }) => {
      setConversationId(id);
      socket.emit("join-conversation", id);
    };

    const handleNewMessage = (msg: SocketMessage) => {
      setMessages((prev) => {
        // Handle optimistic replacement
        const existingIndex = prev.findIndex(
          (m) => m.id === msg.id || (m.role === "user" && m.content === msg.content && m.status === "sending")
        );
        if (existingIndex !== -1) {
          const newPrev = [...prev];
          newPrev[existingIndex] = toLocal(msg);
          return newPrev;
        }
        return [...prev, toLocal(msg)];
      });
      setIsSending(false);

      if (msg.senderRole === "ADMIN") {
        if (!isOpenRef.current) {
          setUnreadCount((c) => c + 1);
          playPing();
        } else {
          // If open, we need to mark it as read
          if (conversationId) {
            socket.emit("mark-read", {
              conversationId,
              messageIds: [msg.id],
            });
          }
        }
      }
    };

    const handleUserTyping = () => setAdminIsTyping(true);
    const handleUserStoppedTyping = () => setAdminIsTyping(false);

    const handleMessagesRead = ({ messageIds }: { messageIds: string[] }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m.id) ? { ...m, seen: true } : m))
      );
    };

    socket.on("conversation-created", handleConversationCreated);
    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stopped-typing", handleUserStoppedTyping);
    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("conversation-created", handleConversationCreated);
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stopped-typing", handleUserStoppedTyping);
      socket.off("messages-read", handleMessagesRead);
    };
  }, [userId, conversationId, messages]);

  const emitStopTyping = React.useCallback(() => {
    if (isTypingRef.current && conversationId && socket) {
      socket.emit("typing-stop", { conversationId });
      isTypingRef.current = false;
    }
  }, [conversationId, socket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (conversationId && isConnected && isAuthenticated && socket) {
      if (!isTypingRef.current) {
        socket.emit("typing-start", { conversationId });
        isTypingRef.current = true;
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(emitStopTyping, 2000);
    }
  };

  const handleInputBlur = () => {
    emitStopTyping();
  };

  const handleSend = React.useCallback(
    (text?: string) => {
      const content = (text ?? inputValue).trim();
      if (!content || isSending || !userId || !isConnected || !isAuthenticated || !socket) return;

      setInputValue("");
      emitStopTyping();
      setIsSending(true);

      const optimisticId = `opt-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: optimisticId,
          role: "user",
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: new Date().toISOString(),
          senderName: userName,
          status: "sending",
        },
      ]);

      socket.emit("send-message", {
        conversationId: conversationId ?? undefined,
        userId,
        senderRole: "USER",
        content,
        senderName: userName,
      });
    },
    [inputValue, isSending, conversationId, userId, userName, isConnected, isAuthenticated, socket, emitStopTyping]
  );

  const handleReset = () => {
    setMessages([]);
    setConversationId(null);
  };

  const groupedMessages = React.useMemo(() => {
    const groups: { dateLabel: string; messages: LocalMessage[] }[] = [];
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      let label = format(date, "MMM d");
      if (isToday(date)) label = "Today";
      else if (isYesterday(date)) label = "Yesterday";

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateLabel === label) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ dateLabel: label, messages: [msg] });
      }
    });
    return groups;
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <MessageScrollerProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger
            render={
              <Button
                size="icon"
                className="size-14 rounded-full bg-accent-foreground text-background shadow-xl hover:bg-accent-foreground/90 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative"
                aria-label="Toggle Zeus Support Live Chat"
              >
                {isOpen ? <X className="size-6" /> : <Headphones className="size-6 animate-pulse" />}
                {!isOpen && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {/* Connection indicator dot */}
                {(!unreadCount || isOpen) && (
                  <span
                    className={`absolute top-1 right-1 size-2.5 rounded-full border-2 border-background ${
                      isConnected && isAuthenticated ? "bg-emerald-400" : "bg-muted-foreground"
                    }`}
                  />
                )}
              </Button>
            }
          />
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-[360px] sm:w-[420px] p-0 border-none bg-transparent shadow-none ring-0 focus:outline-none relative flex flex-col gap-4"
          >
            <Card className="mx-auto h-[540px] w-full gap-0 overflow-hidden">
              {/* Header */}
              <CardHeader className="gap-1 border-b">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-accent-foreground/10 text-accent-foreground flex items-center justify-center shrink-0">
                    <Headphones className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Zeus Support Desk</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      {isConnected && isAuthenticated ? (
                        <><Wifi className="size-3 text-emerald-500" /> Live · connected</>
                      ) : (
                        <><WifiOff className="size-3 text-muted-foreground" /> Connecting...</>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label="New chat"
                            onClick={handleReset}
                            disabled={isSending}
                            className="cursor-pointer"
                          >
                            <PlusIcon className="size-3.5" />
                          </Button>
                        }
                      />
                      <TooltipContent><p>New conversation</p></TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-accent-foreground cursor-pointer"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>

              {/* Body */}
              <CardContent className="flex-1 overflow-hidden p-0">
                {messages.length === 0 && !adminIsTyping && !isSending ? (
                  <Empty className="w-full h-full">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageCircleDashedIcon />
                      </EmptyMedia>
                      <EmptyTitle>Zeus Support Desk</EmptyTitle>
                      <EmptyDescription>
                        Send a message or pick a quick topic to connect with our team.
                      </EmptyDescription>
                    </EmptyHeader>
                    <div className="flex flex-col gap-2 px-6 mt-4 w-full">
                      {QUICK_PROMPTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleSend(p)}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border bg-muted/40 hover:bg-accent-foreground/5 hover:border-accent-foreground/30 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </Empty>
                ) : (
                  <MessageScroller>
                    <MessageScrollerViewport>
                      <MessageScrollerContent className="p-(--card-spacing)">
                        <MessageGroup>
                          {groupedMessages.map((group) => (
                            <React.Fragment key={group.dateLabel}>
                              <div className="text-center text-[10px] text-muted-foreground py-2">
                                {group.dateLabel}
                              </div>
                              {group.messages.map((msg) => (
                                <MessageScrollerItem key={msg.id} scrollAnchor={msg.role === "user"}>
                                  <Message align={msg.role === "user" ? "end" : "start"}>
                                    <MessageAvatar>
                                      <Avatar size="sm">
                                        {msg.role === "user" && userImage && (
                                          <AvatarImage src={userImage} alt="You" />
                                        )}
                                        <AvatarFallback
                                          className={
                                            msg.role === "admin"
                                              ? "bg-accent-foreground text-background text-xs"
                                              : "text-xs"
                                          }
                                        >
                                          {msg.role === "admin"
                                            ? "ZA"
                                            : userName.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    </MessageAvatar>
                                    <MessageContent>
                                      {msg.role === "admin" && (
                                        <MessageHeader className="font-semibold text-accent-foreground text-xs">
                                          {msg.senderName}
                                        </MessageHeader>
                                      )}
                                      <div
                                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                                          msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                        }`}
                                      >
                                        {msg.content}
                                      </div>
                                      <MessageFooter>
                                        {msg.timestamp}
                                        {msg.role === "user" && (
                                          <span className="ml-1 flex items-center justify-center">
                                            {msg.status === "sending" ? (
                                              <Clock className="size-3 text-muted-foreground opacity-50" />
                                            ) : (
                                              <Check className={`size-3 ${msg.seen ? "text-emerald-500" : "text-muted-foreground"}`} />
                                            )}
                                          </span>
                                        )}
                                      </MessageFooter>
                                      {msg.role === "user" && msg.seen && (
                                        <div className="text-[10px] text-muted-foreground mt-0.5 text-right">
                                          Seen
                                        </div>
                                      )}
                                    </MessageContent>
                                  </Message>
                                </MessageScrollerItem>
                              ))}
                            </React.Fragment>
                          ))}

                          {(isSending || adminIsTyping) && (
                            <MessageScrollerItem key="typing-indicator">
                              <Message align="start">
                                <MessageAvatar>
                                  <Avatar size="sm">
                                    <AvatarFallback className="bg-accent-foreground text-background text-xs">
                                      <Headphones className="size-3.5" />
                                    </AvatarFallback>
                                  </Avatar>
                                </MessageAvatar>
                                <MessageContent>
                                  <div className="bg-muted/80 border border-border/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse [animation-delay:-0.3s]" />
                                    <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse [animation-delay:-0.15s]" />
                                    <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                  </div>
                                  <MessageFooter>Support is typing...</MessageFooter>
                                </MessageContent>
                              </Message>
                            </MessageScrollerItem>
                          )}
                        </MessageGroup>
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                )}
              </CardContent>

              {/* Footer */}
              <CardFooter className="flex-col gap-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="w-full"
                >
                  <InputGroup>
                    <InputGroupTextarea
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message to support..."
                      disabled={isSending || !isConnected || !isAuthenticated}
                      rows={1}
                      className="text-xs bg-transparent min-h-6 max-h-24 overflow-y-auto"
                    />
                    <InputGroupAddon align="block-end" className="pt-1">
                      <InputGroupButton
                        type="submit"
                        variant="default"
                        size="icon-sm"
                        disabled={!inputValue.trim() || isSending || !isConnected || !isAuthenticated}
                        className="ml-auto bg-accent-foreground text-background hover:bg-accent-foreground/90 cursor-pointer"
                      >
                        <ArrowUpIcon className="size-4" />
                        <span className="sr-only">Send</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </MessageScrollerProvider>
    </div>
  );
}
