// src/components/ScanAttendance.tsx
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const COOLDOWN_MS = 2500; // how long we ignore repeated decodes
const QUICK_PAUSE_AFTER_SUCCESS_MS = 600; // brief camera pause to prevent re-decoding same frame

type Props = {
  type?: "class" | "entry";
  classId?: number | string | null;
  gradeLevel?: string; // <-- used for membership check
  section?: string; // <-- used for membership check
  apiPath?: string; // should point to /api/attendances (resource)
  date?: string; // YYYY-MM-DD
  onSaved?: (row: any) => void;
};

type Student = {
  id: number;
  barcode: string;
  full_name: string;
  grade_level: string;
  section?: string | null;
};

export default function ScanAttendance({
  type = "class",
  classId = null,
  gradeLevel = "",
  section = "",
  apiPath = "/attendances",
  date = new Date().toISOString().slice(0, 10),
  onSaved,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  // Use REFS (not state) for things used inside the decode loop
  const lastScanTsRef = useRef<number>(0);
  const lastBarcodeRef = useRef<string>("");
  const busyRef = useRef<boolean>(false); // lock while a request is in-flight

  const [cams, setCams] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [scanning, setScanning] = useState(false);

  // Cache membership decisions to avoid repeated lookups
  const allowCache = useRef(new Map<string, boolean>());

  const createAttendance = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(apiPath, payload, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: (data) => {
      beep();
      // Prefer server-returned action + student name if present
      const action = data?.action as string | undefined;
      const student = data?.student as string | undefined;
      if (action && student) {
        const verb =
          action === "time_in"
            ? "timed in"
            : action === "time_out"
            ? "timed out"
            : "recorded";
        toast.success(`${student} ${verb}.`);
      } else {
        toast.success("Attendance recorded.");
      }
      onSaved?.(data);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string" ? err.response.data : "") ??
        err.message;
      toast.error(msg);
    },
    onSettled: () => {
      busyRef.current = false; // release lock
      // quick pause & resume to avoid re-decoding the same frame that just succeeded
      quickPauseCamera();
    },
  });

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureSecureContext = () => {
    if (!window.isSecureContext) {
      toast.error("Camera requires HTTPS or localhost.");
      return false;
    }
    return true;
  };

  const listCams = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vids = devices.filter((d) => d.kind === "videoinput");
      setCams(vids as MediaDeviceInfo[]);
      const back =
        vids.find((d) => /back|rear|environment/i.test(d.label)) || vids[0];
      setDeviceId(back?.deviceId ?? "");
    } catch (e: any) {
      toast.error(`Unable to list cameras: ${e.message}`);
    }
  };

  const start = async () => {
    if (!ensureSecureContext()) return;
    if (!readerRef.current || !videoRef.current) return;

    stop();

    try {
      const preConstraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: "environment" } },
        audio: false,
      };

      // Probe permission first
      const testStream = await navigator.mediaDevices.getUserMedia(
        preConstraints
      );
      testStream.getTracks().forEach((t) => t.stop());

      const v = videoRef.current;
      v.setAttribute("autoplay", "true");
      v.setAttribute("muted", "true");
      v.setAttribute("playsinline", "true");

      setScanning(true);

      controlsRef.current = await readerRef.current.decodeFromConstraints(
        preConstraints,
        v,
        (result, _err) => {
          if (!result) return;

          const text = result.getText().trim();
          const now = Date.now();

          // HARD GUARDS
          if (busyRef.current) return; // a request is inflight
          if (now - lastScanTsRef.current < COOLDOWN_MS) return; // cooldown window
          if (
            text === lastBarcodeRef.current &&
            now - lastScanTsRef.current < COOLDOWN_MS * 2
          )
            return; // same code twice too soon

          // Update guards BEFORE mutate to close race window
          lastScanTsRef.current = now;
          lastBarcodeRef.current = text;
          busyRef.current = true;

          // async check + maybe mutate
          void handleDecoded(text);
        }
      );

      await v.play().catch(() => {});
      if (cams.length === 0) await listCams();
    } catch (e: any) {
      setScanning(false);
      toast.error(e?.message ?? "Failed to start camera");
    }
  };

  const stop = () => {
    try {
      controlsRef.current?.stop();
      controlsRef.current = null;
    } catch {}
    const stream: MediaStream | null =
      (videoRef.current as any)?.srcObject ?? null;
    stream?.getTracks?.().forEach((t) => t.stop());
    if (videoRef.current) (videoRef.current as any).srcObject = null;
    setScanning(false);
  };

  const quickPauseCamera = () => {
    // brief stop to avoid the exact same frame being decoded again
    try {
      controlsRef.current?.stop();
      controlsRef.current = null;
    } catch {}
    setTimeout(() => {
      if (scanning) start();
    }, QUICK_PAUSE_AFTER_SUCCESS_MS);
  };

  // ---------- Frontend-only membership gate helpers ----------
  const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();

  async function findStudentByBarcode(
    barcode: string
  ): Promise<Student | null> {
    try {
      const res = await api.get("/students", {
        params: { q: barcode, per_page: 5 },
        withCredentials: true,
      });
      const list = (res.data?.data ?? []) as Student[];
      const exact = list.find((s) => norm(String(s.barcode)) === norm(barcode));
      return exact ?? null;
    } catch {
      return null;
    }
  }

  async function isBarcodeAllowedForClass(code: string): Promise<boolean> {
    // only gate for class scans and if we have class metadata
    if (type !== "class") return true;

    const key = norm(code);
    if (allowCache.current.has(key)) {
      return allowCache.current.get(key)!;
    }

    const student = await findStudentByBarcode(code);
    if (!student) {
      toast.error("Student not found for this barcode.");
      allowCache.current.set(key, false);
      return false;
    }

    const sameGL = norm(student.grade_level) === norm(gradeLevel);
    const sameSec = norm(student.section) === norm(section);

    if (!sameGL || !sameSec) {
      toast.error(
        `Not in this class (scanned: ${student.grade_level} ${
          student.section ?? ""
        }).`
      );
      allowCache.current.set(key, false);
      return false;
    }

    allowCache.current.set(key, true);
    return true;
  }
  // ----------------------------------------------------------

  const handleDecoded = async (barcodeText: string) => {
    if (!classId && type === "class") {
      busyRef.current = false; // release lock if we bail
      toast.error("Missing class id");
      quickPauseCamera();
      return;
    }

    // FRONTEND GUARD: block if not in class
    const allowed = await isBarcodeAllowedForClass(barcodeText);
    if (!allowed) {
      busyRef.current = false;
      quickPauseCamera();
      return;
    }

    // proceed with API call
    createAttendance.mutate({
      action: "scan",
      class_id: classId ?? undefined,
      barcode: barcodeText,
      date,
    });
  };

  const beep = () => {
    const AC: any =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.06;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 120);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          className="border rounded px-2 py-1"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        >
          {cams.map((c) => (
            <option key={c.deviceId} value={c.deviceId}>
              {c.label || c.deviceId}
            </option>
          ))}
        </select>

        <button
          className="rounded bg-blue-600 text-white px-3 py-1 disabled:opacity-50"
          onClick={scanning ? stop : start}
        >
          {scanning ? "Stop" : "Start"} Scan
        </button>

        {createAttendance.isPending && (
          <span className="text-sm text-muted-foreground">Saving…</span>
        )}
      </div>

      <div className="overflow-hidden rounded bg-black">
        <video
          ref={videoRef}
          className="w-full max-h-[420px]"
          muted
          playsInline
          autoPlay
        />
      </div>
    </div>
  );
}
