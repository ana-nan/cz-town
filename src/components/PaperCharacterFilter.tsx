/** Shared alpha-aware finish: clean paper backing follow each PNG silhouette. */
export function PaperCharacterFilter() {
  return <svg className="paper-filter-definitions" aria-hidden="true" width="0" height="0"><defs>
    <filter id="character-cardstock" x="-15%" y="-12%" width="135%" height="135%" colorInterpolationFilters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="0.65" result="edge"/>
      <feFlood floodColor="#f5e9cd" result="stock"/>
      <feComposite in="stock" in2="edge" operator="in" result="backing"/>
      <feOffset in="edge" dx="0.8" dy="1.2" result="offset"/>
      <feFlood floodColor="#786148" floodOpacity="0.28" result="edgeColor"/>
      <feComposite in="edgeColor" in2="offset" operator="in" result="thickness"/>
      <feMerge><feMergeNode in="thickness"/><feMergeNode in="backing"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs></svg>;
}
