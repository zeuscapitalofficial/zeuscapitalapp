"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  CheckCircle2,
  Coins,
  Copy,
  Loader2,
  MessageSquare,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export interface DepositDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  initialAmount?: number;
  isAmountDisabled?: boolean;
  customType?: "PURCHASE" | "DEPOSIT";
  itemTitle?: string;
}

const PAYMENT_METHODS = [
  { id: "btc", label: "Bitcoin", symbol: "BTC", type: "crypto" },
  { id: "usdt", label: "Tether (USDT)", symbol: "USDT", type: "crypto" },
  { id: "eth", label: "Ethereum", symbol: "ETH", type: "crypto" },
  { id: "sol", label: "Solana", symbol: "SOL", type: "crypto" },
  { id: "bank", label: "Bank Wire Transfer", symbol: "USD", type: "manual" },
  { id: "card", label: "Credit / Debit Card", symbol: "USD", type: "manual" },
];

const CRYPTO_CONFIG: Record<
  string,
  {
    address: string;
    network: string;
    image: string;
    priceUsd: number;
  }
> = {
  btc: {
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Native",
    image: "/btc.jpeg",
    priceUsd: 68500,
  },
  usdt: {
    address: "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6",
    network: "Binance Smart Chain",
    image: "/usdt.jpeg",
    priceUsd: 1.0,
  },
  eth: {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    network: "Ethereum (ERC-20)",
    image: "/eth.jpeg",
    priceUsd: 2100.0,
  },
  sol: {
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCN",
    network: "Solana",
    image: "/sol.jpeg",
    priceUsd: 95.0,
  },
};

