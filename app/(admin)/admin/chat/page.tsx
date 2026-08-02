"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  ArrowUpIcon,
  Headphones,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useSocket } from "@/components/providers/socket-provider";
import { format } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────
interface Conversation {
  id: string;
  subject: string | null;
  isOpen: boolean;
  lastMessage: string | null;
  lastAt: string;
  createdAt: string;
  user: { id: string; name: string; email: string; image: string | null };
  unreadCount: number;
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

interface LocalMessage {
  id: string;
  role: "user" | "admin";
  content: string;
  timestamp: string;
  senderName: string;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: string;
  balance: number;
  totalDeposit: number;
  bonusRewards: number;
  createdAt: string;
  kycStatus: "APPROVED" | "PENDING" | "REJECTED" | "NONE";
}

const CANNED_REPLIES = [
  "Your deposit is being processed and will reflect within 24 hours.",
  "Please complete your KYC verification to enable withdrawals.",
  "Your withdrawal request has been received and is being processed.",
  "Could you please provide your transaction hash (TxID) so we can investigate?",
  "Your account has been reviewed. Please allow 1–2 business days for the update.",
];

function toLocal(msg: SocketMessage, fallbackUserName = "User"): LocalMessage {
  return {
    id: msg.id,
    role: msg.senderRole === "ADMIN" ? "admin" : "user",
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    senderName:
      msg.senderRole === "ADMIN"
        ? "You (Admin)"
        : msg.senderName || fallbackUserName,
  };
}

// ── Page Component ──────────────────────────────────────────────────
export default function AdminChatPage() {
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  
  // New features state
  const [filter, setFilter] = useState<"all" | "open" | "closed" | "unread">("all");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [cannedOpen, setCannedOpen] = useState(false);

  const selectedConvRef = useRef<Conversation | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  // Fetch admin identity
  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.id) {
          setAdminId(d.id);
          setAdminName(d.name || "Admin");
        }
      })
      .catch(() => {});
  }, []);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const r = await fetch("/api/chat/conversations");
      if (r.ok) {
        const data = await r.json();
        setConversations(data.conversations ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Socket.IO handlers
  useEffect(() => {
    if (!socket || !adminId) return;

    socket.emit("join-admin");
    if (selectedConvRef.current) {
      socket.emit("join-conversation", selectedConvRef.current.id);
    }

    const handleNewConv = (data: { id: string; userId: string; senderName: string; lastMessage: string; lastAt: string }) => {
      setConversations((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        const newConv: Conversation = {
          id: data.id,
          subject: "Support Request",
          isOpen: true,
          lastMessage: data.lastMessage,
          lastAt: data.lastAt,
          createdAt: data.lastAt,
          user: { id: data.userId, name: data.senderName, email: "", image: null },
          unreadCount: 1,
        };
        return [newConv, ...prev];
      });
    };

    const handleNewMessage = (msg: SocketMessage) => {
      setIsSending(false);
      const curr = selectedConvRef.current;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== msg.conversationId) return c;
          const isSelected = curr?.id === msg.conversationId;
          const isUnread = !isSelected && msg.senderRole === "USER";
          return {
            ...c,
            lastMessage: msg.content,
            lastAt: msg.createdAt,
            unreadCount: isUnread ? c.unreadCount + 1 : c.unreadCount,
          };
        })
      );

      if (curr && msg.conversationId === curr.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, toLocal(msg, curr.user.name)];
        });
        setUserIsTyping(false);

        if (msg.senderRole === "USER") {
          socket.emit("mark-read", {
            conversationId: curr.id,
            messageIds: [msg.id],
          });
        }
      }
    };

    const handleUserTyping = ({ conversationId }: { conversationId: string }) => {
      if (selectedConvRef.current?.id === conversationId) {
        setUserIsTyping(true);
      }
    };

    const handleUserStoppedTyping = ({ conversationId }: { conversationId: string }) => {
      if (selectedConvRef.current?.id === conversationId) {
        setUserIsTyping(false);
      }
    };

    socket.on("new-conversation", handleNewConv);
    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stopped-typing", handleUserStoppedTyping);

    return () => {
      socket.off("new-conversation", handleNewConv);
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stopped-typing", handleUserStoppedTyping);
    };
  }, [adminId, socket]);

  // Select a conversation
  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages([]);
    setUserIsTyping(false);
    setLoadingMessages(true);
    setUserDetails(null);

    if (socket) {
      socket.emit("join-conversation", conv.id);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );

    // Fetch messages
    try {
      const r = await fetch(`/api/chat/messages?conversationId=${conv.id}`);
      if (r.ok) {
        const data = await r.json();
        const msgs: SocketMessage[] = data.messages ?? [];
        setMessages(msgs.map((m) => toLocal(m, conv.user.name)));
      }
    } catch { /* ignore */ } finally {
      setLoadingMessages(false);
    }

    // Fetch user profile panel
    setLoadingUser(true);
    try {
      const rUser = await fetch(`/api/admin/users/${conv.user.id}`);
      if (rUser.ok) {
        const uData = await rUser.json();
        setUserDetails(uData);
      }
    } catch { /* ignore */ } finally {
      setLoadingUser(false);
    }
  };

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (!selectedConv || !socket) return;

    socket.emit("typing-start", { conversationId: selectedConv.id });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing-stop", { conversationId: selectedConv.id });
    }, 2000);
  };

  // Send admin reply
  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || !selectedConv || isSending || !adminId || !socket) return;

    setInputValue("");
    setIsSending(true);

    socket.emit("typing-stop", { conversationId: selectedConv.id });
    socket.emit("send-message", {
      conversationId: selectedConv.id,
      userId: adminId,
      senderRole: "ADMIN",
      content,
      senderName: adminName,
    });
  };

  // Toggle open/closed state
  const handleToggleResolve = async () => {
    if (!selectedConv) return;
    const nextState = !selectedConv.isOpen;

    try {
      const r = await fetch(`/api/chat/conversations/${selectedConv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: nextState }),
      });

      if (r.ok) {
        setSelectedConv((prev) => (prev ? { ...prev, isOpen: nextState } : null));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConv.id ? { ...c, isOpen: nextState } : c))
        );
      }
    } catch { /* ignore */ }
  };

  // Client-side filtering
  const filteredConversations = conversations.filter((c) => {
    if (filter === "open") return c.isOpen;
    if (filter === "closed") return !c.isOpen;
    if (filter === "unread") return c.unreadCount > 0;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 sm:size-10 rounded-xl bg-accent-foreground/10 text-accent-foreground flex items-center justify-center shrink-0">
            <Headphones className="size-4 sm:size-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Support Chat Inbox</h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <><Wifi className="size-3 text-emerald-500" /><span className="text-emerald-600 text-xs">Live · WebSocket connected</span></>
              ) : (
                <><WifiOff className="size-3 text-muted-foreground" /><span className="text-xs">Connecting...</span></>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <Badge className="bg-accent-foreground/10 text-accent-foreground border-none text-[11px] sm:text-xs">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadConversations} className="gap-1.5 text-xs h-8 sm:h-9">
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Single Master Card Container ── */}
      <Card className="flex-1 min-h-0 flex flex-col md:flex-row p-0 overflow-hidden shadow-xs border border-border">
        {/* Left Section: Conversations List */}
        <div
          className={`w-full md:w-56 lg:w-64 xl:w-72 md:shrink min-w-0 border-r border-border flex-col bg-card ${
            selectedConv ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Top Bar: Title + Filter Tabs on SAME line */}
          <div className="p-2.5 sm:p-3 border-b border-border flex items-center justify-between gap-2 overflow-hidden shrink-0">
            <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-foreground shrink-0">
              <Users className="size-3.5 sm:size-4 text-accent-foreground" />
              <span className="hidden lg:inline">Conversations</span>
              <span className="lg:hidden">Chats</span>
            </div>

            {/* Responsive Filter Tabs */}
            <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg overflow-x-auto max-w-full shrink-0">
              {(["all", "open", "closed", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`text-[9px] sm:text-[10px] font-medium py-0.5 px-1.5 rounded-md capitalize transition-all cursor-pointer whitespace-nowrap ${
                    filter === tab
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No {filter !== "all" ? filter : ""} conversations
                </p>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      selectedConv?.id === conv.id
                        ? "border-accent-foreground/40 bg-accent-foreground/5"
                        : "border-transparent hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar className="size-8 shrink-0">
                        {conv.user.image && (
                          <AvatarImage src={conv.user.image} alt={conv.user.name} />
                        )}
                        <AvatarFallback className="text-[10px]">
                          {conv.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {conv.user.name}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge className="ml-1 h-4 min-w-4 px-1 text-[9px] bg-accent-foreground text-background border-none shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {conv.lastMessage ?? "No messages"}
                        </p>
                        <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                          {new Date(conv.lastAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Center Section: Main Chat Area */}
        <div
          className={`flex-1 min-w-0 flex-col overflow-hidden bg-card ${
            !selectedConv ? "hidden md:flex" : "flex"
          }`}
        >
          {!selectedConv ? (
            <Empty className="w-full h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquare />
                </EmptyMedia>
                <EmptyTitle>Select a conversation</EmptyTitle>
                <EmptyDescription>
                  Choose a user conversation from the sidebar to start replying.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-border flex items-center gap-3 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConv(null)}
                  className="md:hidden text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </Button>
                <Avatar className="size-9">
                  {selectedConv.user.image && (
                    <AvatarImage
                      src={selectedConv.user.image}
                      alt={selectedConv.user.name}
                    />
                  )}
                  <AvatarFallback>
                    {selectedConv.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground truncate">{selectedConv.user.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedConv.user.email}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <Badge
                    className={`text-[10px] hidden sm:inline-flex ${
                      selectedConv.isOpen
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                    variant="outline"
                  >
                    {selectedConv.isOpen ? "Open" : "Resolved"}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleResolve}
                    className="text-xs h-7 px-2.5 cursor-pointer"
                  >
                    {selectedConv.isOpen ? "Mark Resolved" : "Reopen"}
                  </Button>
                </div>
              </div>

              {/* Chat Messages Viewport */}
              <div className="flex-1 overflow-hidden p-0">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm gap-2">
                    <div className="size-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                    Loading conversation...
                  </div>
                ) : (
                  <MessageScrollerProvider>
                    <MessageScroller>
                      <MessageScrollerViewport>
                        <MessageScrollerContent className="p-(--card-spacing)">
                          <MessageGroup>
                            {messages.length === 0 ? (
                              <p className="text-center text-xs text-muted-foreground py-8">
                                No messages yet. Type below to send a reply.
                              </p>
                            ) : (
                              messages.map((msg) => (
                                <MessageScrollerItem
                                  key={msg.id}
                                  scrollAnchor={msg.role === "admin"}
                                >
                                  <Message align={msg.role === "admin" ? "end" : "start"}>
                                    <MessageAvatar>
                                      <Avatar size="sm">
                                        <AvatarFallback
                                          className={
                                            msg.role === "admin"
                                              ? "bg-accent-foreground text-background text-xs"
                                              : "text-xs"
                                          }
                                        >
                                          {msg.role === "admin"
                                            ? "AD"
                                            : selectedConv.user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    </MessageAvatar>
                                    <MessageContent>
                                      <MessageHeader className="text-xs font-semibold text-accent-foreground">
                                        {msg.senderName}
                                      </MessageHeader>
                                      <Bubble
                                        variant={msg.role === "admin" ? "default" : "muted"}
                                      >
                                        <BubbleContent>
                                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {msg.content}
                                          </p>
                                        </BubbleContent>
                                      </Bubble>
                                      <MessageFooter>{msg.timestamp}</MessageFooter>
                                    </MessageContent>
                                  </Message>
                                </MessageScrollerItem>
                              ))
                            )}

                            {userIsTyping && (
                              <MessageScrollerItem key="user-typing">
                                <Message align="start">
                                  <MessageAvatar>
                                    <Avatar size="sm">
                                      <AvatarFallback className="text-xs">
                                        {selectedConv.user.name.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  </MessageAvatar>
                                  <MessageContent>
                                    <div className="bg-muted/80 border border-border/60 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                    </div>
                                    <MessageFooter>{selectedConv.user.name} is typing...</MessageFooter>
                                  </MessageContent>
                                </Message>
                              </MessageScrollerItem>
                            )}

                            {isSending && (
                              <MessageScrollerItem key="sending">
                                <Message align="end">
                                  <MessageAvatar>
                                    <Avatar size="sm">
                                      <AvatarFallback className="bg-accent-foreground text-background text-xs">
                                        AD
                                      </AvatarFallback>
                                    </Avatar>
                                  </MessageAvatar>
                                  <MessageContent>
                                    <div className="bg-muted/80 border border-border/60 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                      <span className="size-2 rounded-full bg-accent-foreground/70 animate-pulse" />
                                    </div>
                                  </MessageContent>
                                </Message>
                              </MessageScrollerItem>
                            )}
                          </MessageGroup>
                        </MessageScrollerContent>
                      </MessageScrollerViewport>
                      <MessageScrollerButton />
                    </MessageScroller>
                  </MessageScrollerProvider>
                )}
              </div>

              <Separator />

              {/* Chat Input + Quick Replies */}
              <div className="p-3 sm:p-4 flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between">
                  <Popover open={cannedOpen} onOpenChange={setCannedOpen}>
                    <PopoverTrigger render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 gap-1.5 text-muted-foreground hover:text-accent-foreground cursor-pointer"
                      >
                        <Zap className="size-3.5 text-amber-500" />
                        Quick Replies
                      </Button>
                    } />
                    <PopoverContent align="start" className="w-72 sm:w-80 p-2">
                      <p className="text-xs font-semibold text-foreground px-2 py-1 border-b mb-1">
                        Canned Responses
                      </p>
                      <div className="flex flex-col gap-1">
                        {CANNED_REPLIES.map((reply, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setInputValue(reply);
                              setCannedOpen(false);
                            }}
                            className="text-left text-xs p-2 rounded-md hover:bg-accent-foreground/10 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <InputGroup>
                    <InputGroupTextarea
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={`Reply to ${selectedConv.user.name}...`}
                      disabled={isSending || !isConnected}
                      rows={2}
                      className="text-sm bg-transparent min-h-12 max-h-24 overflow-y-auto"
                    />
                    <InputGroupAddon align="block-end" className="pt-1">
                      <InputGroupButton
                        type="submit"
                        variant="default"
                        size="icon-sm"
                        disabled={!inputValue.trim() || isSending || !isConnected}
                        className="ml-auto bg-accent-foreground text-background hover:bg-accent-foreground/90 cursor-pointer"
                      >
                        <ArrowUpIcon className="size-4" />
                        <span className="sr-only">Send Reply</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Right Section: User Info Panel with ScrollArea */}
        {selectedConv && (
          <ScrollArea className="w-60 lg:w-64 shrink-0 border-l border-border hidden xl:block bg-card">
            <div className="p-4 gap-4 flex flex-col">
              <div className="flex flex-col items-center text-center pb-3 border-b border-border">
                <Avatar className="size-14 mb-2">
                  {selectedConv.user.image && (
                    <AvatarImage src={selectedConv.user.image} alt={selectedConv.user.name} />
                  )}
                  <AvatarFallback className="text-sm">
                    {selectedConv.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-sm font-semibold text-foreground">{selectedConv.user.name}</h3>
                <p className="text-xs text-muted-foreground truncate w-full">{selectedConv.user.email}</p>
              </div>

              {loadingUser ? (
                <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
                  <div className="size-3 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                  Loading profile...
                </div>
              ) : userDetails ? (
                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] mb-1">
                      <DollarSign className="size-3 text-emerald-500" /> Current Balance
                    </span>
                    <p className="text-base font-bold text-foreground">
                      ${userDetails.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] mb-1">
                      <DollarSign className="size-3 text-blue-500" /> Total Deposited
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      ${userDetails.totalDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] mb-1">
                      <ShieldCheck className="size-3 text-amber-500" /> KYC Status
                    </span>
                    <Badge
                      className={`text-[10px] capitalize ${
                        userDetails.kycStatus === "APPROVED"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : userDetails.kycStatus === "PENDING"
                          ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                          : userDetails.kycStatus === "REJECTED"
                          ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                      variant="outline"
                    >
                      {userDetails.kycStatus}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] mb-1">
                      <User className="size-3" /> Email Verification
                    </span>
                    <Badge
                      className={`text-[10px] ${
                        userDetails.emailVerified
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                      variant="outline"
                    >
                      {userDetails.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] mb-1">
                      <Calendar className="size-3" /> Member Since
                    </span>
                    <p className="text-xs font-medium text-foreground">
                      {format(new Date(userDetails.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}


