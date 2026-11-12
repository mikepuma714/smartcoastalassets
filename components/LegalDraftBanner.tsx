export function LegalDraftBanner() {
  if (process.env.NEXT_PUBLIC_LEGAL_APPROVED === "true") return null;
  return (
    <div role="note" className="mb-10 rounded-sm border border-gold-400 bg-gold-300/15 p-4 text-sm text-navy-900">
      <strong>Draft pending legal review.</strong> This document must be reviewed and approved by legal counsel before
      launch. Set <code>NEXT_PUBLIC_LEGAL_APPROVED=true</code> once approved to remove this notice.
    </div>
  );
}
