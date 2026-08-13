/**
 * Decorative "global routes" illustration for the plan sheet — an original
 * gradient-sky graphic instead of a stock travel photo: a dashed flight arc
 * between two waypoints, a couple of planes, and soft cloud puffs.
 */
export default function TravelHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4E7FE0" />
          <stop offset="55%" stopColor="#7CA9F0" />
          <stop offset="100%" stopColor="#CFE3FF" />
        </linearGradient>
        <radialGradient id="sun" cx="80%" cy="18%" r="30%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="220" fill="url(#sky)" />
      <rect width="400" height="220" fill="url(#sun)" />

      {/* cloud puffs */}
      <g fill="#ffffff" opacity="0.35">
        <ellipse cx="60" cy="150" rx="46" ry="14" />
        <ellipse cx="95" cy="142" rx="30" ry="11" />
        <ellipse cx="330" cy="70" rx="40" ry="12" />
        <ellipse cx="300" cy="64" rx="24" ry="9" />
      </g>

      {/* flight arc between two waypoints */}
      <path
        d="M55 165 C 130 40, 270 40, 345 95"
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2"
        strokeDasharray="1 10"
        strokeLinecap="round"
      />
      <circle cx="55" cy="165" r="4" fill="#ffffff" />
      <circle cx="345" cy="95" r="4" fill="#ffffff" />
      <circle cx="55" cy="165" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
      <circle cx="345" cy="95" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

      {/* planes, following the arc's rough heading */}
      <g transform="translate(150 88) rotate(-18) scale(1.15)" fill="#ffffff">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>
      <g transform="translate(255 55) rotate(12) scale(0.85)" fill="#ffffff" opacity="0.9">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>

      {/* gradient wash for legible overlay text at the bottom */}
      <rect y="130" width="400" height="90" fill="url(#fade)" />
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1730" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B1730" stopOpacity="0.55" />
        </linearGradient>
      </defs>
    </svg>
  );
}