export function DepositDialog({
  open,
  onOpenChange,
  trigger,
  initialAmount,
  isAmountDisabled = false,
  customType = "DEPOSIT",
  itemTitle,
}: DepositDialogProps) {
  const router = useRouter();
  const [method, setMethod] = useState("btc");
  const [usdAmount, setUsdAmount] = useState(
    initialAmount ? String(initialAmount) : ""
  );
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (initialAmount) {
      setUsdAmount(String(initialAmount));
    }
  }, [initialAmount]);

  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === method) || PAYMENT_METHODS[0];
  const isCrypto = selectedMethod.type === "crypto";
  const isManual = selectedMethod.type === "manual";
  const cryptoCfg = CRYPTO_CONFIG[method];

  const tokenAmount =
    cryptoCfg && usdAmount && Number(usdAmount) > 0
      ? (Number(usdAmount) / cryptoCfg.priceUsd).toFixed(6)
      : "0.000000";

  const handleCopy = () => {
    if (!cryptoCfg) return;
    navigator.clipboard.writeText(cryptoCfg.address);
    setCopied(true);
    toast.success("Wallet address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to generate a realistic random crypto transaction hash
  const generateRandomTxHash = (coinSymbol: string) => {
    const chars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return coinSymbol === "btc" ? hash : `0x${hash}`;
  };

  const handleSubmitTx = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(usdAmount);
    if (!usdAmount || isNaN(numAmount) || numAmount < 50) {
      toast.error("Minimum deposit amount is $50 USD.");
      return;
    }

    setSubmitting(true);
    const generatedHash = generateRandomTxHash(method);

    try {
      await fetch("/api/user/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: customType,
          asset: `${method.toUpperCase()}${itemTitle ? ` - ${itemTitle}` : ""}`,
          amount: numAmount,
          txHash: generatedHash,
          address: cryptoCfg?.address || null,
        }),
      });
      toast.success("Deposit request logged as Pending!");
    } catch (err) {
      console.error("Failed to record deposit tx:", err);
      toast.error("Failed to record deposit request.");
    } finally {
      setSubmitting(false);
    }

    setSubmitted(true);
    setTxHash(generatedHash);
    setTimeout(() => {
      setSubmitted(false);
      setTxHash("");
      if (!isAmountDisabled) setUsdAmount("");
      onOpenChange?.(false);
    }, 800);
  };

  const handleOpenChat = () => {
    onOpenChange?.(false);
    router.push("/?openChat=true");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent className="max-w-90 md:max-w-155 bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center shrink-0">
              <Coins className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {itemTitle ? `Purchase ${itemTitle}` : "Deposit Capital"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {itemTitle
                  ? "Complete payment to activate your plan"
                  : "Fund your account balance via instant crypto or manual transfer"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Amount Input */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between items-center text-xs font-semibold">
              <Label htmlFor="deposit-usd-amount" className="text-xs text-foreground">
                Deposit Amount (USD) <span className="text-rose-500">*</span>
              </Label>
              <span className="text-muted-foreground text-[11px]">
                Min Deposit: $50 USD
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                $
              </span>
              <Input
                id="deposit-usd-amount"
                type="number"
                min={50}
                disabled={isAmountDisabled || submitting}
                placeholder="500.00"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="pl-7 h-10 font-bold text-sm bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Payment Method Select Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Select Payment Method
            </Label>
            <Select
              value={method}
              onValueChange={(value) => setMethod(value ?? "btc")}
            >
              <SelectTrigger className="w-full h-10 text-xs font-semibold bg-background border-border">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-xs">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span>{m.label}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({m.symbol})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── CRYPTO METHOD ── */}
          {isCrypto && cryptoCfg && (
            <div className="space-y-4 pt-1">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground">Network Protocol:</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {cryptoCfg.network}
                  </Badge>
                </div>
                {/* QR Code Preview */}
                <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-background border border-border gap-2">
                  <img
                    src={cryptoCfg.image}
                    alt={`${selectedMethod.label} Deposit QR Code`}
                    className="w-48 h-48 rounded-xl border border-border p-2 bg-white object-contain shadow-xs"
                  />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Scan QR code with your wallet app to transfer
                  </span>
                </div>

                {/* Wallet Address Display */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Destination Wallet Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={cryptoCfg.address}
                      className="font-mono text-xs bg-background border-border text-foreground select-all h-9"
                    />
                    <Button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 gap-1 bg-accent-foreground text-background hover:bg-accent-foreground/90 h-9 text-xs font-semibold cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Conversion Summary */}
                <div className="p-2.5 rounded-lg bg-background border border-border/80 text-xs space-y-1">
                  {usdAmount && Number(usdAmount) > 0 ? (
                    <p className="text-muted-foreground">
                      Please send exactly{" "}
                      <strong className="text-foreground font-mono">
                        {tokenAmount} {method.toUpperCase()}
                      </strong>{" "}
                      (≈ ${Number(usdAmount).toLocaleString()} USD).
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Enter an amount above to calculate required crypto token amount.
                    </p>
                  )}
                  <p className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                    ⚠ Kindly ensure you select the appropriate network for your deposit.
                  </p>
                </div>
              </div>

              {/* Deposit Confirmation Form */}
              <form
                onSubmit={handleSubmitTx}
                className="space-y-3 border-t border-border pt-3"
              >
                {submitted && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="size-4 shrink-0" />
                      Deposit Submitted & Logged as Pending!
                    </div>
                    <p className="font-mono text-[10px] opacity-90 break-all">
                      TxID Hash: {txHash}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || submitted}
                  className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 cursor-pointer gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Submitting Deposit...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Confirmation Generated
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Confirm Deposit & Generate TxID
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* ── MANUAL PAYMENT ── */}
          {isManual && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                <p className="font-semibold text-foreground text-sm">
                  Manual Payment Required
                </p>
                <p className="text-muted-foreground">
                  You are initiating a{" "}
                  <strong className="text-foreground">
                    {selectedMethod.label}
                  </strong>{" "}
                  deposit
                  {usdAmount && Number(usdAmount) > 0 ? (
                    <>
                      {" "}
                      of{" "}
                      <strong className="text-foreground">
                        ${Number(usdAmount).toLocaleString()} USD
                      </strong>
                    </>
                  ) : (
                    ""
                  )}
                  . This is a manual transfer that requires coordination with
                  our support team.
                </p>
                <p className="text-muted-foreground">
                  Please open the live chat and our team will provide you with
                  the exact payment details, reference number, and instructions
                  to complete your deposit.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleOpenChat}
                  className="flex-1 bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="size-3.5" />
                  Open Chat
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  className="flex-1 text-xs h-9 gap-1.5 cursor-pointer"
                >
                  <X className="size-3.5" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
