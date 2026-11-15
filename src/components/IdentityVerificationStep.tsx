"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Clock, FileImage, Lock, RefreshCw, ShieldCheck, Upload } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { compressImage } from "@/lib/compress-image";
import { cn } from "@/lib/utils";
import { type VerificationSummary, useAuthStore } from "@/store/auth-store";

type DocumentType = "SWISS_ID_CARD" | "SWISS_PASSPORT" | "RESIDENCE_PERMIT_B" | "RESIDENCE_PERMIT_C";
type Side = "FRONT" | "BACK";
type ItemStatus = "PENDING" | "APPROVED" | "REJECTED";

type StatusResponse = {
  status: "NOT_SUBMITTED" | ItemStatus;
  documentType?: DocumentType;
  submittedAt?: string;
  requiredSides: Side[];
  items: Array<{ side: Side; status: ItemStatus; rejectionReason?: string; uploadedAt?: string; reviewedAt?: string }>;
  documents: Array<{
    id: string;
    documentType: DocumentType;
    status: ItemStatus;
    submittedAt?: string;
    requiredSides: Side[];
    items: StatusResponse["items"];
  }>;
  liveness: {
    id?: string;
    status: "NOT_SUBMITTED" | ItemStatus;
    submittedAt?: string;
    requiredSides: Array<"SELFIE" | "LEFT" | "RIGHT">;
    items: Array<{ side: "SELFIE" | "LEFT" | "RIGHT"; status: ItemStatus; rejectionReason?: string }>;
  };
  uploadBlocked: boolean;
  rejectionCount: number;
  maxRejections: number;
  verification: VerificationSummary;
};

const DOCUMENTS: Array<{ type: DocumentType; en: string; de: string; requiresBack: boolean }> = [
  { type: "SWISS_ID_CARD", en: "Swiss identity card", de: "Schweizer Identitätskarte", requiresBack: true },
  { type: "SWISS_PASSPORT", en: "Swiss passport", de: "Schweizer Pass", requiresBack: false },
  { type: "RESIDENCE_PERMIT_B", en: "Residence permit B", de: "Aufenthaltsbewilligung B", requiresBack: true },
  { type: "RESIDENCE_PERMIT_C", en: "Residence permit C", de: "Niederlassungsbewilligung C", requiresBack: true },
];

const DOCUMENT_MAX_DIMENSION = 2200;

type PickedImage = { blob: Blob; previewUrl: string };

const LIVENESS_STEPS = [
  { pose: "SELFIE" as const, en: "Look straight and blink. Capture while your eyes are closed.", de: "Geradeaus schauen und blinzeln. Mit geschlossenen Augen aufnehmen." },
  { pose: "LEFT" as const, en: "Turn your head to the left, then capture.", de: "Kopf nach links drehen und aufnehmen." },
  { pose: "RIGHT" as const, en: "Turn your head to the right, then capture.", de: "Kopf nach rechts drehen und aufnehmen." },
];

