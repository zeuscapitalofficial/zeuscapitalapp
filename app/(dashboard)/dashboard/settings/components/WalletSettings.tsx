"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, Plus, Trash2, ExternalLink, Wallet, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface WalletAddress {
  id: string;
  currency: string;
  network: string;
  address: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  type: "bank" | "card";
  name: string;
  details: string;
  isDefault: boolean;
  createdAt: string;
}

const supportedCurrencies = [
  { code: "BTC", name: "Bitcoin", networks: ["BTC", "Lightning"] },
  { code: "ETH", name: "Ethereum", networks: ["ERC20", "Arbitrum", "Optimism", "Base"] },
  { code: "USDT", name: "Tether", networks: ["ERC20", "TRC20", "BEP20", "Polygon"] },
  { code: "USDC", name: "USD Coin", networks: ["ERC20", "Polygon", "Arbitrum", "Base"] },
  { code: "LTC", name: "Litecoin", networks: ["LTC"] },
  { code: "DOGE", name: "Dogecoin", networks: ["DOGE"] },
  { code: "BCH", name: "Bitcoin Cash", networks: ["BCH"] },
];

export function WalletSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newWallet, setNewWallet] = useState({ currency: "BTC", network: "BTC", label: "" });
  const [newPayment, setNewPayment] = useState({ type: "bank" as "bank" | "card", name: "", details: "" });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [walletsRes, paymentsRes] = await Promise.all([
        fetch("/api/user/settings/wallets"),
        fetch("/api/user/settings/payment-methods"),
      ]);

      if (walletsRes.ok) {
        const data = await walletsRes.json();
        setWallets(data.wallets || []);
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet.label.trim()) {
      toast.error("Please enter a label for this wallet");
      return;
    }

    try {
      const res = await fetch("/api/user/settings/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWallet),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add wallet");

      toast.success("Wallet address added");
      setShowAddWallet(false);
      setNewWallet({ currency: "BTC", network: "BTC", label: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add wallet");
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.name.trim() || !newPayment.details.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/user/settings/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add payment method");

      toast.success("Payment method added");
      setShowAddPayment(false);
      setNewPayment({ type: "bank", name: "", details: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add payment method");
    }
  };

  const handleDeleteWallet = async (id: string) => {
    if (!confirm("Are you sure you want to remove this wallet address?")) return;

    try {
      const res = await fetch(`/api/user/settings/wallets/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete wallet");

      toast.success("Wallet removed");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete wallet");
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Are you sure you want to remove this payment method?")) return;

    try {
      const res = await fetch(`/api/user/settings/payment-methods/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete payment method");

      toast.success("Payment method removed");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete payment method");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getNetworksForCurrency = (currency: string) => {
    const curr = supportedCurrencies.find(c => c.code === currency);
    return curr?.networks || [];
  };

  if (loading) {
    return (
      <div className="space-y-lg max-w-[620px]">
        <div className="flex items-center justify-center py-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#8B7CFF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg max-w-[620px]">
      {/* Wallet Addresses */}
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <Wallet className="w-5 h-5 text-[#8B7CFF]" />
            <h3 className="text-[18px] font-semibold text-white">Wallet Addresses</h3>
          </div>
          <Button onClick={() => setShowAddWallet(true)} className="h-10 rounded-[14px] px-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {wallets.length === 0 ? (
          <div className="p-lg border border-dashed border-[rgba(255,255,255,0.06)] rounded-[16px] text-center">
            <Wallet className="w-12 h-12 mx-auto mb-sm text-[rgba(255,255,255,0.2)]" />
            <p className="text-[14px] text-[rgba(255,255,255,0.48)]">No wallet addresses added yet</p>
            <p className="text-[12px] text-[rgba(255,255,255,0.32)] mt-xs">Add your deposit addresses for each cryptocurrency</p>
          </div>
        ) : (
          <div className="space-y-sm">
            {wallets.map(wallet => (
              <div key={wallet.id} className="flex items-center justify-between p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="flex items-center gap-md">
                  <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px]">
                    <Wallet className="w-5 h-5 text-[#8B7CFF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-xs">
                      <span className="text-[14px] font-medium text-white">{wallet.currency} ({wallet.network})</span>
                      {wallet.isDefault && (
                        <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold bg-[#8B7CFF]/20 text-[#8B7CFF] uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[rgba(255,255,255,0.48)]">{wallet.label}</p>
                    <p className="text-[11px] font-mono text-[rgba(255,255,255,0.32)] mt-0.5">{wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(wallet.address)} className="h-8 rounded-[10px]">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteWallet(wallet.id)} className="h-8 rounded-[10px] text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddWallet && (
          <form onSubmit={handleAddWallet} className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="flex flex-col gap-xs">
                <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Currency</Label>
                <Select value={newWallet.currency} onValueChange={v => setNewWallet(prev => ({ ...prev, currency: v }))}>
                  <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCurrencies.map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-xs">
                <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Network</Label>
                <Select value={newWallet.network} onValueChange={v => setNewWallet(prev => ({ ...prev, network: v }))}>
                  <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNetworksForCurrency(newWallet.currency).map(n => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-xs">
                <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Label</Label>
                <Input
                  value={newWallet.label}
                  onChange={e => setNewWallet(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Main BTC Wallet"
                  className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="flex gap-sm">
              <Button type="submit" className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] px-md">
                Add Wallet
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddWallet(false)} className="h-10 rounded-[14px] px-md">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Payment Methods */}
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <CreditCard className="w-5 h-5 text-[#8B7CFF]" />
            <h3 className="text-[18px] font-semibold text-white">Payment Methods</h3>
          </div>
          <Button onClick={() => setShowAddPayment(true)} className="h-10 rounded-[14px] px-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="p-lg border border-dashed border-[rgba(255,255,255,0.06)] rounded-[16px] text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-sm text-[rgba(255,255,255,0.2)]" />
            <p className="text-[14px] text-[rgba(255,255,255,0.48)]">No payment methods added</p>
            <p className="text-[12px] text-[rgba(255,255,255,0.32)] mt-xs">Link bank accounts or cards for fiat deposits/withdrawals</p>
          </div>
        ) : (
          <div className="space-y-sm">
            {paymentMethods.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="flex items-center gap-md">
                  <div className={`bg-${payment.type === "bank" ? "blue" : "green"}-500/20 p-2 rounded-[10px]`}>
                    {payment.type === "bank" ? (
                      <Wallet className="w-5 h-5 text-blue-400" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-xs">
                      <span className="text-[14px] font-medium text-white">{payment.name}</span>
                      {payment.isDefault && (
                        <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold bg-[#8B7CFF]/20 text-[#8B7CFF] uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[rgba(255,255,255,0.48)] font-mono">{payment.details}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePayment(payment.id)} className="h-8 rounded-[10px] text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showAddPayment && (
          <form onSubmit={handleAddPayment} className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Type</Label>
                <Select value={newPayment.type} onValueChange={v => setNewPayment(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-xs">
                <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Name</Label>
                <Input
                  value={newPayment.name}
                  onChange={e => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Chase Checking, Visa ending in 4242"
                  className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <Label className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">Details</Label>
              <Input
                value={newPayment.details}
                onChange={e => setNewPayment(prev => ({ ...prev, details: e.target.value }))}
                placeholder={newPayment.type === "bank" ? "Account number, routing number, bank name" : "Card last 4 digits, expiry, cardholder name"}
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="flex gap-sm">
              <Button type="submit" className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] px-md">
                Add Payment Method
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddPayment(false)} className="h-10 rounded-[14px] px-md">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Transaction Limits */}
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md">
        <div className="flex items-center gap-xs">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-[18px] font-semibold text-white">Transaction Limits</h3>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[14px] p-md">
          <p className="text-[13px] text-yellow-400 font-medium mb-sm">Current Limits (Basic Tier)</p>
          <ul className="space-y-xs text-[13px] text-[rgba(255,255,255,0.72)]">
            <li className="flex items-center gap-xs"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> 1 withdrawal per day</li>
            <li className="flex items-center gap-xs"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> $10,000 daily withdrawal limit</li>
            <li className="flex items-center gap-xs"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> $50,000 monthly withdrawal limit</li>
          </ul>
        </div>
        <Button variant="outline" className="w-fit border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px] px-md">
          Upgrade Account for Higher Limits
        </Button>
      </Card>
    </div>
  );
}