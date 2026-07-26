"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function KycPage() {
  const [kycStatus, setKycStatus] = useState<string>("NONE"); // NONE, PENDING, APPROVED, REJECTED
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
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">
            Identity & Compliance
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            KYC Verification
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Verify profile parameters to lift limits, verify mining arrays, and
            activate ledger withdrawals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Verification Form Container (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          {loadingStatus ? (
            // Status loading indicator skeleton
            <Card
              variant="flat"
              className="p-xl bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-md py-xxl animate-pulse"
            >
              <Loader2 className="w-10 h-10 text-[#8B7CFF] animate-spin" />
              <span className="text-zinc-400 text-sm">
                Querying compliance ledger database...
              </span>
            </Card>
          ) : kycStatus === "APPROVED" ? (
            // Confirmed approved state
            <Card
              variant="flat"
              className="p-xl bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-md py-xxl animate-fade-in"
            >
              <CheckCircle className="w-16 h-16 text-[#22C55E]" />
              <div className="flex flex-col gap-2 max-w-[460px]">
                <h3 className="text-[22px] font-semibold text-white">
                  Identity Confirmed
                </h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed mt-1">
                  Your identity verification request has been successfully
                  reviewed and approved. Staking contracts, ASIC miners
                  purchase, and ledger withdrawal channels are fully unlocked.
                </p>
              </div>
              <div className="mt-xs inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-[10px] text-[12px] font-bold text-green-400 uppercase tracking-wider">
                Status: Account Verified
              </div>
            </Card>
          ) : kycStatus === "PENDING" ? (
            // Pending State
            <Card
              variant="flat"
              className="p-xl bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-md py-xxl animate-fade-in"
            >
              <Loader2 className="w-16 h-16 text-[#8B7CFF] animate-spin" />
              <div className="flex flex-col gap-2 max-w-[420px]">
                <h3 className="text-[20px] font-semibold text-white">
                  Verification Pending
                </h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed mt-1">
                  Your KYC profile details have been saved to our database.
                  Compliance reviews take 2-4 hours to verify accounts.
                </p>
              </div>
              <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] text-[13px] font-semibold text-zinc-400">
                Status: Pending Approval
              </div>
            </Card>
          ) : kycStatus === "REJECTED" ? (
            // Rejected Error State
            <Card
              variant="flat"
              className="p-xl bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-md py-xl animate-fade-in"
            >
              <AlertTriangle className="w-16 h-16 text-[#EF4444]" />
              <div className="flex flex-col gap-2 max-w-[480px]">
                <h3 className="text-[22px] font-semibold text-white">
                  Verification Rejected
                </h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed mt-1">
                  Compliance auditors rejected your KYC request due to
                  validation errors. Review the failure reason below and
                  re-submit details.
                </p>
              </div>

              {rejectionReason && (
                <div className="w-full max-w-[480px] p-md bg-red-500/5 border border-red-500/10 rounded-[14px] text-left">
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">
                    Auditor Rejection Reason:
                  </span>
                  <span className="text-[13px] text-zinc-300 font-medium block mt-1 leading-relaxed">
                    {rejectionReason}
                  </span>
                </div>
              )}

              <Button
                onClick={handleResetKycForm}
                className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[12px] px-lg flex items-center gap-xs mt-sm transition-colors cursor-pointer"
              >
                Re-submit Documents
              </Button>
            </Card>
          ) : (
            // Form wizard container (NONE status)
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
            >
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-md flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div className="flex flex-col gap-xs">
                  <h3 className="text-[18px] font-semibold text-white">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Residential & Funds"}
                    {currentStep === 3 && "Document Verification"}
                  </h3>
                  <p className="text-[13px] text-zinc-400 font-medium">
                    {currentStep === 1 && "Enter your basic profile parameters"}
                    {currentStep === 2 &&
                      "Provide your residential address and income details"}
                    {currentStep === 3 &&
                      "Upload official legal files to confirm credentials"}
                  </p>
                </div>

                {/* Steps Action Component */}
                <div className="flex items-center gap-xs select-none shrink-0 bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-1.5 mt-2 sm:mt-0">
                  {[1, 2, 3].map((step) => {
                    const isActive = currentStep === step;
                    const isCompleted = currentStep > step;
                    return (
                      <div key={step} className="flex items-center gap-xs">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                            isCompleted
                              ? "bg-green-500/20 border border-green-500 text-green-400"
                              : isActive
                                ? "bg-[#8B7CFF] text-white shadow"
                                : "bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] text-zinc-500"
                          }`}
                        >
                          {isCompleted ? "✓" : step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`h-[1px] w-4 rounded-full transition-colors ${currentStep > step ? "bg-green-500" : "bg-[rgba(255,255,255,0.06)]"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                className="flex flex-col gap-md"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* STEP 1: PERSONAL INFORMATION */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-md animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="fullname"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Legal Full Name
                        </Label>
                        <Input
                          id="fullname"
                          type="text"
                          placeholder="August Renner"
                          {...register("fullname")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.fullname && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.fullname.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="gender"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Gender
                        </Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full text-white bg-[#09090B] border-[rgba(255,255,255,0.08)] h-10 px-3 rounded-[14px] focus:border-[#8B7CFF] transition-all justify-between text-sm font-medium">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] text-white">
                                <SelectItem
                                  value="male"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Male
                                </SelectItem>
                                <SelectItem
                                  value="female"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Female
                                </SelectItem>
                                <SelectItem
                                  value="other"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Other
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.gender && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.gender.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="nationality"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Nationality
                        </Label>
                        <Input
                          id="nationality"
                          type="text"
                          placeholder="Canadian"
                          {...register("nationality")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.nationality && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.nationality.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="countryCode"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Country Code
                        </Label>
                        <Input
                          id="countryCode"
                          type="text"
                          placeholder="+1"
                          {...register("countryCode")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.countryCode && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.countryCode.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="country"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          type="text"
                          placeholder="Canada"
                          {...register("country")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.country && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.country.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="phoneNumber"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="604-555-0199"
                          {...register("phoneNumber")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.phoneNumber && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: RESIDENTIAL & FUNDS */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-md animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="addressLine1"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Street Address
                        </Label>
                        <Input
                          id="addressLine1"
                          type="text"
                          placeholder="123 Alpha Wealth Blvd"
                          {...register("addressLine1")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.addressLine1 && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.addressLine1.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="city"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Vancouver"
                          {...register("city")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.city && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.city.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="state"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          State / Province
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="BC"
                          {...register("state")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.state && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.state.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="postalCode"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder="V6B 1A1"
                          {...register("postalCode")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.postalCode && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.postalCode.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="sourceOfFunds"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Source of Funds
                        </Label>
                        <Controller
                          name="sourceOfFunds"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full text-white bg-[#09090B] border-[rgba(255,255,255,0.08)] h-10 px-3 rounded-[14px] focus:border-[#8B7CFF] transition-all justify-between text-sm font-medium">
                                <SelectValue placeholder="Select Source" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] text-white">
                                <SelectItem
                                  value="salary"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Salary / Wages
                                </SelectItem>
                                <SelectItem
                                  value="investments"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Investments / Trading
                                </SelectItem>
                                <SelectItem
                                  value="mining"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Mining Operations
                                </SelectItem>
                                <SelectItem
                                  value="savings"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Personal Savings
                                </SelectItem>
                                <SelectItem
                                  value="other"
                                  className="hover:bg-[#1D1D22] text-sm p-2 cursor-pointer"
                                >
                                  Other
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.sourceOfFunds && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.sourceOfFunds.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DOCUMENT VERIFICATION */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-md animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="documentId"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Document ID
                        </Label>
                        <Input
                          id="documentId"
                          type="text"
                          placeholder="Passport / ID Number"
                          {...register("documentId")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.documentId && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.documentId.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-xs">
                        <Label
                          htmlFor="kycPassword"
                          className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          Verification Password (Optional)
                        </Label>
                        <Input
                          id="kycPassword"
                          type="text"
                          placeholder="Plain text token identifier"
                          {...register("kycPassword")}
                          className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400 focus:border-[#8B7CFF] transition-all"
                        />
                        {errors.kycPassword && (
                          <span className="text-xs text-red-400 font-semibold mt-1">
                            {errors.kycPassword.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-xs">
                      <Label
                        htmlFor="extraNotes"
                        className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                      >
                        Additional Compliance Notes (Optional)
                      </Label>
                      <textarea
                        id="extraNotes"
                        rows={2}
                        placeholder="Provide details about institutional partnerships, corporate assets, or related accounts..."
                        {...register("extraNotes")}
                        className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-transparent text-sm p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#8B7CFF] resize-none font-sans transition-all"
                      />
                      {errors.extraNotes && (
                        <span className="text-xs text-red-400 font-semibold mt-1">
                          {errors.extraNotes.message}
                        </span>
                      )}
                    </div>

                    {/* Document Upload Grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md border-t border-[rgba(255,255,255,0.06)] pt-md">
                      {/* Front of ID */}
                      <div className="flex flex-col gap-sm">
                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Front of ID
                        </Label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={frontInputRef}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              setFrontName,
                              setFrontBase64,
                              "Front of ID",
                            )
                          }
                          className="hidden"
                        />
                        <div className="flex items-center gap-sm">
                          <Button
                            type="button"
                            onClick={() => frontInputRef.current?.click()}
                            className="bg-[#1D1D22] border border-[rgba(255,255,255,0.08)] hover:bg-[#27272D] text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs transition-colors shrink-0"
                          >
                            <Upload className="w-4 h-4" /> Upload
                          </Button>
                          <span className="text-[12px] text-zinc-400 truncate max-w-[120px]">
                            {frontName}
                          </span>
                        </div>

                        {frontBase64 && (
                          <div className="mt-sm relative w-full h-32 rounded-[14px] overflow-hidden border border-[rgba(255,255,255,0.08)] group animate-fade-in">
                            <img
                              src={frontBase64}
                              alt="Front ID Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFrontName("No file chosen");
                                setFrontBase64(null);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Back of ID */}
                      <div className="flex flex-col gap-sm">
                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Back of ID
                        </Label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={backInputRef}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              setBackName,
                              setBackBase64,
                              "Back of ID",
                            )
                          }
                          className="hidden"
                        />
                        <div className="flex items-center gap-sm">
                          <Button
                            type="button"
                            onClick={() => backInputRef.current?.click()}
                            className="bg-[#1D1D22] border border-[rgba(255,255,255,0.08)] hover:bg-[#27272D] text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs transition-colors shrink-0"
                          >
                            <Upload className="w-4 h-4" /> Upload
                          </Button>
                          <span className="text-[12px] text-zinc-400 truncate max-w-[120px]">
                            {backName}
                          </span>
                        </div>

                        {backBase64 && (
                          <div className="mt-sm relative w-full h-32 rounded-[14px] overflow-hidden border border-[rgba(255,255,255,0.08)] group animate-fade-in">
                            <img
                              src={backBase64}
                              alt="Back ID Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBackName("No file chosen");
                                setBackBase64(null);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Proof of Address */}
                      <div className="flex flex-col gap-sm">
                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Proof of Address
                        </Label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={addressInputRef}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              setAddressDocName,
                              setAddressDocBase64,
                              "Proof of Address",
                            )
                          }
                          className="hidden"
                        />
                        <div className="flex items-center gap-sm">
                          <Button
                            type="button"
                            onClick={() => addressInputRef.current?.click()}
                            className="bg-[#1D1D22] border border-[rgba(255,255,255,0.08)] hover:bg-[#27272D] text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs transition-colors shrink-0"
                          >
                            <Upload className="w-4 h-4" /> Upload
                          </Button>
                          <span className="text-[12px] text-zinc-400 truncate max-w-[120px]">
                            {addressDocName}
                          </span>
                        </div>

                        {addressDocBase64 && (
                          <div className="mt-sm relative w-full h-32 rounded-[14px] overflow-hidden border border-[rgba(255,255,255,0.08)] group animate-fade-in">
                            <img
                              src={addressDocBase64}
                              alt="Proof of Address Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setAddressDocName("No file chosen");
                                setAddressDocBase64(null);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons Row */}
                <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-lg mt-md shrink-0">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-[#1D1D22] border border-[rgba(255,255,255,0.08)] hover:bg-[#27272D] text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs transition-all ml-auto cursor-pointer"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-500 text-white text-[13px] font-semibold h-10 rounded-[12px] px-lg flex items-center gap-xs cursor-pointer transition-colors ml-auto"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit Verification"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Informative Side Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <ShieldCheck className="w-5 h-5 text-[#8B7CFF]" />
              <span className="font-semibold text-[15px]">
                Security Standards
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              We encrypt sensitive identification data using 256-bit AES
              algorithms. Our compliance teams use secure air-gapped terminals
              to verify your files, and details are never distributed to
              third-party databases.
            </p>
          </Card>

          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <HelpCircle className="w-5 h-5 text-[#8B7CFF]" />
              <span className="font-semibold text-[15px]">
                Need Assistance?
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              If document uploads fail or if you're holding a corporate account,
              reach out to our VIP compliance desk directly.
            </p>
            <Button
              variant="outline"
              className="w-full border-[rgba(255,255,255,0.06)] bg-[#09090B] text-[12px] font-semibold hover:bg-[#1D1D22] h-9 rounded-[12px]"
            >
              Support Desk
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
