"use client";

import { useCallback, useState } from "react";
import { useTrades } from "@/contexts/TradeContext";
import { useAuth } from "@/contexts/AuthContext";
import { parseTradeFile, ACCEPTED_TYPES, detectFormat } from "@/lib/parseFile";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";

type UploadState = "idle" | "dragging" | "parsing" | "success" | "error";

const FORMAT_INFO = {
  csv:  { label: "CSV",  color: "text-emerald-400", icon: FileSpreadsheet },
  xlsx: { label: "XLSX", color: "text-blue-400",    icon: FileSpreadsheet },
  xls:  { label: "XLS",  color: "text-blue-400",    icon: FileSpreadsheet },
  pdf:  { label: "PDF",  color: "text-rose-400",     icon: FileText },
};

export function CsvUploader() {
  const { setTrades, clearTrades, trades } = useTrades();
  const { user, profile, refreshProfile } = useAuth();
  const [state, setState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [count, setCount] = useState(0);

  const processFile = useCallback(
    async (file: File) => {
      const fmt = detectFormat(file.name);
      if (!fmt) {
        setState("error");
        setErrorMsg(
          `Unsupported file type. Please upload a CSV, XLSX, XLS, or PDF.`
        );
        return;
      }

      const tier = profile?.tier || "free";
      const limit = tier === "pro" ? Infinity : (tier === "plus" ? 10 : 3);

      if (profile && profile.uploadCount >= limit) {
        setState("error");
        setErrorMsg(`Plan limit reached (${limit} uploads max). Please upgrade to upload more files.`);
        return;
      }

      setFileName(file.name);
      setFileFormat(fmt);
      setState("parsing");

      try {
        const parsed = await parseTradeFile(file);
        if (parsed.length === 0) {
          throw new Error(
            "No valid trades found. Check that the file has Symbol, Date, Quantity, Buy Price, and Sell Price columns."
          );
        }
        setTrades(parsed);
        setCount(parsed.length);
        setState("success");

        if (user && profile && tier !== "pro") {
          try {
            await updateDoc(doc(db, "users", user.uid), {
              uploadCount: profile.uploadCount + 1,
            });
            await refreshProfile();
          } catch (err) {
            console.error("Failed to update upload count", err);
          }
        }
      } catch (err) {
        setState("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Failed to parse file."
        );
      }
    },
    [setTrades, user, profile, refreshProfile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleClear = () => {
    clearTrades();
    setState("idle");
    setFileName("");
    setFileFormat("");
    setCount(0);
    setErrorMsg("");
  };

  const fmtInfo =
    fileFormat in FORMAT_INFO
      ? FORMAT_INFO[fileFormat as keyof typeof FORMAT_INFO]
      : FORMAT_INFO.csv;
  const FmtIcon = fmtInfo.icon;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setState("dragging");
        }}
        onDragLeave={() => setState("idle")}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${
            state === "dragging"
              ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]"
              : state === "success"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : state === "error"
              ? "border-rose-500/40 bg-rose-500/5"
              : "border-[#1e2d4a] bg-[#0F1729] hover:border-slate-600 hover:bg-slate-800/30"
          }`}
      >
        <label className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={onFileChange}
          />

          {state === "parsing" && (
            <>
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
              <p className="text-sm text-slate-400">
                Parsing{" "}
                <span className={`font-semibold uppercase ${fmtInfo.color}`}>
                  {fileFormat}
                </span>{" "}
                file…
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {fileFormat === "pdf" ? "Extracting table from PDF…" : "Reading spreadsheet…"}
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
              <p className="text-sm font-medium text-emerald-400">
                {count} trades loaded
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono truncate max-w-[220px]">
                {fileName}
              </p>
              <p className="text-xs text-slate-600 mt-1.5">
                Drop another file to replace
              </p>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle className="w-8 h-8 text-rose-500 mb-3" />
              <p className="text-sm font-medium text-rose-400">Parse failed</p>
              <p className="text-xs text-slate-500 mt-1 text-center max-w-[260px] leading-relaxed">
                {errorMsg}
              </p>
              <p className="text-xs text-slate-600 mt-2">Click to try again</p>
            </>
          )}

          {(state === "idle" || state === "dragging") && (
            <>
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-[#1e2d4a] flex items-center justify-center mb-3">
                {state === "dragging" ? (
                  <Upload className="w-5 h-5 text-emerald-400 animate-bounce" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-300">
                {state === "dragging"
                  ? "Drop to import"
                  : "Drag & drop your trade file"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Zerodha · Angel One · Upstox · Groww
              </p>
              <div className="mt-3 px-4 py-1.5 rounded-lg border border-[#1e2d4a] text-xs text-slate-400 bg-slate-800/50">
                or click to browse
              </div>
            </>
          )}
        </label>
      </div>

      {/* Supported formats */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-600 uppercase tracking-wider">
          Formats:
        </span>
        {[
          { ext: "CSV", icon: FileSpreadsheet, color: "text-emerald-400", border: "border-emerald-500/20" },
          { ext: "XLSX", icon: FileSpreadsheet, color: "text-blue-400", border: "border-blue-500/20" },
          { ext: "XLS",  icon: FileSpreadsheet, color: "text-blue-400", border: "border-blue-500/20" },
          { ext: "PDF",  icon: FileText,         color: "text-rose-400",  border: "border-rose-500/20" },
        ].map(({ ext, icon: Icon, color, border }) => (
          <span
            key={ext}
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 border ${border} ${color} font-mono font-medium`}
          >
            <Icon className="w-2.5 h-2.5" />
            {ext}
          </span>
        ))}
      </div>

      {/* Required columns hint */}
      <div className="flex flex-wrap gap-1">
        {["Symbol", "Date", "Quantity", "Buy Price", "Sell Price"].map(
          (col) => (
            <span
              key={col}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-500 font-mono"
            >
              {col}
            </span>
          )
        )}
      </div>

      {/* Clear button */}
      {trades.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          className="w-full"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All Trade Data
        </Button>
      )}
    </div>
  );
}
