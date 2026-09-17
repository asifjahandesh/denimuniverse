interface IconProps {
  size?: number | string;
  className?: string;
}

export default function DenimUniverseIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Denim Universe Icon"
      role="img"
    >
      <defs>
        <radialGradient id="denimPatchIcon" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#9bb3cc" />
          <stop offset="60%" stopColor="#7291b2" />
          <stop offset="100%" stopColor="#4d6e91" />
        </radialGradient>
        <filter id="patchShadowIcon" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0a1633" floodOpacity="0.35" />
        </filter>
      </defs>

      <circle cx="64" cy="64" r="60" fill="url(#denimPatchIcon)" filter="url(#patchShadowIcon)" />
      <circle cx="64" cy="64" r="57" fill="none" stroke="#d5e3ef" strokeWidth="1.2" strokeDasharray="3, 2.5" opacity="0.85" />
      <circle cx="64" cy="64" r="54.5" fill="none" stroke="#2c4766" strokeWidth="0.7" opacity="0.3" />

      {/* Eco Leaves */}
      <g transform="translate(32, 28) scale(0.65)">
        <path d="M16 26 C16 10 32 4 36 2 C36 18 26 28 16 26 Z" fill="#689f38" opacity="0.9" />
        <path d="M16 26 C8 15 2 15 0 18 C3 28 12 30 16 26 Z" fill="#8bc34a" />
        <path d="M16 26 C22 14 30 7 34 3" fill="none" stroke="#4c7526" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* DENIM Text */}
      <text x="64" y="65" textAnchor="middle" fontFamily="'Impact', 'Arial Black', sans-serif" fontWeight="900" fontSize="25" fill="#3b5e82" letterSpacing="1">DENIM</text>
      <text x="64" y="65" textAnchor="middle" fontFamily="'Impact', 'Arial Black', sans-serif" fontWeight="900" fontSize="25" fill="none" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="1.5, 1" letterSpacing="1">DENIM</text>

      {/* Universe Text */}
      <text x="64" y="80" textAnchor="middle" fontFamily="'Poppins', 'Segoe UI', sans-serif" fontWeight="700" fontSize="14.5" fill="#faf6ee">Universe</text>

      {/* Divider */}
      <line x1="28" y1="88" x2="100" y2="88" stroke="#f1f5f9" strokeWidth="0.8" opacity="0.8" />

      {/* 4 Pillars Icons */}
      <path d="M33 93 L38 93 L39 101 L37.5 101 L36 96 L34.5 101 L33 101 Z" fill="#faf6ee" opacity="0.9" />
      <circle cx="53" cy="95" r="2.2" fill="#faf6ee" opacity="0.9" />
      <rect x="52.2" y="97.8" width="1.6" height="1.2" fill="#faf6ee" opacity="0.9" />
      <rect x="71" y="93.5" width="4.5" height="4.5" rx="0.6" fill="#faf6ee" opacity="0.9" />
      <line x1="70" y1="95.7" x2="76.5" y2="95.7" stroke="#faf6ee" strokeWidth="0.6" opacity="0.7" />
      <path d="M89 98 C89 94 94 92 95 91 C95 95 92 98 89 98 Z" fill="#faf6ee" opacity="0.9" />
    </svg>
  );
}