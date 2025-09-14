"use client";

import { useEffect, useRef, useState } from "react";

export default function RemotePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch (e) {
        console.error(e);
      }
    }
    setup();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Remote Session (Preview)</h1>
      <div className="rounded-md border p-2">
        <video ref={videoRef} className="w-full aspect-video bg-black" playsInline muted />
      </div>
      {!ready ? <div className="text-sm opacity-70">Grant screen permission to preview.</div> : null}
    </div>
  );
}

