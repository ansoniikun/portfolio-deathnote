"use client";
import { useEffect, useRef, useState } from "react";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const audio = new Audio("/music/Low of Solipsism.mp3");
    audioRef.current = audio;
    audio.loop = true;
    audio.muted = false;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / 5;

      const buckets = [0, 0, 0];
      const groupSize = Math.floor(bufferLength / 3);

      for (let i = 0; i < bufferLength; i++) {
        const bucketIndex = Math.floor(i / groupSize);
        if (bucketIndex < 3) {
          buckets[bucketIndex] += dataArray[i];
        }
      }

      for (let i = 0; i < 3; i++) {
        const avg = buckets[i] / groupSize;
        const barHeight = (avg / 255) * height;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          (i + 1) * barWidth,
          height - barHeight,
          barWidth * 0.2,
          barHeight
        );
      }
    };

    const onScroll = () => {
      if (!hasStarted && audioCtxRef.current && audioRef.current) {
        audioCtxRef.current.resume().then(() => {
          audioRef.current.play().then(() => {
            setHasStarted(true);
            draw();
          });
        });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasStarted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <canvas
        onClick={toggleMute}
        ref={canvasRef}
        width={100}
        height={60}
        className="mb-2 cursor-pointer bg-transparent"
        title={isMuted ? "Unmute" : "Mute"}
      />
    </div>
  );
};

export default AudioVisualizer;
