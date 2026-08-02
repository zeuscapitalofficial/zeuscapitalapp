"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Zod Schema matching Kyc Database Model
const kycSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters."),
  gender: z.string().min(1, "Gender selection is required."),
  nationality: z.string().min(2, "Nationality is required."),
  countryCode: z.string().min(1, "Country code is required."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 characters."),
  documentId: z.string().min(4, "Document ID must be at least 4 characters."),
  kycPassword: z.string().optional().nullable(),
  addressLine1: z
    .string()
    .min(4, "Street address must be at least 4 characters."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State/Province is required."),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters."),
  sourceOfFunds: z.string().min(1, "Source of funds is required."),
  extraNotes: z.string().optional().nullable(),
});

type KycFormValues = z.infer<typeof kycSchema>;

interface UploadCardProps {
  label: string;
  fileName: string;
  base64: string | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function DocumentUploadCard({
  label,
  fileName,
  base64,
  onSelect,
  onClear,
  inputRef,
}: UploadCardProps) {
  return (
    <Card className="border-dashed border-2 border-border hover:border-accent-foreground/50 transition-colors p-md flex flex-col items-center justify-center text-center gap-sm bg-muted/20 rounded-[16px]">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onSelect}
        className="hidden"
      />

      {base64 ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border group">
          <img
            src={base64}
            alt={label}
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onClear}
            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 w-full"
        >
          <div className="p-3 rounded-full bg-accent-foreground/10 text-accent-foreground">
            <Upload className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">{label}</p>
            <p className="text-[11px] text-muted-foreground">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      )}

      {fileName !== "No file chosen" && (
        <Badge variant="outline" className="text-[10px] max-w-[160px] truncate">
          <FileText className="w-3 h-3 mr-1" /> {fileName}
        </Badge>
      )}
    </Card>
  );
}

