"use client";

import { useEffect, useState } from "react";

export function HomeHeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setPlayVideo(wide.matches && !reduce.matches);
    update();
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className="fixed inset-0 z-0 overflow-hidden">
      {/* Poster paints immediately. The video plays on larger screens only. */}
      <img
        src="/hero-poster.jpg"
        alt=""
        className="h-full w-full object-cover"
      />
      {playVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          preload="metadata"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </section>
  );
}
