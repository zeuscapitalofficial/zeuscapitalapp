"use client";

import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  FileText,
  FolderCheck,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KycRecord {
  id: string;
  userId: string;
  fullname: string;
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
  extraNotes: string | null;
  status: string;
  rejectionReason: string | null;
  submittedAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function KycQueuePage() {
  const [kycRecords, setKycRecords] = useState<KycRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<KycRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Reject Dialog States
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionText, setRejectionText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load KYC records from API
  async function loadKycRecords() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      const users = await res.json();

      // Extract connected KYC records
      const records: KycRecord[] = [];
      for (const u of users) {
        if (u.kyc) {
          records.push({
            ...u.kyc,
            user: {
              name: u.name,
              email: u.email,
            },
          });
        }
      }

      setKycRecords(records);
      if (records.length > 0) {
        setSelectedRecord(records[0]);
      }
    } catch (e) {
      toast.error("Failed to load KYC verification list from database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKycRecords();
  }, []);

  // Handle Review action
  const handleReviewStatus = async (
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ) => {
    if (!selectedRecord) return;
    setSubmittingReview(true);
    const toastId = toast.loading(
      `Submitting audit review status as ${status}...`,
    );

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
      if (!res.ok)
        throw new Error(data.error || "Failed to update review status");

      // Update state locally
      setKycRecords((prev) =>
        prev.map((rec) =>
          rec.id === selectedRecord.id
            ? {
                ...rec,
                status,
                rejectionReason: status === "REJECTED" ? reason || null : null,
              }
            : rec,
        ),
      );
      setSelectedRecord((prev) =>
        prev
          ? {
              ...prev,
              status,
              rejectionReason: status === "REJECTED" ? reason || null : null,
            }
          : null,
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

  const filteredRecords = kycRecords.filter((rec) => {
    const matchesQuery =
      rec.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.documentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Identity & Compliance Checks
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            KYC Queue
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Review uploaded identification credentials, legal documents, and
            address proofs to verify active user limits.
          </p>
        </div>
        <Button
          onClick={loadKycRecords}
          variant="outline"
          className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
        >
          Refresh Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Verification Queue List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          {/* Search bar */}
          <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search documents queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-zinc-500 w-full"
            />
          </div>

          <Card
            variant="flat"
            className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm max-h-[520px] overflow-y-auto pr-xs"
          >
            {loading ? (
              <div className="py-8 text-center text-zinc-400 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8B7CFF]" />
              </div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-md border rounded-[16px] cursor-pointer flex justify-between items-center transition-all ${
                      isSelected
                        ? "bg-[#1D1D22] border-red-500/40"
                        : "bg-[#09090B] border-[rgba(255,255,255,0.04)] hover:bg-[#111114]"
                    }`}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-semibold text-sm truncate">
                        {rec.fullname}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium truncate">
                        {rec.user.email}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-1">
                        {new Date(rec.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === "APPROVED"
                          ? "bg-green-500/10 text-green-400"
                          : rec.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm">
                No KYC submissions found in database.
              </div>
            )}
          </Card>
        </div>

        {/* Selected Document Details panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-lg"
            >
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-md flex justify-between items-center">
                <div className="flex flex-col gap-xs">
                  <h3 className="text-[18px] font-semibold text-white">
                    {selectedRecord.fullname}
                  </h3>
                  <p className="text-[13px] text-zinc-400 font-medium">
                    Verification audit sheet
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-xs px-3 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-wider ${
                    selectedRecord.status === "APPROVED"
                      ? "bg-green-500/10 text-green-400"
                      : selectedRecord.status === "PENDING"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              {/* Grid detail metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-md text-[13px] font-medium border-b border-[rgba(255,255,255,0.06)] pb-md">
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">Gender</span>
                  <span className="text-white capitalize">
                    {selectedRecord.gender}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">Nationality</span>
                  <span className="text-white">
                    {selectedRecord.nationality}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">Country</span>
                  <span className="text-white">
                    {selectedRecord.country} ({selectedRecord.countryCode})
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">Phone Number</span>
                  <span className="text-white">
                    {selectedRecord.phoneNumber}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">ID Ref Number</span>
                  <span className="text-white font-mono">
                    {selectedRecord.documentId}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 mb-1">Source of Funds</span>
                  <span className="text-white capitalize">
                    {selectedRecord.sourceOfFunds}
                  </span>
                </div>
              </div>

              {/* Address details */}
              <div className="flex flex-col gap-sm border-b border-[rgba(255,255,255,0.06)] pb-md">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Residential Address
                </h4>
                <p className="text-[13px] font-medium text-zinc-300">
                  {selectedRecord.addressLine1}, {selectedRecord.city},{" "}
                  {selectedRecord.state} {selectedRecord.postalCode}
                </p>
              </div>

              {/* Document Previews Section */}
              <div className="flex flex-col gap-md">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Uploaded Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                  {/* Front of ID */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-500 font-semibold">
                      Front of ID
                    </span>
                    <div className="relative aspect-video rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.08)] bg-black/40 group">
                      <img
                        src={selectedRecord.frontOfId}
                        alt="Front of ID"
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={selectedRecord.frontOfId}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-semibold transition-opacity gap-xs cursor-pointer"
                      >
                        View File <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Back of ID */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-500 font-semibold">
                      Back of ID
                    </span>
                    <div className="relative aspect-video rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.08)] bg-black/40 group">
                      <img
                        src={selectedRecord.backOfId}
                        alt="Back of ID"
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={selectedRecord.backOfId}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-semibold transition-opacity gap-xs cursor-pointer"
                      >
                        View File <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Proof of Address */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-500 font-semibold">
                      Proof of Address
                    </span>
                    <div className="relative aspect-video rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.08)] bg-black/40 group">
                      <img
                        src={selectedRecord.proofOfAddress}
                        alt="Proof of Address"
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={selectedRecord.proofOfAddress}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-semibold transition-opacity gap-xs cursor-pointer"
                      >
                        View File <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra compliance notes */}
              {selectedRecord.extraNotes && (
                <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] text-[13px] leading-relaxed">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                    Audit Notes:
                  </span>
                  <span className="text-zinc-300 font-medium">
                    {selectedRecord.extraNotes}
                  </span>
                </div>
              )}

              {/* Rejection notice (if rejected) */}
              {selectedRecord.status === "REJECTED" &&
                selectedRecord.rejectionReason && (
                  <div className="p-md bg-red-500/5 border border-red-500/10 rounded-[14px] text-[13px] leading-relaxed flex gap-sm items-start">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block mb-1">
                        Rejection Feedback:
                      </span>
                      <span className="text-zinc-300 font-medium">
                        {selectedRecord.rejectionReason}
                      </span>
                    </div>
                  </div>
                )}

              {/* Review Decision Buttons Row */}
              {selectedRecord.status === "PENDING" && (
                <div className="flex items-center justify-end gap-sm border-t border-[rgba(255,255,255,0.06)] pt-lg mt-md">
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    disabled={submittingReview}
                    className="bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Reject ID
                  </Button>
                  <Button
                    onClick={() => handleReviewStatus("APPROVED")}
                    disabled={submittingReview}
                    className="bg-green-600 hover:bg-green-500 text-white text-[13px] font-semibold h-10 rounded-[12px] px-md flex items-center gap-xs cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve ID
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card
              variant="flat"
              className="p-xl bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-md py-xxl text-zinc-400"
            >
              <FolderCheck className="w-12 h-12 text-zinc-600" />
              <span>
                Select a compliance record to begin manual document
                verification.
              </span>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal dialog backdrop */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <Card className="bg-[#111114] border border-[rgba(255,255,255,0.08)] p-lg max-w-[460px] w-full rounded-[20px] flex flex-col gap-md animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-sm">
              <h3 className="text-md font-semibold text-white">
                Provide Rejection Reason
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-xs">
              <Label
                htmlFor="rejectionReason"
                className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
              >
                Rejection Feedback
              </Label>
              <textarea
                id="rejectionReason"
                rows={3}
                placeholder="ID front photo is blurry. Please upload a high-resolution, clear photo showing all parameters."
                value={rejectionText}
                onChange={(e) => setRejectionText(e.target.value)}
                className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-transparent text-sm p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 resize-none font-sans transition-all"
              />
            </div>

            <div className="flex justify-end gap-sm border-t border-[rgba(255,255,255,0.06)] pt-md">
              <Button
                variant="ghost"
                onClick={() => setShowRejectModal(false)}
                className="bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] hover:bg-[#27272D] text-white text-xs h-9 rounded-[10px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReviewStatus("REJECTED", rejectionText)}
                disabled={!rejectionText.trim() || submittingReview}
                className="bg-red-600 hover:bg-red-500 text-white text-xs h-9 rounded-[10px]"
              >
                Submit Rejection
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
