"use client";

import { useRef, useState } from "react";
import io from "socket.io-client";
import { fetchJson } from "@/lib/api";

export default function RemotePage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [sessionCode, setSessionCode] = useState("");
  const [mode, setMode] = useState<"agent" | "requester">("agent");
  const [info, setInfo] = useState<string>("");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  async function connectAsRequester() {
    setInfo("Connecting as requester...");
    // 1) دریافت توکن اتصال از بک‌اند با کُد
    const { token } = await fetchJson<{ token: string; expiresInSeconds: number }>(`/remote-sessions/code/${sessionCode}/connect-token`, { method: "POST" });
    // 2) اتصال Socket.io
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/ws/remote`, { auth: { token } });
    socketRef.current = socket;
    // 3) ایجاد PeerConnection و ارسال استریم صفحه کاربر
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      await localVideoRef.current.play();
    }
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", { candidate: e.candidate });
    };
    // 4) Offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { sdp: offer });
    // 5) Listen for answer/candidates
    socket.on("answer", async ({ sdp }) => {
      await pc.setRemoteDescription(sdp);
    });
    socket.on("candidate", async ({ candidate }) => {
      try { await pc.addIceCandidate(candidate); } catch {}
    });
    setInfo("Requester: waiting for agent to answer...");
  }

  async function connectAsAgent() {
    setInfo("Connecting as agent...");
    // 1) گرفتن توکن claim-by-code (نیازمند ورود)
    const { token } = await fetchJson<{ token: string; expiresInSeconds: number }>(`/remote-sessions/code/${sessionCode}/claim`, { method: "POST", auth: true });
    // 2) اتصال Socket.io
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/ws/remote`, { auth: { token } });
    socketRef.current = socket;
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;
    pc.ontrack = async (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        await remoteVideoRef.current.play();
      }
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", { candidate: e.candidate });
    };
    socket.on("offer", async ({ sdp }) => {
      await pc.setRemoteDescription(sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { sdp: answer });
      setInfo("Agent: streaming...");
    });
    socket.on("candidate", async ({ candidate }) => {
      try { await pc.addIceCandidate(candidate); } catch {}
    });
  }

  function disconnect() {
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    setInfo("Disconnected");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Remote Session</h1>
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <label className="text-sm block">Session Code</label>
          <input value={sessionCode} onChange={(e) => setSessionCode(e.target.value)} placeholder="ABC123" className="px-3 py-2 rounded-md border bg-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-sm block">Role</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as "agent" | "requester")} className="px-3 py-2 rounded-md border bg-transparent">
            <option value="agent">Agent (viewer)</option>
            <option value="requester">Requester (share screen)</option>
          </select>
        </div>
        <button onClick={mode === "requester" ? connectAsRequester : connectAsAgent} className="h-10 px-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Connect</button>
        <button onClick={disconnect} className="h-10 px-4 rounded-md border">Disconnect</button>
      </div>
      <div className="text-xs opacity-70">{info}</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm mb-2">Local</div>
          <video ref={localVideoRef} className="w-full aspect-video bg-black" playsInline muted />
        </div>
        <div>
          <div className="text-sm mb-2">Remote</div>
          <video ref={remoteVideoRef} className="w-full aspect-video bg-black" playsInline />
        </div>
      </div>
    </div>
  );
}


