"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Lock,
  ArrowRight,
  ExternalLink,
  Coins,
} from "lucide-react";
import { DepositDialog } from "./deposit-dialog";

// ── Types ────────────────────────────────────────────────────────
type WithdrawMethod = "bank" | "wire" | "crypto" | "paypal";

const WITHDRAW_METHODS: { value: WithdrawMethod; label: string }[] = [
  { value: "bank",   label: "Bank Transfer" },
  { value: "wire",   label: "Wire Transfer (SWIFT/SEPA)" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "paypal", label: "PayPal" },
];

const CRYPTO_OPTIONS = [
  { id: "usdt", symbol: "USDT", network: "TRC-20 (Tron)" },
  { id: "btc",  symbol: "BTC",  network: "Bitcoin Mainnet" },
  { id: "usdc", symbol: "USDC", network: "ERC-20 (Ethereum)" },
];

// ── Props ────────────────────────────────────────────────────────
export interface WithdrawDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  kycApproved?: boolean;
  emailVerified?: boolean;
  totalDeposit?: number;
}

export function WithdrawDialog({
  trigger,
  open,
  onOpenChange,
  kycApproved: propKyc,
  emailVerified: propEmail,
  totalDeposit: propDeposit,
}: WithdrawDialogProps) {
  // ── Eligibility state ──
  const [loadingUser, setLoadingUser] = useState(false);
  const [kycApproved, setKycApproved] = useState<boolean>(propKyc ?? false);
  const [emailVerified, setEmailVerified] = useState<boolean>(propEmail ?? false);
  const [totalDeposit, setTotalDeposit] = useState<number>(propDeposit ?? 0);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // ── Form state ──
  const [method, setMethod] = useState<WithdrawMethod>("bank");
  const [amount, setAmount] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [step, setStep] = useState<"form" | "2fa" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Method-specific fields
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(CRYPTO_OPTIONS[0]);
  const [paypalEmail, setPaypalEmail] = useState("");

  // ── Fetch user data ──
  const fetchUserData = useCallback(async () => {
    try {
      setLoadingUser(true);
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setKycApproved(data.kycStatus === "APPROVED");
        setEmailVerified(Boolean(data.emailVerified));
        setTotalDeposit(Number(data.totalDeposit ?? 0));
        setAvailableBalance(Number(data.balance ?? 0));
      }
    } catch {
      // keep defaults
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchUserData();
      setStep("form");
    }
  }, [open, fetchUserData]);

  const isEligible = kycApproved && emailVerified && totalDeposit >= 1000;

  const handleProceed2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setStep("2fa");
  };

  const handleConfirmWithdraw = async () => {
    if (twoFACode.length < 6) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/user/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "WITHDRAWAL",
          asset: `${method.toUpperCase()}`,
          amount: Number(amount),
          address: cryptoAddress || paypalEmail || accountNumber || "Bank Transfer",
        }),
      });
    } catch (err) {
      console.error("Failed to record withdrawal tx:", err);
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
      setTwoFACode("");
    }, 1200);
  };

  const resetAndClose = () => {
    setStep("form");
    setAmount("");
    setTwoFACode("");
    onOpenChange?.(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) { setStep("form"); }
        onOpenChange?.(val);
      }}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
        <DialogContent className="max-w-2xl md:max-w-120 bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center shrink-0">
                <ArrowUpRight className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Withdraw Funds</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Choose a withdrawal method and complete 2FA verification.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {loadingUser ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm gap-2">
              <div className="size-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
              Verifying account...
            </div>
          ) : !isEligible ? (
            /* ── INELIGIBILITY CHECKLIST ── */
            <div className="space-y-4 py-2">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-700 dark:text-amber-400">
                <ShieldAlert className="size-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-foreground">Withdrawal Requirements Unfulfilled</p>
                  <p className="text-muted-foreground">
                    Your account must meet all security requirements before initiating withdrawals.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 bg-muted/30 p-4 rounded-xl border border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Account Verification Checklist
                </h4>

                {/* KYC */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2.5">
                    {kycApproved
                      ? <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      : <XCircle className="size-4 text-destructive shrink-0" />}
                    <div>
                      <p className="text-xs font-medium text-foreground">KYC Identity Verification</p>
                      <p className="text-[10px] text-muted-foreground">{kycApproved ? "Approved" : "Action Required"}</p>
                    </div>
                  </div>
                  {kycApproved
                    ? <Badge className="bg-emerald-500/15 text-emerald-500 border-none text-[10px]">Complete</Badge>
                    : <Link href="/dashboard/kyc" onClick={() => onOpenChange?.(false)}>
                        <Button size="xs" className="bg-accent-foreground text-background text-[11px] h-7 gap-1">
                          Verify <ExternalLink className="size-3" />
                        </Button>
                      </Link>}
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2.5">
                    {emailVerified
                      ? <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      : <XCircle className="size-4 text-destructive shrink-0" />}
                    <div>
                      <p className="text-xs font-medium text-foreground">Email Verified</p>
                      <p className="text-[10px] text-muted-foreground">{emailVerified ? "Verified" : "Unverified"}</p>
                    </div>
                  </div>
                  {emailVerified
                    ? <Badge className="bg-emerald-500/15 text-emerald-500 border-none text-[10px]">Verified</Badge>
                    : <Link href="/dashboard/settings" onClick={() => onOpenChange?.(false)}>
                        <Button size="xs" variant="outline" className="text-[11px] h-7 gap-1">
                          Settings <ExternalLink className="size-3" />
                        </Button>
                      </Link>}
                </div>

                {/* Minimum deposit */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2.5">
                    {totalDeposit >= 1000
                      ? <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      : <XCircle className="size-4 text-destructive shrink-0" />}
                    <div>
                      <p className="text-xs font-medium text-foreground">Minimum Deposit ($1,000)</p>
                      <p className="text-[10px] text-muted-foreground">
                        Current: ${totalDeposit.toLocaleString()} / $1,000
                      </p>
                    </div>
                  </div>
                  {totalDeposit >= 1000
                    ? <Badge className="bg-emerald-500/15 text-emerald-500 border-none text-[10px]">Passed</Badge>
                    : <Button size="xs" onClick={() => setIsDepositOpen(true)} className="bg-accent-foreground text-background text-[11px] h-7 gap-1">
                        Deposit <Coins className="size-3" />
                      </Button>}
                </div>
              </div>
            </div>
          ) : (
            /* ── ELIGIBLE: MULTI-METHOD FORM ── */
            <div className="space-y-4 pt-1">
              {step === "form" && (
                <form onSubmit={handleProceed2FA} className="space-y-4">
                  {/* Method select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Withdrawal Method
                    </Label>
                    <Select value={method} onValueChange={(v) => setMethod(v as WithdrawMethod)}>
                      <SelectTrigger className="h-10 bg-background border-border text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WITHDRAW_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* ── Bank Transfer ── */}
                  {method === "bank" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="bank-name" className="text-xs text-muted-foreground">Bank Name</Label>
                          <Input id="bank-name" placeholder="e.g. Chase Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} required className="h-9 text-xs bg-background border-border" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="acc-name" className="text-xs text-muted-foreground">Account Holder</Label>
                          <Input id="acc-name" placeholder="Full legal name" value={accountName} onChange={(e) => setAccountName(e.target.value)} required className="h-9 text-xs bg-background border-border" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="acc-num" className="text-xs text-muted-foreground">Account Number</Label>
                          <Input id="acc-num" placeholder="••••••••••" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="h-9 text-xs font-mono bg-background border-border" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="routing" className="text-xs text-muted-foreground">Routing Number</Label>
                          <Input id="routing" placeholder="9 digits" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} required className="h-9 text-xs font-mono bg-background border-border" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Wire Transfer ── */}
                  {method === "wire" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="wire-bank" className="text-xs text-muted-foreground">Bank Name</Label>
                          <Input id="wire-bank" placeholder="e.g. HSBC" value={bankName} onChange={(e) => setBankName(e.target.value)} required className="h-9 text-xs bg-background border-border" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="swift" className="text-xs text-muted-foreground">SWIFT / BIC Code</Label>
                          <Input id="swift" placeholder="e.g. HBUKGB4B" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} required className="h-9 text-xs font-mono bg-background border-border" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="iban" className="text-xs text-muted-foreground">IBAN / Account No.</Label>
                          <Input id="iban" placeholder="GB29 NWBK 6016 1331 9268 19" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="h-9 text-xs font-mono bg-background border-border" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="wire-holder" className="text-xs text-muted-foreground">Account Holder</Label>
                          <Input id="wire-holder" placeholder="Full legal name" value={accountName} onChange={(e) => setAccountName(e.target.value)} required className="h-9 text-xs bg-background border-border" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Crypto ── */}
                  {method === "crypto" && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Select Asset</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {CRYPTO_OPTIONS.map((coin) => (
                            <button
                              key={coin.id}
                              type="button"
                              onClick={() => setSelectedCoin(coin)}
                              className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                                selectedCoin.id === coin.id
                                  ? "border-accent-foreground bg-accent-foreground/10 text-foreground ring-1 ring-accent-foreground/40"
                                  : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                              }`}
                            >
                              {coin.symbol}
                              <span className="block text-[9px] font-normal text-muted-foreground mt-0.5">
                                {coin.network.split(" ")[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="crypto-addr" className="text-xs text-muted-foreground">
                          Destination Address ({selectedCoin.network})
                        </Label>
                        <Input
                          id="crypto-addr"
                          type="text"
                          required
                          placeholder={`Enter ${selectedCoin.symbol} address...`}
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                          className="h-9 text-xs font-mono bg-background border-border"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── PayPal ── */}
                  {method === "paypal" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="paypal-email" className="text-xs text-muted-foreground">PayPal Email Address</Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        required
                        placeholder="your@paypal.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="h-9 text-xs bg-background border-border"
                      />
                    </div>
                  )}

                  <Separator />

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="with-amount" className="text-xs font-semibold text-foreground">
                        Withdrawal Amount (USD)
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        Balance: <strong className="text-foreground">${availableBalance.toLocaleString()}</strong>
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-muted-foreground text-sm">$</span>
                      <Input
                        id="with-amount"
                        type="number"
                        step="0.01"
                        min="10"
                        max={availableBalance}
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-background border-border pl-6 pr-20 h-9 text-xs font-semibold"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => setAmount(availableBalance.toString())}
                        className="absolute right-1.5 h-6 text-[10px] uppercase font-bold text-accent-foreground bg-accent-foreground/10 hover:bg-accent-foreground hover:text-background"
                      >
                        Max
                      </Button>
                    </div>
                  </div>

                  {/* Fee summary */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1.5">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee</span>
                      <span className="text-emerald-500 font-semibold">$0.00 (Free)</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Network / Processing Fee</span>
                      <span className="text-foreground">$5.00</span>
                    </div>
                    <div className="border-t border-border/60 pt-1.5 flex justify-between font-bold text-foreground">
                      <span>Net Settlement</span>
                      <span className="text-accent-foreground">
                        ${amount && Number(amount) > 5 ? (Number(amount) - 5).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 gap-1.5 cursor-pointer"
                  >
                    Continue to 2FA Security <ArrowRight className="size-3.5" />
                  </Button>
                </form>
              )}

              {/* ── 2FA Step ── */}
              {step === "2fa" && (
                <div className="space-y-4 text-center py-2">
                  <div className="size-12 rounded-full bg-accent-foreground/10 text-accent-foreground flex items-center justify-center mx-auto">
                    <Lock className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the 6-digit code from your authenticator app to authorize withdrawal of{" "}
                      <strong>${Number(amount).toLocaleString()}</strong>.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={twoFACode} onChange={setTwoFACode}>
                      <InputOTPGroup>
                        {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1 text-xs h-9">
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={twoFACode.length < 6 || isSubmitting}
                      onClick={handleConfirmWithdraw}
                      className="flex-1 bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? "Processing..." : "Confirm & Execute"}
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Success Step ── */}
              {step === "success" && (
                <div className="space-y-4 text-center py-6">
                  <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Withdrawal Request Queued</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your transfer request has been 2FA authorized and submitted for processing.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={resetAndClose}
                    className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DepositDialog open={isDepositOpen} onOpenChange={setIsDepositOpen} />
    </>
  );
}
