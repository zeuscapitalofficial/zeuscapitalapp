"use client";

import { useState, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
}

const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "CH", name: "Switzerland", dialCode: "+41" },
];

export function AddressSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [address, setAddress] = useState<AddressData>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    countryCode: "+1",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch address from KYC data
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch("/api/user/settings/address");
        if (res.ok) {
          const data = await res.json();
          if (data.address) {
            setAddress({
              addressLine1: data.address.addressLine1 || "",
              addressLine2: data.address.addressLine2 || "",
              city: data.address.city || "",
              state: data.address.state || "",
              postalCode: data.address.postalCode || "",
              country: data.address.countryCode || "US",
              countryCode: data.address.countryCode ? getDialCode(data.address.countryCode) : "+1",
              phoneNumber: data.address.phoneNumber || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [user]);

  const getDialCode = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.dialCode || "+1";
  };

  const handleCountryChange = (countryCode: string | null) => {
    if (!countryCode) return;
    const country = countries.find(c => c.code === countryCode);
    setAddress(prev => ({
      ...prev,
      country: countryCode,
      countryCode: country?.dialCode || "+1",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      toast.success("Address saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] max-w-[620px]">
        <div className="flex items-center justify-center py-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#8B7CFF]" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="flat"
      className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] max-w-[620px] flex flex-col gap-md"
    >
      <div className="flex items-center gap-xs">
        <MapPin className="w-5 h-5 text-[#8B7CFF]" />
        <h3 className="text-[18px] font-semibold text-white">Address Information</h3>
      </div>
      <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="addressLine1"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Address Line 1
            </Label>
            <Input
              id="addressLine1"
              type="text"
              value={address.addressLine1}
              onChange={(e) => setAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
              placeholder="123 Main Street"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="addressLine2"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Address Line 2 (Optional)
            </Label>
            <Input
              id="addressLine2"
              type="text"
              value={address.addressLine2}
              onChange={(e) => setAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
              placeholder="Apt, Suite, Building"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="city"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              City
            </Label>
            <Input
              id="city"
              type="text"
              value={address.city}
              onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              placeholder="New York"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="state"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              State/Province
            </Label>
            <Input
              id="state"
              type="text"
              value={address.state}
              onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
              placeholder="NY"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="postalCode"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Postal Code
            </Label>
            <Input
              id="postalCode"
              type="text"
              value={address.postalCode}
              onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
              placeholder="10001"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="country"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Country
            </Label>
            <Select value={address.country} onValueChange={handleCountryChange}>
              <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.dialCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="phoneNumber"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Phone Number
            </Label>
            <div className="flex gap-xs">
              <Input
                id="phoneCountryCode"
                type="text"
                value={address.countryCode}
                readOnly
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white w-24 text-center"
              />
              <Input
                id="phoneNumber"
                type="tel"
                value={address.phoneNumber}
                onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="555-123-4567"
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 flex-1"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="w-[140px] bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] mt-xs disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </form>
    </Card>
  );
}