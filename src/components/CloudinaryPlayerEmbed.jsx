/**
 * Direct Cloudinary delivery — use either a full `deliveryUrl` (versioned paths OK)
 * or `cloudName` + `publicId` (simple assets). API secrets never belong in the client.
 */

import { useLayoutEffect, useRef } from "react";

function encodedPublicSegments(publicId) {
  return publicId.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

/** Best-effort JPG poster from a `.mp4` delivery URL (q_auto/f_auto → frame grab). */
function posterFromDeliveryMp4(mp4Url) {
  if (!mp4Url || !/\.mp4(\?|$)/i.test(mp4Url)) return undefined;
  const withTransform = mp4Url.replace(
    /\/upload\/q_auto\/f_auto\//,
    "/upload/so_1,q_auto,f_jpg,w_1280/"
  );
  return withTransform.replace(/\.mp4(\?.*)?$/i, ".jpg");
}

export default function CloudinaryPlayerEmbed({
  cloudName,
  publicId,
  posterSrc,
  deliveryUrl,
}) {
  const src = deliveryUrl?.trim()
    ? deliveryUrl.trim()
    : `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${encodedPublicSegments(publicId)}`;

  const poster =
    posterSrc?.trim() ||
    (deliveryUrl ? posterFromDeliveryMp4(deliveryUrl) : undefined) ||
    (cloudName && publicId
      ? `https://res.cloudinary.com/${cloudName}/video/upload/so_1,q_auto,f_jpg,w_1280/${encodedPublicSegments(publicId)}`
      : undefined);

  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    const p = el.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {});
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="pointer-events-auto h-full w-full bg-black object-cover"
      controls
      playsInline
      preload="auto"
      autoPlay
      src={src}
      poster={poster}
    >
      <track kind="captions" />
    </video>
  );
}
