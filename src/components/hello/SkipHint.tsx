/** Barely-there "tap anywhere to skip" affordance — bottom of the stage. */
export default function SkipHint() {
  return (
    <div className="hello-skip-hint" aria-hidden>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
      </svg>
      <span>Тапни чтобы пропустить</span>
    </div>
  );
}
