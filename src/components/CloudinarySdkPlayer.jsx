import { useEffect, useRef } from "react";

/**
 * Cloudinary Video Player async API (`cloudinary.player`).
 * Uses a mounting `<video>` ref instead of a global id `'player'` so multiple cards stay valid.
 */
export default function CloudinarySdkPlayer({ cloudName, publicId, poster }) {
  const videoRef = useRef(null);
  const disposedRef = useRef(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const idOk = typeof cloudName === "string" && cloudName.trim() && typeof publicId === "string" && publicId.trim();
    if (!idOk) return;

    disposedRef.current = false;
    playerRef.current = null;

    (async () => {
      await import("cloudinary-video-player/cld-video-player.min.css");
      const { default: cloudinary } = await import("cloudinary-video-player");

      if (disposedRef.current || !videoRef.current) return;

      const result = await cloudinary.player(videoRef.current, {
        cloudName: cloudName.trim(),
        publicId: publicId.trim(),
        ...(typeof poster === "string" && poster.trim()
          ? { poster: poster.trim() }
          : {}),
      });

      if (disposedRef.current) {
        try {
          result?.dispose?.();
        } catch {
          /** ignore teardown races */
        }
        return;
      }

      const resolved =
        result && typeof result.loadPlayer === "function"
          ? await result.loadPlayer()
          : result;

      if (disposedRef.current) {
        try {
          resolved?.dispose?.();
        } catch {
          /** ignore */
        }
        return;
      }

      playerRef.current = resolved;
    })().catch((err) => {
      console.error("Cloudinary player failed:", err);
    });

    return () => {
      disposedRef.current = true;
      try {
        playerRef.current?.dispose?.();
      } catch {
        /** ignore */
      }
      playerRef.current = null;
    };
  }, [cloudName, publicId, poster]);

  return (
    <video
      ref={videoRef}
      playsInline
      className="cld-video-player cld-video-player-skin-dark cld-fluid h-full min-h-0 w-full bg-black object-contain"
    />
  );
}
