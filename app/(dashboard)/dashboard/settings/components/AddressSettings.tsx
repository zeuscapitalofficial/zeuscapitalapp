"use client";

import { useState, useEffect } from "react";
import { Loader2, MapPin, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
              countryCode: data.address.countryCode
                ? getDialCode(data.address.countryCode)
                : "+1",
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
    const country = countries.find((c) => c.code === countryCode);
    return country?.dialCode || "+1";
  };

  const handleCountryChange = (countryCode: string | null) => {
    if (!countryCode) return;
    const country = countries.find((c) => c.code === countryCode);
    setAddress((prev) => ({
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

      toast.success("Address information saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full shadow-xs border-border bg-card flex flex-col h-full">
      <CardHeader className="border-b border-border pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center">
            <MapPin className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground">Residential Address</CardTitle>
            <CardDescription className="text-xs">
              Manage your legal address details for verification and billing purposes.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <CardContent className="pt-5 space-y-4 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-accent-foreground" />
              Loading address records...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="addressLine1" className="text-xs font-semibold text-foreground">
                    Address Line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        addressLine1: e.target.value,
                      }))
                    }
                    placeholder="123 Financial Blvd"
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="addressLine2" className="text-xs font-semibold text-foreground">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        addressLine2: e.target.value,
                      }))
                    }
                    placeholder="Apt 4B / Suite 100"
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold text-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="New York"
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold text-foreground">
                    State / Province
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                    placeholder="NY"
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="postalCode" className="text-xs font-semibold text-foreground">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                    }
                    placeholder="10001"
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold text-foreground">
                    Country
                  </Label>
                  <Select value={address.country} onValueChange={handleCountryChange}>
                    <SelectTrigger id="country" className="text-xs h-9 bg-background w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="text-xs">
                          {c.name} ({c.dialCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="phoneCountryCode"
                      type="text"
                      value={address.countryCode}
                      readOnly
                      className="w-20 text-xs h-9 bg-muted/40 text-center font-mono"
                    />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={address.phoneNumber}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="555-0192"
                      className="flex-1 text-xs h-9 bg-background"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto shrink-0">
          <Button
            type="submit"
            disabled={saving || loading}
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save Address
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
