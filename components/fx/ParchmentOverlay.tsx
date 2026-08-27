export default function ParchmentOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] mix-blend-multiply"
      style={{
        backgroundImage: "url('/assets/photos/parchment-texture.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.55,
      }}
    >
      {/* Subtle radial vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(43,43,42,0.08) 100%)",
        }}
      />
      {/* Fine grain noise layer for vintage paper feel on top of the texture */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" opacity="0.12" />
      </svg>
    </div>
  );
}