export default function KycPage() {
  const [kycStatus, setKycStatus] = useState<string>("NONE");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // File Upload States
  const [frontName, setFrontName] = useState("No file chosen");
  const [frontBase64, setFrontBase64] = useState<string | null>(null);

  const [backName, setBackName] = useState("No file chosen");
  const [backBase64, setBackBase64] = useState<string | null>(null);

  const [addressDocName, setAddressDocName] = useState("No file chosen");
  const [addressDocBase64, setAddressDocBase64] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Load current KYC Status on mount
  useEffect(() => {
    let active = true;
    async function fetchKycStatus() {
      try {
        setLoadingStatus(true);
        const res = await fetch("/api/kyc/status");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) {
          setKycStatus(data.status || "NONE");
          setRejectionReason(data.rejectionReason || null);
        }
      } catch (err) {
        console.error("Failed to fetch current KYC status");
      } finally {
        if (active) {
          setLoadingStatus(false);
        }
      }
    }
    fetchKycStatus();
    return () => {
      active = false;
    };
  }, []);

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullname: "",
      gender: "male",
      nationality: "",
      countryCode: "",
      country: "",
      phoneNumber: "",
      documentId: "",
      kycPassword: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
      sourceOfFunds: "salary",
      extraNotes: "",
    },
  });

  // Handle File Conversion
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setName: (name: string) => void,
    setBase64: (data: string | null) => void,
    label: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
        toast.success(`${label} loaded successfully.`);
      };
      reader.readAsDataURL(file);
    } else {
      setName("No file chosen");
      setBase64(null);
    }
  };

  // Step Validation checks before moving forward
  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();

    let fieldsToValidate: Array<keyof KycFormValues> = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "fullname",
        "gender",
        "nationality",
        "countryCode",
        "country",
        "phoneNumber",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "sourceOfFunds",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      toast.error("Form validation failed. Please check required fields.");
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Handler
  const onSubmit = async (data: KycFormValues) => {
    setSubmitting(true);
    const toastId = toast.loading("Submitting compliance details...");

    if (!frontBase64 || !backBase64 || !addressDocBase64) {
      setSubmitting(false);
      toast.dismiss(toastId);
      toast.error(
        "Missing required verification documents. Please upload all files.",
      );
      return;
    }

    const payload = {
      ...data,
      frontOfId: frontBase64,
      backOfId: backBase64,
      proofOfAddress: addressDocBase64,
    };

    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.error || "Failed to submit KYC compliance details.",
        );
      }

      setKycStatus("PENDING");
      toast.success("KYC details submitted successfully!");
    } catch (err: any) {
      const errMsg = err.message || "An error occurred during submission.";
      toast.error(`Submission failed: ${errMsg}`);
    } finally {
      setSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  // Re-submit reset helper
  const handleResetKycForm = () => {
    setKycStatus("NONE");
    setCurrentStep(1);
    setFrontBase64(null);
    setFrontName("No file chosen");
    setBackBase64(null);
    setBackName("No file chosen");
    setAddressDocBase64(null);
    setAddressDocName("No file chosen");
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-lg select-none font-sans text-foreground min-h-screen pb-xl">
        {/* Header */}
        <div className="flex flex-col gap-sm pb-sm">
          <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-tight text-foreground">
            KYC Verification
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
          {/* Main Form / Status Container (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            {loadingStatus ? (
              <Card className="p-xl flex flex-col items-center justify-center gap-md text-center rounded-[20px]">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 mx-auto" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                </div>
              </Card>
            ) : kycStatus === "APPROVED" ? (
              <Card className="border-emerald-500/30 bg-emerald-500/5 p-xl text-center flex flex-col items-center gap-md rounded-[20px]">
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-1 w-108">
                  <h3 className="text-xl font-semibold text-foreground">
                    Identity Verified
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your compliance details have been audited and approved. Staking contracts, ASIC miners purchase, and withdrawal channels are fully unlocked.
                  </p>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Account Status: Level 3 Verified
                </Badge>
              </Card>
            ) : kycStatus === "PENDING" ? (
              <Card className="p-xl text-center flex flex-col items-center gap-md rounded-[20px]">
                <div className="rounded-full bg-accent-foreground/10 p-3 text-accent-foreground">
                  <Loader2 className="w-12 h-12 animate-spin" />
                </div>
                <div className="space-y-1 w-108">
                  <h3 className="text-xl font-semibold text-foreground">
                    Review Pending
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your documents were received and are undergoing compliance checks. Reviews typically take 2-4 hours.
                  </p>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  Status: Under Review
                </Badge>
              </Card>
            ) : kycStatus === "REJECTED" ? (
              <Card className="border-destructive/30 bg-destructive/5 p-xl text-center flex flex-col items-center gap-md rounded-[20px]">
                <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                  <AlertTriangle className="w-12 h-12" />
                </div>
                <div className="space-y-1 w-108">
                  <h3 className="text-xl font-semibold text-foreground">
                    Verification Rejected
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your submission requires correction. Review the failure reason below and re-submit details.
                  </p>
                </div>

                {rejectionReason && (
                  <Alert variant="destructive" className="w-108 text-left">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle className="text-xs font-semibold">Auditor Note</AlertTitle>
                    <AlertDescription className="text-xs">{rejectionReason}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleResetKycForm} variant="default" className="mt-2 rounded-full px-lg">
                  Re-submit Verification Form
                </Button>
              </Card>
            ) : (
              /* Active Form Wizard */
              <Card className="border-border bg-card rounded-[24px]">
                <CardHeader className="space-y-md pb-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {currentStep === 1 && "Personal Information"}
                        {currentStep === 2 && "Residential & Funds"}
                        {currentStep === 3 && "Document Verification"}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {currentStep === 1 && "Step 1 of 3: Enter basic identity details"}
                        {currentStep === 2 && "Step 2 of 3: Provide legal residential address"}
                        {currentStep === 3 && "Step 3 of 3: Upload identification and proof files"}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-xs">
                      <Badge variant={currentStep >= 1 ? "default" : "outline"} className="text-[11px]">1. Profile</Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <Badge variant={currentStep >= 2 ? "default" : "outline"} className="text-[11px]">2. Address</Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <Badge variant={currentStep >= 3 ? "default" : "outline"} className="text-[11px]">3. Documents</Badge>
                    </div>
                  </div>

                  <Progress value={(currentStep / 3) * 100} className="h-1.5" />
                </CardHeader>

                <Separator />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="pt-lg space-y-md mb-5">
                    {/* STEP 1: PERSONAL INFORMATION */}
                    {currentStep === 1 && (
                      <div className="space-y-md">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                          <div className="space-y-xs">
                            <Label htmlFor="fullname">Legal Full Name</Label>
                            <Input
                              id="fullname"
                              placeholder="August Renner"
                              {...register("fullname")}
                            />
                            {errors.fullname && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.fullname.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="gender">Gender</Label>
                            <Controller
                              name="gender"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="gender" className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.gender && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.gender.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                              id="nationality"
                              placeholder="Canadian"
                              {...register("nationality")}
                            />
                            {errors.nationality && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.nationality.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                          <div className="space-y-xs">
                            <Label htmlFor="countryCode">Country Code</Label>
                            <Input
                              id="countryCode"
                              placeholder="+1"
                              {...register("countryCode")}
                            />
                            {errors.countryCode && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.countryCode.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              placeholder="Canada"
                              {...register("country")}
                            />
                            {errors.country && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.country.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              placeholder="604-555-0199"
                              {...register("phoneNumber")}
                            />
                            {errors.phoneNumber && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.phoneNumber.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: RESIDENTIAL & FUNDS */}
                    {currentStep === 2 && (
                      <div className="space-y-md">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                          <div className="space-y-xs">
                            <Label htmlFor="addressLine1">Street Address</Label>
                            <Input
                              id="addressLine1"
                              placeholder="123 Alpha Wealth Blvd"
                              {...register("addressLine1")}
                            />
                            {errors.addressLine1 && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.addressLine1.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="Vancouver"
                              {...register("city")}
                            />
                            {errors.city && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.city.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <Label htmlFor="state">State / Province</Label>
                            <Input
                              id="state"
                              placeholder="BC"
                              {...register("state")}
                            />
                            {errors.state && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.state.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                          <div className="space-y-xs">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              placeholder="V6B 1A1"
                              {...register("postalCode")}
                            />
                            {errors.postalCode && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.postalCode.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs sm:col-span-2">
                            <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                            <Controller
                              name="sourceOfFunds"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="sourceOfFunds" className="w-full">
                                    <SelectValue placeholder="Select Source" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="salary">Salary / Wages</SelectItem>
                                    <SelectItem value="investments">Investments / Trading</SelectItem>
                                    <SelectItem value="mining">Mining Operations</SelectItem>
                                    <SelectItem value="savings">Personal Savings</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.sourceOfFunds && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.sourceOfFunds.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DOCUMENT VERIFICATION */}
                    {currentStep === 3 && (
                      <div className="space-y-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                          <div className="space-y-xs">
                            <Label htmlFor="documentId">Document ID Number</Label>
                            <Input
                              id="documentId"
                              placeholder="Passport / ID Number"
                              {...register("documentId")}
                            />
                            {errors.documentId && (
                              <p className="text-xs text-destructive font-medium">
                                {errors.documentId.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-xs">
                            <div className="flex items-center gap-1">
                              <Label htmlFor="kycPassword">Verification Password (Optional)</Label>
                              <Tooltip>
                                <TooltipTrigger render={
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />}>
                                </TooltipTrigger>
                                <TooltipContent>Optional security passphrase for identity verification</TooltipContent>
                              </Tooltip>
                            </div>
                            <Input
                              id="kycPassword"
                              placeholder="Optional security token"
                              {...register("kycPassword")}
                            />
                          </div>
                        </div>

                        <div className="space-y-xs">
                          <Label htmlFor="extraNotes">Additional Notes (Optional)</Label>
                          <Textarea
                            id="extraNotes"
                            rows={3}
                            placeholder="Provide details about corporate assets or related accounts..."
                            {...register("extraNotes")}
                          />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                          <DocumentUploadCard
                            label="Front of ID"
                            fileName={frontName}
                            base64={frontBase64}
                            onSelect={(e) =>
                              handleFileChange(
                                e,
                                setFrontName,
                                setFrontBase64,
                                "Front of ID",
                              )
                            }
                            onClear={() => {
                              setFrontName("No file chosen");
                              setFrontBase64(null);
                            }}
                            inputRef={frontInputRef}
                          />

                          <DocumentUploadCard
                            label="Back of ID"
                            fileName={backName}
                            base64={backBase64}
                            onSelect={(e) =>
                              handleFileChange(
                                e,
                                setBackName,
                                setBackBase64,
                                "Back of ID",
                              )
                            }
                            onClear={() => {
                              setBackName("No file chosen");
                              setBackBase64(null);
                            }}
                            inputRef={backInputRef}
                          />

                          <DocumentUploadCard
                            label="Proof of Address"
                            fileName={addressDocName}
                            base64={addressDocBase64}
                            onSelect={(e) =>
                              handleFileChange(
                                e,
                                setAddressDocName,
                                setAddressDocBase64,
                                "Proof of Address",
                              )
                            }
                            onClear={() => {
                              setAddressDocName("No file chosen");
                              setAddressDocBase64(null);
                            }}
                            inputRef={addressInputRef}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <Separator />

                  <CardFooter className="flex items-center justify-between">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="mt-4 rounded-full">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <Button type="button" onClick={handleNextStep} className="mt-4 rounded-full">
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold mt-4 rounded-full px-lg"
                      >
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit Verification
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>

          {/* Sidebar Guidelines & Tier Perks (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-md">
            <Card className="border-border bg-card rounded-[24px]">
              <CardHeader className="pb-xs">
                <CardTitle className="text-base font-semibold flex items-center gap-xs text-foreground">
                  <ShieldCheck className="w-4 h-4 text-accent-foreground" /> Verified Tier Benefits
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Completing identity verification unlocks institutional infrastructure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-sm text-xs pt-md">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Withdrawal Limit</span>
                  <Badge variant="secondary" className="font-semibold">$250,000 / day</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ASIC Mining Clusters</span>
                  <Badge variant="secondary" className="text-emerald-500 font-semibold">Unlocked</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Automated Bots</span>
                  <Badge variant="secondary" className="text-emerald-500 font-semibold">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-border bg-muted/30 rounded-[20px]">
              <Info className="h-4 w-4 text-accent-foreground" />
              <AlertTitle className="text-xs font-semibold text-foreground">Encryption & Privacy</AlertTitle>
              <AlertDescription className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Your compliance parameters and uploaded identity documents are stored using AES-256 bank-level encryption.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
