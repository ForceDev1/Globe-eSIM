type IridescentButtonProps = {
  label?: string;
  onClick?: () => void;
};

/**
 * The reference "Home" button, rebuilt to match: a dark glass badge with a
 * house glyph, ringed by a rotating iridescent highlight. The ring's motion
 * (see ringSwing/ringGlow in globals.css) is not hand-animated — it's
 * resampled from actual frame-by-frame measurements of the reference clip.
 */
export default function IridescentButton({ label = "Home", onClick }: IridescentButtonProps) {
  return (
    <button type="button" className="iri-btn" onClick={onClick}>
      <span className="iri-btn-badge">
        <span className="iri-btn-ring-glow" aria-hidden />
        <span className="iri-btn-ring" aria-hidden />
        <svg
          className="iri-btn-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 3 L20 10 L20 21 L14.5 21 L14.5 13 L9.5 13 L9.5 21 L4 21 L4 10 Z" />
        </svg>
      </span>
      <span className="iri-btn-label">{label}</span>
    </button>
  );
}
