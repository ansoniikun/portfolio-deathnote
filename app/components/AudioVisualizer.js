"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const initializeAudio = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Create audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Set audio properties
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.volume = 0.7;
      audio.preload = "auto";

      const possiblePaths = ["/music/Low of Solipsism.mp3"];

      let audioLoaded = false;
      for (const path of possiblePaths) {
        try {
          audio.src = path;
          await new Promise((resolve, reject) => {
            audio.addEventListener("loadeddata", resolve, { once: true });
            audio.addEventListener("error", reject, { once: true });
            audio.load();
          });
          audioLoaded = true;
          setAudioError(null);
          break;
        } catch (err) {
          console.warn(`Failed to load audio from ${path}:`, err);
        }
      }

      if (!audioLoaded) {
        throw new Error("Could not load audio from any source");
      }

      // Create audio context
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      // Create analyser
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;

      const source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = 64;

      // Audio event listeners
      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("volumechange", () => setIsMuted(audio.muted));
      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setAudioError("Failed to load audio file");
      });

      return { audio, audioCtx, analyser, ctx };
    } catch (error) {
      console.error("Error initializing audio:", error);
      setAudioError(error.message);
      return null;
    }
  };

  const startVisualization = (analyser, ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyser || !ctx) return;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / 5;

      // Create 3 frequency buckets
      const buckets = [0, 0, 0];
      const groupSize = Math.floor(bufferLength / 3);

      for (let i = 0; i < bufferLength; i++) {
        const bucketIndex = Math.floor(i / groupSize);
        if (bucketIndex < 3) {
          buckets[bucketIndex] += dataArray[i];
        }
      }

      // Draw bars
      for (let i = 0; i < 3; i++) {
        const avg = buckets[i] / groupSize;
        const barHeight = Math.max((avg / 255) * height, 2); // Minimum height of 2px

        // Add some visual feedback even when muted
        const opacity = isMuted ? 0.3 : 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        ctx.fillRect(
          (i + 1) * barWidth,
          height - barHeight,
          barWidth * 0.2,
          barHeight
        );
      }

      // Draw mute indicator
      if (isMuted) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        ctx.fillRect(width - 15, 5, 10, 2);
      }
    };

    draw();
  };

  const handleUserInteraction = async () => {
    if (hasUserInteracted) return;

    setHasUserInteracted(true);

    const audioData = await initializeAudio();
    if (!audioData) return;

    const { audio, audioCtx, analyser, ctx } = audioData;

    try {
      // Resume audio context if suspended
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // Start playback
      await audio.play();
      startVisualization(analyser, ctx);
    } catch (error) {
      console.error("Error starting audio:", error);
      setAudioError("Could not start audio playback");
    }
  };

  const toggleMute = async () => {
    if (!hasUserInteracted) {
      await handleUserInteraction();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const togglePlayPause = async () => {
    if (!hasUserInteracted) {
      await handleUserInteraction();
      return;
    }

    const audio = audioRef.current;
    const audioCtx = audioCtxRef.current;

    if (!audio || !audioCtx) return;

    try {
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {audioError && (
        <div className="mb-2 p-2 bg-red-500 text-white text-xs rounded max-w-48">
          {audioError}
        </div>
      )}

      <div className="flex gap-2 mb-2">
        <button
          onClick={togglePlayPause}
          className="px-3 py-1  text-white text-xs transition-colors"
          title={
            !hasUserInteracted ? "Start Audio" : isPlaying ? "Pause" : "Play"
          }
        >
          {!hasUserInteracted ? (
            <Music size={16} />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="px-3 py-1  text-white text-xs  transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={100}
        height={60}
        className="cursor-pointer bg-transparent "
        onClick={toggleMute}
        title={
          !hasUserInteracted
            ? "Click to start audio"
            : isMuted
            ? "Unmute"
            : "Mute"
        }
      />
    </div>
  );
};

export default AudioVisualizer;
