"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  User,
  MapPin,
  Briefcase,
  Phone,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Shield,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface KycRecord {
  id: string;
  userId: string;
  gender: string;
  nationality: string;
  countryCode: string;
  country: string;
  phoneNumber: string;
  documentId: string;
  frontOfId: string;
  backOfId: string;
  proofOfAddress: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  sourceOfFunds: string;
  extraNotes?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  submittedAt: string;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function KycQueuePage() {
  const [kycRecords, setKycRecords] = useState<KycRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<KycRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Reject Dialog States
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionText, setRejectionText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch KYC records from API
  async function loadKycRecords() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load user records");
      const users = await res.json();

      const records: KycRecord[] = [];
      for (const u of users) {
        if (u.kyc) {
          records.push({
            ...u.kyc,
            user: {
              name: u.name,
              email: u.email,
              image: u.image,
            },
          });
        }
      }

      setKycRecords(records);
      if (records.length > 0) {
        setSelectedRecord(records[0]);
      }
    } catch (e: any) {
      toast.error("Failed to load KYC verification list from database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKycRecords();
  }, []);

  // Safe search filtering
  const filteredRecords = useMemo(() => {
    return kycRecords.filter((rec) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = rec.user?.name?.toLowerCase().includes(q) ?? false;
      const emailMatch = rec.user?.email?.toLowerCase().includes(q) ?? false;
      const docMatch = rec.documentId?.toLowerCase().includes(q) ?? false;
      const countryMatch = rec.country?.toLowerCase().includes(q) ?? false;

      const matchesSearch = !q || nameMatch || emailMatch || docMatch || countryMatch;
      const matchesStatus = statusFilter === "ALL" || rec.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [kycRecords, searchQuery, statusFilter]);

  // Aggregates
  const metrics = useMemo(() => {
    const total = kycRecords.length;
    const pending = kycRecords.filter((r) => r.status === "PENDING").length;
    const approved = kycRecords.filter((r) => r.status === "APPROVED").length;
    const rejected = kycRecords.filter((r) => r.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [kycRecords]);

  // Handle Review action (Approve or Reject)
  const handleReviewStatus = async (
    status: "APPROVED" | "REJECTED",
    reason?: string
  ) => {
    if (!selectedRecord) return;
    setSubmittingReview(true);
    const toastId = toast.loading(`Saving audit review status as ${status}...`);

    try {
      const res = await fetch("/api/admin/kyc/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kycId: selectedRecord.id,
          status,
          rejectionReason: status === "REJECTED" ? reason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update review status");

      setKycRecords((prev) =>
        prev.map((rec) =>
          rec.id === selectedRecord.id
            ? {
                ...rec,
                status,
                rejectionReason: status === "REJECTED" ? reason || null : null,
              }
            : rec
        )
      );

      setSelectedRecord((prev) =>
        prev
          ? {
              ...prev,
              status,
              rejectionReason: status === "REJECTED" ? reason || null : null,
            }
          : null
      );

      toast.success(`KYC request review successfully saved as ${status}.`, {
        id: toastId,
      });
      setShowRejectModal(false);
      setRejectionText("");
    } catch (e: any) {
      toast.error(e.message || "Auditing submission failed.", { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-[11px] font-medium">
              <ShieldCheck className="size-3" />
              Compliance Queue
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Identity & KYC Approvals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit submitted identity credentials, proof of address, and compliance parameters.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadKycRecords}
          disabled={loading}
          className="gap-2 text-xs h-9 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Submissions
        </Button>
      </div>

      {/* Analytics Header Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <Card className="shadow-xs border-border bg-card p-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
            <span>Total Submissions</span>
            <FileText className="size-4" />
          </div>
          <p className="text-xl font-bold text-foreground mt-1">
            {loading ? "..." : metrics.total}
          </p>
        </Card>

        <Card className="shadow-xs border-border bg-card p-3">
          <div className="flex justify-between items-center text-xs text-amber-600 font-medium">
            <span>Pending Audit</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-500 mt-1">
            {loading ? "..." : metrics.pending}
          </p>
        </Card>

        <Card className="shadow-xs border-border bg-card p-3">
          <div className="flex justify-between items-center text-xs text-emerald-600 font-medium">
            <span>Approved</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {loading ? "..." : metrics.approved}
          </p>
        </Card>

        <Card className="shadow-xs border-border bg-card p-3">
          <div className="flex justify-between items-center text-xs text-rose-600 font-medium">
            <span>Rejected</span>
            <XCircle className="size-4 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-rose-600 mt-1">
            {loading ? "..." : metrics.rejected}
          </p>
        </Card>
      </div>

      {/* Master-Detail Master Card Container */}
      <Card className="flex-1 min-h-0 flex flex-col md:flex-row p-0 overflow-hidden shadow-xs border border-border">
        {/* Left Section: Submissions Queue List */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-border flex-col bg-card ${
            selectedRecord ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search & Filters Header */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search applicant name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>

            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 text-[10px] font-medium py-1 px-1 rounded-md capitalize transition-all cursor-pointer ${
                    statusFilter === tab
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Loading KYC queue...
                </p>
              ) : filteredRecords.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No applications found for selected filters.
                </p>
              ) : (
                filteredRecords.map((rec) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedRecord?.id === rec.id
                        ? "border-accent-foreground/40 bg-accent-foreground/5"
                        : "border-transparent hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar className="size-8 shrink-0">
                        {rec.user.image && <AvatarImage src={rec.user.image} />}
                        <AvatarFallback className="text-[10px] font-bold">
                          {rec.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {rec.user.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] capitalize shrink-0 ${
                              rec.status === "APPROVED"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                : rec.status === "PENDING"
                                ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                : "bg-rose-500/15 text-rose-600 border-rose-500/30"
                            }`}
                          >
                            {rec.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {rec.user.email}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 mt-1">
                          <span>{rec.country}</span>
                          <span>{format(new Date(rec.submittedAt), "MMM d, HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Section: Detailed Audit Inspector */}
        <div
          className={`flex-1 min-w-0 flex-col overflow-hidden bg-card ${
            !selectedRecord ? "hidden md:flex" : "flex"
          }`}
        >
          {!selectedRecord ? (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-8">
              Select a KYC submission from the queue to start review.
            </div>
          ) : (
            <>
              {/* Header Bar */}
              <div className="p-3.5 border-b border-border flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecord(null)}
                    className="md:hidden text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5 mr-1" /> Queue
                  </Button>
                  <Avatar className="size-9">
                    {selectedRecord.user.image && <AvatarImage src={selectedRecord.user.image} />}
                    <AvatarFallback className="text-xs font-bold">
                      {selectedRecord.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{selectedRecord.user.name}</h2>
                    <p className="text-xs text-muted-foreground">{selectedRecord.user.email}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs capitalize font-semibold ${
                    selectedRecord.status === "APPROVED"
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                      : selectedRecord.status === "PENDING"
                      ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                      : "bg-rose-500/15 text-rose-600 border-rose-500/30"
                  }`}
                >
                  {selectedRecord.status}
                </Badge>
              </div>

              {/* Inspector Content */}
              <ScrollArea className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                  {/* Rejection Alert Banner */}
                  {selectedRecord.status === "REJECTED" && (
                    <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/30 text-rose-600 text-xs">
                      <AlertTriangle className="size-4 text-rose-500" />
                      <AlertTitle className="text-xs font-bold text-rose-600">Application Rejected</AlertTitle>
                      <AlertDescription className="text-xs mt-1">
                        Reason: {selectedRecord.rejectionReason || "Credentials failed verification requirements."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* 1. Identification Documents Card */}
                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="pb-3 border-b border-border">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <FileCheck className="size-4 text-accent-foreground" />
                        Uploaded Identification Credentials
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Document ID: <strong className="font-mono text-foreground">{selectedRecord.documentId}</strong>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Front of ID */}
                      <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Front of ID / Passport
                        </span>
                        <div className="aspect-video bg-background rounded-md border border-border flex items-center justify-center p-2 text-center text-xs overflow-hidden">
                          {selectedRecord.frontOfId?.startsWith("http") || selectedRecord.frontOfId?.startsWith("data:") ? (
                            <img src={selectedRecord.frontOfId} alt="Front of ID" className="object-cover size-full rounded" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                              <FileText className="size-6 text-accent-foreground" />
                              <span className="text-[11px] truncate max-w-full">{selectedRecord.frontOfId || "Document file"}</span>
                            </div>
                          )}
                        </div>
                        {selectedRecord.frontOfId?.startsWith("http") && (
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={
                              <a href={selectedRecord.frontOfId} target="_blank" rel="noopener noreferrer">
                                View File <ExternalLink className="size-3" />
                              </a>
                            }
                            className="text-xs sm:text-[11px] h-10 sm:h-7 min-h-[40px] sm:min-h-0 gap-1 cursor-pointer w-full sm:w-auto"
                          />
                        )}
                      </div>

                      {/* Back of ID */}
                      <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Back of ID Document
                        </span>
                        <div className="aspect-video bg-background rounded-md border border-border flex items-center justify-center p-2 text-center text-xs overflow-hidden">
                          {selectedRecord.backOfId?.startsWith("http") || selectedRecord.backOfId?.startsWith("data:") ? (
                            <img src={selectedRecord.backOfId} alt="Back of ID" className="object-cover size-full rounded" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                              <FileText className="size-6 text-accent-foreground" />
                              <span className="text-[11px] truncate max-w-full">{selectedRecord.backOfId || "Document file"}</span>
                            </div>
                          )}
                        </div>
                        {selectedRecord.backOfId?.startsWith("http") && (
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={
                              <a href={selectedRecord.backOfId} target="_blank" rel="noopener noreferrer">
                                View File <ExternalLink className="size-3" />
                              </a>
                            }
                            className="text-xs sm:text-[11px] h-10 sm:h-7 min-h-[40px] sm:min-h-0 gap-1 cursor-pointer w-full sm:w-auto"
                          />
                        )}
                      </div>

                      {/* Proof of Address */}
                      <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/20">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Proof of Address
                        </span>
                        <div className="aspect-video bg-background rounded-md border border-border flex items-center justify-center p-2 text-center text-xs overflow-hidden">
                          {selectedRecord.proofOfAddress?.startsWith("http") || selectedRecord.proofOfAddress?.startsWith("data:") ? (
                            <img src={selectedRecord.proofOfAddress} alt="Proof of Address" className="object-cover size-full rounded" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                              <FileText className="size-6 text-accent-foreground" />
                              <span className="text-[11px] truncate max-w-full">{selectedRecord.proofOfAddress || "Address Utility Bill"}</span>
                            </div>
                          )}
                        </div>
                        {selectedRecord.proofOfAddress?.startsWith("http") && (
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={
                              <a href={selectedRecord.proofOfAddress} target="_blank" rel="noopener noreferrer">
                                View File <ExternalLink className="size-3" />
                              </a>
                            }
                            className="text-xs sm:text-[11px] h-10 sm:h-7 min-h-[40px] sm:min-h-0 gap-1 cursor-pointer w-full sm:w-auto"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Applicant Personal & Address Details */}
                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="pb-3 border-b border-border">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <User className="size-4 text-accent-foreground" />
                        Applicant Details & Residential Address
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="size-3.5 text-accent-foreground" />
                          <span className="font-semibold text-foreground">Country & Nationality:</span>
                        </div>
                        <p className="text-foreground pl-5 font-medium">
                          {selectedRecord.country} ({selectedRecord.countryCode}) · {selectedRecord.nationality}
                        </p>

                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                          <Phone className="size-3.5 text-accent-foreground" />
                          <span className="font-semibold text-foreground">Phone Number:</span>
                        </div>
                        <p className="text-foreground pl-5 font-mono">
                          {selectedRecord.phoneNumber || "Not provided"}
                        </p>

                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                          <Briefcase className="size-3.5 text-accent-foreground" />
                          <span className="font-semibold text-foreground">Source of Funds:</span>
                        </div>
                        <p className="text-foreground pl-5 font-medium uppercase">
                          {selectedRecord.sourceOfFunds || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-semibold text-foreground block">Registered Address:</span>
                        <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1 text-muted-foreground">
                          <p className="text-foreground font-medium">{selectedRecord.addressLine1}</p>
                          <p>{selectedRecord.city}, {selectedRecord.state} {selectedRecord.postalCode}</p>
                          <p>{selectedRecord.country}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>

              {/* Review Actions Footer Bar */}
              <div className="p-4 border-t border-border flex items-center justify-between gap-3 bg-muted/20 shrink-0">
                <div className="text-xs text-muted-foreground">
                  Submission Date: <strong className="text-foreground">{format(new Date(selectedRecord.submittedAt), "PPP p")}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={submittingReview}
                    onClick={() => {
                      setRejectionText("");
                      setShowRejectModal(true);
                    }}
                    className="border-rose-500/30 text-rose-600 hover:bg-rose-500/10 text-xs h-9 cursor-pointer"
                  >
                    <XCircle className="size-4 mr-1.5" />
                    Reject Application
                  </Button>

                  <Button
                    size="sm"
                    disabled={submittingReview}
                    onClick={() => handleReviewStatus("APPROVED")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Approve Compliance
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* ── REJECTION REASON DIALOG ── */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <XCircle className="size-5" />
              Reject KYC Submission
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide an auditing remark explaining why <strong className="text-foreground">{selectedRecord?.user.name}</strong>'s KYC was rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <Label htmlFor="reject-reason" className="text-xs font-semibold text-foreground">
              Rejection Reason Notes
            </Label>
            <Textarea
              id="reject-reason"
              required
              rows={4}
              placeholder="e.g. ID document image is blurry or expired. Please upload a clear photo."
              value={rejectionText}
              onChange={(e) => setRejectionText(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(false)}
              className="text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!rejectionText.trim() || submittingReview}
              onClick={() => handleReviewStatus("REJECTED", rejectionText.trim())}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 cursor-pointer"
            >
              {submittingReview ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
