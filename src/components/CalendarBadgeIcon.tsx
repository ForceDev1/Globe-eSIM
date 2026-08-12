export default function CalendarBadgeIcon({
  day = 10,
  className,
}: {
  day?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 9H21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 2.5V5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 2.5V5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
      >
        {day}
      </text>
    </svg>
  );
}
