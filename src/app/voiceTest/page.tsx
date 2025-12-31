"use client";

import { io, Socket } from "socket.io-client";
import { useRef, useState } from "react";

export default function Page() {
  const socketRef = useRef<Socket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const playNextAudio = () => {
    if (isPlayingRef.current) return;
    if (audioQueueRef.current.length === 0) return;

    isPlayingRef.current = true;

    const audioUrl = audioQueueRef.current.shift()!;
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      isPlayingRef.current = false;
      playNextAudio(); // play next in queue
    };

    audio.onerror = () => {
      isPlayingRef.current = false;
      playNextAudio();
    };

    audio.play().catch(() => {
      isPlayingRef.current = false;
    });
  };

  const startSocket = async () => {
    if (connected) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", async () => {
      setConnected(true);
      await startMic();
    });

    socket.on("audio-data", (body) => {
      const base64Audio = body.data;

      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      audioQueueRef.current.push(audioUrl);
      playNextAudio();
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });
  };

  const startMic = async () => {
    if (micOn) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext({ sampleRate: 16000 });

    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      if (!socketRef.current) return;

      const input = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(input.length);

      for (let i = 0; i < input.length; i++) {
        int16[i] = Math.max(-1, Math.min(1, input[i])) * 32767;
      }

      socketRef.current.emit("stt", {
        int16Buffer: int16.buffer,
        CLIENTID: "2d6e62e2-f555-40af-9771-acf94d47a855",
        sessionId: "bdb7806d-5e54-48a8-81b5-d320dbc54a7e/user/",
      });
    };

    streamRef.current = stream;
    audioCtxRef.current = audioCtx;
    processorRef.current = processor;

    setMicOn(true);
  };

  const stopEverything = () => {
    socketRef.current?.emit("destroyStream");
    socketRef.current?.emit("end-stt");
    socketRef.current?.disconnect();

    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());

    socketRef.current = null;
    processorRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;

    setMicOn(false);
    setConnected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white">
      <div className="bg-slate-900/70 backdrop-blur rounded-2xl p-8 w-[360px] shadow-xl border border-slate-700">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Voice Streaming
        </h1>

        {/* Mic Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={startMic}
            disabled={!connected || micOn}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all
              ${
                micOn
                  ? "bg-red-500 shadow-red-500/40 shadow-lg animate-pulse"
                  : "bg-slate-700 hover:bg-slate-600"
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            🎤
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={startSocket}
            disabled={connected}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-medium disabled:opacity-40"
          >
            Start
          </button>

          <button
            onClick={stopEverything}
            className="flex-1 bg-rose-600 hover:bg-rose-500 py-2 rounded-lg font-medium"
          >
            Stop
          </button>
        </div>

        {/* Status */}
        <div className="mt-6 space-y-2 text-sm">
          <Status label="Socket" active={connected} />
          <Status label="Mic" active={micOn} />
        </div>
      </div>
    </div>
  );
}

function Status({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-lg">
      <span>{label}</span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          active ? "bg-emerald-600" : "bg-slate-600"
        }`}
      >
        {active ? "ON" : "OFF"}
      </span>
    </div>
  );
}