function LivenessChallenge({
  isDe,
  liveness,
  blocked,
  onUploaded,
}: {
  isDe: boolean;
  liveness: StatusResponse["liveness"];
  blocked: boolean;
  onUploaded: (next: StatusResponse) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const nextStep = LIVENESS_STEPS.find((step) => {
    const item = liveness.items.find((entry) => entry.side === step.pose);
    return !item || item.status === "REJECTED";
  });

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setError(isDe ? "Kamerazugriff wurde nicht erlaubt." : "Camera access was not allowed.");
    }
  };

  const capture = async () => {
    if (!nextStep || !videoRef.current) return;
    setBusy(true);
    setError("");
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Capture failed.");
      const body = new FormData();
      body.append("file", blob, `liveness-${nextStep.pose.toLowerCase()}.jpg`);
      const result = await apiRequest<StatusResponse>(`/identity-verification/liveness/${nextStep.pose}`, { method: "POST", body });
      onUploaded(result);
      if (result.liveness.status === "PENDING" && result.liveness.items.length >= 3) stopCamera();
    } catch (captureError) {
      setError(captureError instanceof Error ? captureError.message : "Capture failed.");
    } finally {
      setBusy(false);
    }
  };

  const complete = liveness.status === "APPROVED" || (liveness.items.length === 3 && !nextStep);
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-slate-800">{isDe ? "Selfie- und Lebenderkennung" : "Selfie and liveness check"}</p>
          <p className="text-[11px] text-slate-500">{isDe ? "Blinzeln und Kopf drehen" : "Blink and turn your head"}</p>
        </div>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", complete ? "border-sky-200 bg-sky-100 text-sky-700" : "border-slate-200 bg-slate-100 text-slate-600")}>
          {liveness.status === "APPROVED" ? (isDe ? "Genehmigt" : "Approved") : complete ? (isDe ? "In Prüfung" : "In review") : `${liveness.items.length}/3`}
        </span>
      </div>
      {!complete && !blocked && nextStep && (
        <>
          <p className="rounded-xl bg-cyan-50 p-3 text-xs font-medium text-cyan-800">{isDe ? nextStep.de : nextStep.en}</p>
          <div className="overflow-hidden rounded-2xl bg-slate-950">
            <video ref={videoRef} muted playsInline className="aspect-[4/3] w-full scale-x-[-1] object-cover" />
          </div>
          {!cameraReady ? (
            <button type="button" onClick={() => void startCamera()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white">
              <Camera className="h-4 w-4" />{isDe ? "Kamera starten" : "Start camera"}
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => void capture()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white disabled:opacity-50">
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {isDe ? "Aufnehmen und weiter" : "Capture and continue"}
            </button>
          )}
        </>
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function ImagePicker({ label, hint, value, onChange, disabled = false }: { label: string; hint: string; value: PickedImage | null; onChange: (file: File) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative flex aspect-[1.58] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-2 border-dashed text-center transition-colors cursor-pointer",
        value ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {value ? (
        <img src={value.previewUrl} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <FileImage className="h-6 w-6 text-primary" />
          <span className="text-xs font-bold text-slate-700">{label}</span>
          <span className="px-3 text-[10px] text-slate-500">{hint}</span>
        </>
      )}
      {value && (
        <span className="absolute bottom-1.5 right-1.5 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">{label}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onChange(file);
        }}
      />
    </button>
  );
}

export function IdentityVerificationStep({ isDe, onSubmitted }: { isDe: boolean; onSubmitted?: (summary: VerificationSummary) => void }) {
  const applyUser = useAuthStore((state) => state.applyUser);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("SWISS_ID_CARD");
  const [front, setFront] = useState<PickedImage | null>(null);
  const [back, setBack] = useState<PickedImage | null>(null);
  const [replacements, setReplacements] = useState<Partial<Record<Side, PickedImage>>>({});
  const [submittingSide, setSubmittingSide] = useState<Side | null>(null);
  const [error, setError] = useState("");
  const [addingDocument, setAddingDocument] = useState(false);
  const previewsRef = useRef<string[]>([]);

  const document = DOCUMENTS.find((item) => item.type === documentType)!;
  const sideLabel = (side: Side) => (side === "FRONT" ? (isDe ? "Vorderseite" : "Front") : (isDe ? "Rückseite" : "Back"));

  const applyStatus = useCallback((next: StatusResponse) => {
    setStatus(next);
    if (next.status === "REJECTED" && next.documentType) setDocumentType(next.documentType);
    applyUser({ verification: next.verification });
  }, [applyUser]);

  useEffect(() => {
    apiRequest<StatusResponse>("/identity-verification/me").then(applyStatus).catch(() => undefined);
  }, [applyStatus]);

  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const toPicked = async (file: File): Promise<PickedImage | null> => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError(isDe ? "Bitte ein JPG-, PNG- oder WebP-Foto wählen." : "Please choose a JPG, PNG or WebP photo.");
      return null;
    }
    setError("");
    const blob = await compressImage(file, DOCUMENT_MAX_DIMENSION, 0.9);
    const previewUrl = URL.createObjectURL(blob);
    previewsRef.current.push(previewUrl);
    return { blob, previewUrl };
  };

  const fail = (submitError: unknown) => setError(submitError instanceof Error ? submitError.message : "Upload failed.");

  const submitSide = async (side: Side, picked: PickedImage | null, type: DocumentType) => {
    setError("");
    if (!picked) return;
    setSubmittingSide(side);
    try {
      const body = new FormData();
      body.append("documentType", type);
      body.append("file", picked.blob, `document-${side.toLowerCase()}.jpg`);
      const result = await apiRequest<StatusResponse>(`/identity-verification/items/${side}`, { method: "POST", body });
      applyStatus(result);
      setAddingDocument(false);
      if (side === "FRONT") setFront(null);
      else setBack(null);
      setReplacements((current) => ({ ...current, [side]: undefined }));
      onSubmitted?.(result.verification);
    } catch (submitError) {
      fail(submitError);
    } finally {
      setSubmittingSide(null);
    }
  };

  const resubmit = async (side: Side) => {
    const picked = replacements[side];
    if (!picked || !status?.documentType) return;
    await submitSide(side, picked, status.documentType);
  };

  if (!status) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
        <RefreshCw className="h-4 w-4 animate-spin" />
        {isDe ? "Status wird geladen…" : "Loading status…"}
      </div>
    );
  }

  const hasSubmission = status.status !== "NOT_SUBMITTED" && status.status !== "REJECTED" && status.items.length > 0 && !addingDocument;

  if (hasSubmission) {
    const submittedDoc = DOCUMENTS.find((item) => item.type === status.documentType);
    const formatDateTime = (value?: string) =>
      value
        ? new Intl.DateTimeFormat(isDe ? "de-CH" : "en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(value))
        : "";
    return (
      <div className="space-y-3">
        {status.uploadBlocked && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <Lock className="h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-xs font-medium text-amber-900">
              {isDe
                ? "Weitere Uploads wurden nach mehreren Ablehnungen gesperrt. Bitte kontaktieren Sie den Support."
                : "Further uploads are blocked after repeated rejections. Please contact support."}
            </p>
          </div>
        )}
        {status.status === "APPROVED" && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-xs font-medium text-emerald-800">
              {isDe ? "Ihre Identität ist verifiziert." : "Your identity is verified."}
            </p>
          </div>
        )}
        {status.status === "PENDING" && (
          <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <Clock className="h-5 w-5 shrink-0 text-sky-600" />
            <p className="text-xs font-medium text-sky-800">
              {isDe ? "Unser Team prüft Ihre Dokumente einzeln." : "Our team is reviewing your documents one by one."}
            </p>
          </div>
        )}
        <p className="text-xs font-bold uppercase text-slate-500">
          {submittedDoc ? (isDe ? submittedDoc.de : submittedDoc.en) : (isDe ? "Dokument" : "Document")}
          {status.submittedAt && <span className="ml-2 font-medium normal-case text-slate-400">· {formatDateTime(status.submittedAt)}</span>}
        </p>

        {status.documents.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {status.documents.map((entry) => {
              const label = DOCUMENTS.find((documentEntry) => documentEntry.type === entry.documentType);
              return (
                <span key={entry.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {label ? (isDe ? label.de : label.en) : entry.documentType} · {entry.status === "PENDING" ? (isDe ? "In Prüfung" : "In review") : entry.status}
                </span>
              );
            })}
          </div>
        )}

        {status.requiredSides.map((side) => {
          const item = status.items.find((entry) => entry.side === side);
          return (
          <div key={side} className="space-y-2 rounded-2xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-800">{sideLabel(side)}</span>
              {item ? (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                  item.status === "APPROVED" && "border-emerald-200 bg-emerald-100 text-emerald-700",
                  item.status === "PENDING" && "border-sky-200 bg-sky-100 text-sky-700",
                  item.status === "REJECTED" && "border-red-200 bg-red-100 text-red-700"
                )}
              >
                {item.status === "APPROVED" ? (isDe ? "Genehmigt" : "Approved") : item.status === "PENDING" ? (isDe ? "In Prüfung" : "In review") : (isDe ? "Abgelehnt" : "Rejected")}
              </span>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {isDe ? "Nicht eingereicht" : "Not submitted"}
                </span>
              )}
            </div>
            {item?.uploadedAt && <p className="text-[11px] text-slate-500">{isDe ? "Hochgeladen: " : "Uploaded: "}{formatDateTime(item.uploadedAt)}</p>}
            {(!item || item.status === "REJECTED") && !status.uploadBlocked && (
              <>
                {item?.rejectionReason && <p className="text-xs text-red-700">{item.rejectionReason}</p>}
                <ImagePicker
                  label={isDe ? `Foto: ${sideLabel(side)}` : `Photo: ${sideLabel(side)}`}
                  hint={isDe ? "Alle Ecken sichtbar, keine Spiegelung" : "All corners visible, no glare"}
                  value={replacements[side] ?? null}
                  onChange={async (file) => {
                    const picked = await toPicked(file);
                    if (picked) setReplacements((current) => ({ ...current, [side]: picked }));
                  }}
                />
                <button
                  type="button"
                  disabled={!replacements[side] || submittingSide !== null}
                  onClick={() => void resubmit(side)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingSide === side ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isDe ? "Neues Foto einreichen" : "Submit new photo"}
                </button>
              </>
            )}
          </div>
          );
        })}

        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">{error}</p>}

        {status.documents.length < DOCUMENTS.length && !status.uploadBlocked && (
          <button
            type="button"
            onClick={() => {
              const available = DOCUMENTS.find((entry) => !status.documents.some((submitted) => submitted.documentType === entry.type && submitted.status !== "REJECTED"));
              if (available) setDocumentType(available.type);
              setFront(null);
              setBack(null);
              setAddingDocument(true);
            }}
            className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            {isDe ? "Weiteres Dokument hinzufügen" : "Add another document"}
          </button>
        )}

        <LivenessChallenge isDe={isDe} liveness={status.liveness} blocked={status.uploadBlocked} onUploaded={applyStatus} />
      </div>
    );
  }

  const isSameRejectedDocument = status.status === "REJECTED" && status.documentType === documentType;
  const existingFront = isSameRejectedDocument ? status.items.find((item) => item.side === "FRONT") : undefined;
  const existingBack = isSameRejectedDocument ? status.items.find((item) => item.side === "BACK") : undefined;
  const frontUnavailable = status.uploadBlocked || Boolean(existingFront && existingFront.status !== "REJECTED");
  const backUnavailable = status.uploadBlocked || Boolean(existingBack && existingBack.status !== "REJECTED");

  return (
    <div className="space-y-4">
      {status.status === "REJECTED" && (
        <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-xs font-medium text-red-800">
              {isDe
                ? "Das Dokument wurde abgelehnt. Wählen Sie unten denselben oder einen anderen Dokumenttyp und reichen Sie die benötigte Seite erneut ein."
                : "The document was rejected. Select the same or a different document type below and submit the required side again."}
            </p>
          </div>
          {status.items.filter((item) => item.status === "REJECTED").map((item) => (
            <p key={item.side} className="pl-8 text-xs text-red-700">
              <strong>{sideLabel(item.side)}:</strong> {item.rejectionReason || (isDe ? "Abgelehnt" : "Rejected")}
            </p>
          ))}
        </div>
      )}

      {status.uploadBlocked && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <Lock className="h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-xs font-medium text-amber-900">
            {isDe
              ? "Weitere Uploads wurden nach mehreren Ablehnungen gesperrt. Bitte kontaktieren Sie den Support."
              : "Further uploads are blocked after repeated rejections. Please contact support."}
          </p>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">{isDe ? "1. Dokument wählen" : "1. Choose your document"}</p>
        <div className="grid grid-cols-2 gap-2">
          {DOCUMENTS.map((item) => (
            (() => {
              const submitted = status.documents.find((entry) => entry.documentType === item.type);
              const unavailable = Boolean(submitted && submitted.status !== "REJECTED");
              return (
            <button
              key={item.type}
              type="button"
              disabled={unavailable}
              onClick={() => {
                setDocumentType(item.type);
                setFront(null);
                setBack(null);
                if (!item.requiresBack) setBack(null);
              }}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer",
                documentType === item.type ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                unavailable && "cursor-not-allowed opacity-45"
              )}
            >
              {isDe ? item.de : item.en}
            </button>
              );
            })()
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">{isDe ? "2. Dokument fotografieren" : "2. Photograph your document"}</p>
        <div className={cn("grid gap-2", document.requiresBack ? "grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-2">
            <ImagePicker
              label={document.requiresBack ? sideLabel("FRONT") : (isDe ? "Fotoseite" : "Photo page")}
              hint={isDe ? "Alle Ecken sichtbar, keine Spiegelung" : "All corners visible, no glare"}
              value={front}
              disabled={frontUnavailable}
              onChange={async (file) => {
                if (!frontUnavailable) setFront((await toPicked(file)) ?? front);
              }}
            />
            <button
              type="button"
              disabled={!front || submittingSide !== null || frontUnavailable}
              onClick={() => void submitSide("FRONT", front, documentType)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {submittingSide === "FRONT" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {existingFront?.status === "APPROVED"
                ? (isDe ? "Vorderseite bereits genehmigt" : "Front already approved")
                : existingFront?.status === "PENDING"
                  ? (isDe ? "Vorderseite wird geprüft" : "Front is in review")
                  : (isDe ? "Vorderseite einreichen" : "Submit front")}
            </button>
          </div>
          {document.requiresBack && (
            <div className="space-y-2">
              <ImagePicker
                label={sideLabel("BACK")}
                hint={isDe ? "Alle Ecken sichtbar, keine Spiegelung" : "All corners visible, no glare"}
                value={back}
                disabled={backUnavailable}
                onChange={async (file) => {
                  if (!backUnavailable) setBack((await toPicked(file)) ?? back);
                }}
              />
              <button
                type="button"
                disabled={!back || submittingSide !== null || backUnavailable}
                onClick={() => void submitSide("BACK", back, documentType)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {submittingSide === "BACK" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {existingBack?.status === "APPROVED"
                  ? (isDe ? "Rückseite bereits genehmigt" : "Back already approved")
                  : existingBack?.status === "PENDING"
                    ? (isDe ? "Rückseite wird geprüft" : "Back is in review")
                    : (isDe ? "Rückseite einreichen" : "Submit back")}
              </button>
            </div>
          )}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {isDe ? "Jede Seite wird separat eingereicht und geprüft." : "Each side is submitted and reviewed independently."}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          {isDe
            ? "Ihre Dokumente werden verschlüsselt gespeichert, sind nur für unser Prüfteam sichtbar und werden nach der Prüfung gelöscht (gemäss Schweizer Datenschutzgesetz, DSG)."
            : "Your documents are stored encrypted, are visible only to our verification team, and are deleted once they have been reviewed (Swiss Federal Act on Data Protection, FADP)."}
        </span>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">{error}</p>}

      <LivenessChallenge isDe={isDe} liveness={status.liveness} blocked={status.uploadBlocked} onUploaded={applyStatus} />

      <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
        <ShieldCheck className="h-3 w-3" />
        {isDe ? "Akzeptiert: Schweizer ID, Schweizer Pass, Ausweis B oder C" : "Accepted: Swiss ID card, Swiss passport, permit B or C"}
      </p>
    </div>
  );
}
