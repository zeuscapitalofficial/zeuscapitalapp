"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Copy,
  Plus,
  Trash2,
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const supportedCurrencies = [
  { code: "BTC", name: "Bitcoin", networks: ["BTC", "Lightning"] },
  { code: "ETH", name: "Ethereum", networks: ["ERC20", "Arbitrum", "Base"] },
  { code: "USDT", name: "Tether USD", networks: ["TRC20", "ERC20", "BEP20"] },
  { code: "USDC", name: "USD Coin", networks: ["ERC20", "Polygon", "Base"] },
  { code: "SOL", name: "Solana", networks: ["SOL"] },
  { code: "LTC", name: "Litecoin", networks: ["LTC"] },
];

export function WalletSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [addingWallet, setAddingWallet] = useState(false);

  const [newWallet, setNewWallet] = useState({
    currency: "BTC",
    network: "BTC",
    address: "",
    label: "",
  });

  useEffect(() => {
    fetchWallets();
  }, [user]);

  const fetchWallets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings/wallets");
      if (res.ok) {
        const data = await res.json();
        setWallets(data.wallets || []);
      }
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currency: string | null) => {
    if (!currency) return;
    const config = supportedCurrencies.find((c) => c.code === currency);
    setNewWallet((prev) => ({
      ...prev,
      currency,
      network: config?.networks[0] || currency,
    }));
  };

  const handleAddWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet.address.trim()) {
      toast.error("Please enter a valid wallet address.");
      return;
    }

    setAddingWallet(true);
    try {
      const res = await fetch("/api/user/settings/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWallet),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add wallet");

      toast.success("Withdrawal wallet address added successfully");
      setShowAddWallet(false);
      setNewWallet({ currency: "BTC", network: "BTC", address: "", label: "" });
      fetchWallets();
    } catch (error: any) {
      toast.error(error.message || "Failed to add wallet address");
    } finally {
      setAddingWallet(false);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      const res = await fetch(`/api/user/settings/wallets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete wallet");
      toast.success("Wallet address removed");
      setWallets((prev) => prev.filter((w) => w.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete wallet");
    }
  };

  const selectedCurrencyConfig = supportedCurrencies.find(
    (c) => c.code === newWallet.currency,
  );

  return (
    <div className="space-y-6 w-full">
      {/* Wallet Addresses Card */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Wallet className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Withdrawal Wallets
              </CardTitle>
              <CardDescription className="text-xs">
                Saved crypto addresses for automatic profit & balance
                withdrawals.
              </CardDescription>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAddWallet(true)}
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="size-3.5" /> Add Wallet Address
          </Button>
        </CardHeader>

        <CardContent className="pt-5 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-accent-foreground" />
              Loading saved wallets...
            </div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/20 p-6 space-y-2">
              <Wallet className="size-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground">
                No Withdrawal Wallets Added
              </p>
              <p className="text-[11px] text-muted-foreground mx-auto">
                Add your external Bitcoin, Ethereum, or USDT wallet address to
                receive automatic payout distributions.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddWallet(true)}
                className="text-xs h-8 gap-1 cursor-pointer mt-2"
              >
                <Plus className="size-3.5" /> Add Wallet Address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-lg border border-border bg-background space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold bg-accent-foreground/10 text-accent-foreground border-accent-foreground/30"
                      >
                        {w.currency}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono text-muted-foreground"
                      >
                        {w.network}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWallet(w.id)}
                      className="size-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-foreground block truncate">
                      {w.label || `${w.currency} Wallet`}
                    </span>
                    <p className="font-mono text-[11px] text-muted-foreground truncate select-all mt-0.5">
                      {w.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Wallet Modal */}
      <Dialog open={showAddWallet} onOpenChange={setShowAddWallet}>
        <DialogContent className="sm:max-w-130">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wallet className="size-5 text-emerald-500" />
              Add Withdrawal Wallet
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Save a crypto wallet address for quick withdrawal processing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddWalletSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="currency"
                  className="text-xs font-semibold text-foreground"
                >
                  Cryptocurrency
                </Label>
                <Select
                  value={newWallet.currency}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger id="currency" className="text-xs h-9 w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCurrencies.map((c) => (
                      <SelectItem
                        key={c.code}
                        value={c.code}
                        className="text-xs"
                      >
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="network"
                  className="text-xs font-semibold text-foreground"
                >
                  Network Protocol
                </Label>
                <Select
                  value={newWallet.network}
                  onValueChange={(val) => {
                    if (!val) return;
                    setNewWallet((prev) => ({ ...prev, network: val }));
                  }}
                >
                  <SelectTrigger id="network" className="text-xs h-9 w-full">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCurrencyConfig?.networks.map((net) => (
                      <SelectItem key={net} value={net} className="text-xs">
                        {net}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="label"
                className="text-xs font-semibold text-foreground"
              >
                Wallet Label (Optional)
              </Label>
              <Input
                id="label"
                type="text"
                placeholder="e.g. My Ledger Cold Storage"
                value={newWallet.label}
                onChange={(e) =>
                  setNewWallet((prev) => ({ ...prev, label: e.target.value }))
                }
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="address"
                className="text-xs font-semibold text-foreground"
              >
                Destination Wallet Address
              </Label>
              <Input
                id="address"
                type="text"
                required
                placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                value={newWallet.address}
                onChange={(e) =>
                  setNewWallet((prev) => ({ ...prev, address: e.target.value }))
                }
                className="text-xs h-9 font-mono"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddWallet(false)}
                className="text-xs h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={addingWallet}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer"
              >
                {addingWallet ? "Saving..." : "Save Wallet Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
