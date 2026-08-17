// Small hand-rolled stroke icons (lucide-style: 2px stroke, round caps) —
// kept local to the home screen rather than pulling back a dependency for
// a handful of glyphs.
import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z" />
      <path d="M10.3 20a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.7 0-3 .8-4.5 2.5C11.5 4.8 10.2 4 8.5 4A4.5 4.5 0 0 0 4 8.5C4 10.8 5.5 12.5 7 14l6 6Z" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function ThermometerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a2 2 0 0 0-2 2v9.5a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2Z" />
      <path d="M12 14v-4" />
    </svg>
  );
}

export function PulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function DropletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
    </svg>
  );
}

export function RunningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <circle cx="14.5" cy="4.5" r="1.8" />
      <path d="M13.2 8.1c-.4-.3-1-.4-1.5-.1L8.4 9.7c-.3.2-.5.5-.5.9v3l-3 1.4c-.5.2-.7.8-.5 1.3.2.4.8.6 1.3.4l3.6-1.7c.4-.2.7-.6.7-1v-1.9l1.8-.9.6 2.3-3 3.3c-.2.3-.3.6-.2 1l1 4c.1.5.6.9 1.2.7.5-.1.9-.6.7-1.2l-.9-3.6 3.1-3.4c.4-.4.5-1 .3-1.5l-.8-2.6 1.7-.8 1 1.9c.2.4.6.6 1 .6h3c.5 0 1-.4 1-1s-.5-1-1-1h-2.4l-1.4-2.6c-.2-.4-.5-.6-.9-.7l-3-.7Z" />
    </svg>
  );
}

export function HomeNavIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function ActivitiesNavIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M7.5 13h2l1.5-3 2 6 1.5-3h2" />
    </svg>
  );
}

export function InsightsNavIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}
