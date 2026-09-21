export function IllustrationChatBubbles() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Top Bubble */}
      <rect x="28" y="8" width="48" height="26" rx="6" className="fill-white/90 stroke-stone-900" />
      <line x1="38" y1="17" x2="66" y2="17" className="stroke-stone-900" strokeWidth="2" />
      <line x1="38" y1="24" x2="56" y2="24" className="stroke-stone-900" strokeWidth="2" />
      {/* Top avatar */}
      <circle cx="16" cy="20" r="7" className="fill-white stroke-stone-900" />
      <circle cx="16" cy="18" r="2.5" className="fill-stone-900" />
      
      {/* Bottom Bubble */}
      <rect x="10" y="44" width="52" height="28" rx="6" className="fill-white/90 stroke-stone-900" />
      <line x1="20" y1="54" x2="52" y2="54" className="stroke-stone-900" strokeWidth="2" />
      <line x1="20" y1="61" x2="42" y2="61" className="stroke-stone-900" strokeWidth="2" />
      {/* Bottom avatar */}
      <circle cx="74" cy="56" r="7" className="fill-white stroke-stone-900" />
      <circle cx="74" cy="54" r="2.5" className="fill-stone-900" />
    </svg>
  );
}

export function IllustrationQuadrantMatrix() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Axes */}
      <line x1="16" y1="40" x2="84" y2="40" className="stroke-stone-900" />
      <line x1="50" y1="12" x2="50" y2="68" className="stroke-stone-900" />
      <line x1="16" y1="36" x2="16" y2="44" className="stroke-stone-900" />
      <line x1="84" y1="36" x2="84" y2="44" className="stroke-stone-900" />
      <line x1="46" y1="12" x2="54" y2="12" className="stroke-stone-900" />
      <line x1="46" y1="68" x2="54" y2="68" className="stroke-stone-900" />
      {/* Points */}
      <circle cx="34" cy="26" r="4.5" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <circle cx="68" cy="22" r="4.5" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <circle cx="28" cy="56" r="4.5" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <circle cx="72" cy="52" r="5" className="fill-amber-400 stroke-stone-900" strokeWidth="2.5" />
      <circle cx="58" cy="62" r="4.5" className="fill-white stroke-stone-900" strokeWidth="2.5" />
    </svg>
  );
}

export function IllustrationFlowchart() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Box 1 */}
      <rect x="12" y="14" width="28" height="18" rx="4" className="fill-white stroke-stone-900" />
      <line x1="18" y1="20" x2="32" y2="20" className="stroke-stone-900" strokeWidth="2" />
      <line x1="18" y1="26" x2="28" y2="26" className="stroke-stone-900" strokeWidth="2" />
      
      {/* Box 2 */}
      <rect x="60" y="14" width="28" height="20" rx="4" className="fill-white stroke-stone-900" />
      <line x1="60" y1="14" x2="74" y2="26" className="stroke-stone-900" strokeWidth="2" />
      <line x1="88" y1="14" x2="74" y2="26" className="stroke-stone-900" strokeWidth="2" />

      {/* Main output box */}
      <rect x="36" y="48" width="34" height="22" rx="4" className="fill-white stroke-stone-900" />
      <rect x="42" y="54" width="22" height="10" rx="2" className="fill-stone-900" />

      {/* Connector lines */}
      <path d="M40 23 L60 23" className="stroke-stone-900" strokeWidth="2" />
      <path d="M74 34 L74 44 L53 44 L53 48" className="stroke-stone-900" strokeWidth="2" />
    </svg>
  );
}

export function IllustrationGridTools() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* 4 tool icons in tiles */}
      {/* 1. Cursor */}
      <rect x="14" y="12" width="30" height="24" rx="5" className="fill-white stroke-stone-900" />
      <path d="M23 18 L23 29 L26 26 L30 30 L32 28 L28 24 L32 24 Z" className="fill-stone-900" />

      {/* 2. Lightning */}
      <rect x="56" y="12" width="30" height="24" rx="5" className="fill-white stroke-stone-900" />
      <path d="M72 16 L65 24 L70 24 L68 32 L77 23 L72 23 Z" className="fill-amber-400 stroke-stone-900" strokeWidth="1.5" />

      {/* 3. Toggle */}
      <rect x="14" y="44" width="30" height="24" rx="5" className="fill-white stroke-stone-900" />
      <rect x="19" y="52" width="20" height="8" rx="4" className="fill-white stroke-stone-900" strokeWidth="1.5" />
      <circle cx="23" cy="56" r="3" className="fill-stone-900" />

      {/* 4. Click Touch */}
      <rect x="56" y="44" width="30" height="24" rx="5" className="fill-white stroke-stone-900" />
      <path d="M68 50 L68 59 L71 61 L76 56 L72 54" className="stroke-stone-900" strokeWidth="2" />
    </svg>
  );
}

export function IllustrationSmartphoneTouch() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Phone */}
      <rect x="30" y="8" width="40" height="64" rx="8" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <line x1="44" y1="14" x2="56" y2="14" className="stroke-stone-900" strokeWidth="2" />
      <rect x="36" y="24" width="28" height="14" rx="4" className="fill-rose-300 stroke-stone-900" strokeWidth="2" />
      
      {/* Tapping Hand */}
      <path d="M50 31 L64 36 C66 37 68 40 68 42 L68 56 C68 60 64 64 60 64 L50 64" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <path d="M50 31 L42 27 C40 25 38 27 39 30 L45 42" className="fill-white stroke-stone-900" strokeWidth="2.5" />
    </svg>
  );
}

export function IllustrationClipboardChecklist() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Board */}
      <rect x="22" y="14" width="56" height="58" rx="7" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      {/* Top Clip */}
      <rect x="38" y="8" width="24" height="10" rx="3" className="fill-white stroke-stone-900" strokeWidth="2" />
      <circle cx="50" cy="11" r="2.5" className="fill-stone-900" />
      
      {/* Item 1 */}
      <circle cx="34" cy="32" r="3.5" className="stroke-stone-900 fill-white" strokeWidth="2" />
      <path d="M32 32 L34 34 L38 29" className="stroke-stone-900" strokeWidth="2" />
      <line x1="44" y1="32" x2="68" y2="32" className="stroke-stone-900" strokeWidth="2.5" />

      {/* Item 2 */}
      <circle cx="34" cy="46" r="3.5" className="stroke-stone-900 fill-white" strokeWidth="2" />
      <path d="M32 46 L34 48 L38 43" className="stroke-stone-900" strokeWidth="2" />
      <line x1="44" y1="46" x2="68" y2="46" className="stroke-stone-900" strokeWidth="2.5" />

      {/* Item 3 (Selected) */}
      <circle cx="34" cy="60" r="4" className="fill-rose-400 stroke-stone-900" strokeWidth="2" />
      <line x1="44" y1="60" x2="62" y2="60" className="stroke-stone-900" strokeWidth="2.5" />
    </svg>
  );
}

export function IllustrationWireframeWindow() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Browser Window */}
      <rect x="14" y="10" width="72" height="60" rx="6" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      {/* Window Dots */}
      <circle cx="23" cy="18" r="2" className="fill-stone-900" />
      <circle cx="30" cy="18" r="2" className="fill-stone-900" />
      <circle cx="37" cy="18" r="2" className="fill-stone-900" />
      <line x1="14" y1="24" x2="86" y2="24" className="stroke-stone-900" strokeWidth="1.5" />

      {/* Left Wireframe Box */}
      <rect x="20" y="30" width="28" height="32" rx="3" className="fill-white stroke-stone-900" strokeWidth="1.5" />
      <line x1="20" y1="30" x2="48" y2="62" className="stroke-stone-900" strokeWidth="1.5" />
      <line x1="48" y1="30" x2="20" y2="62" className="stroke-stone-900" strokeWidth="1.5" />

      {/* Right Wireframe lines */}
      <line x1="56" y1="34" x2="78" y2="34" className="stroke-stone-900" strokeWidth="2.5" />
      <line x1="56" y1="42" x2="74" y2="42" className="stroke-stone-900" strokeWidth="2" />
      <line x1="56" y1="50" x2="80" y2="50" className="stroke-stone-900" strokeWidth="2" />
      <line x1="56" y1="58" x2="70" y2="58" className="stroke-stone-900" strokeWidth="2" />
    </svg>
  );
}

export function IllustrationStickyNotes() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Note 1 Back Left */}
      <rect x="18" y="14" width="34" height="30" rx="3" className="fill-white stroke-stone-900" strokeWidth="2" />
      <line x1="24" y1="22" x2="44" y2="22" className="stroke-stone-900" strokeWidth="1.5" />
      <line x1="24" y1="28" x2="40" y2="28" className="stroke-stone-900" strokeWidth="1.5" />
      <line x1="24" y1="34" x2="36" y2="34" className="stroke-stone-900" strokeWidth="1.5" />

      {/* Note 2 Back Right */}
      <rect x="46" y="16" width="36" height="32" rx="3" className="fill-amber-300 stroke-stone-900" strokeWidth="2" />
      <line x1="52" y1="24" x2="74" y2="24" className="stroke-stone-900" strokeWidth="1.5" />
      <line x1="52" y1="30" x2="70" y2="30" className="stroke-stone-900" strokeWidth="1.5" />

      {/* Note 3 Foreground */}
      <rect x="30" y="32" width="38" height="34" rx="3" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <line x1="38" y1="42" x2="60" y2="42" className="stroke-stone-900" strokeWidth="2" />
      <line x1="38" y1="48" x2="56" y2="48" className="stroke-stone-900" strokeWidth="2" />
      <line x1="38" y1="54" x2="50" y2="54" className="stroke-stone-900" strokeWidth="2" />
    </svg>
  );
}

export function IllustrationThumbsSurvey() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Question mark header */}
      <circle cx="50" cy="22" r="7" className="fill-stone-900" />
      <text x="50" y="27" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">?</text>
      <line x1="32" y1="34" x2="68" y2="34" className="stroke-stone-900" strokeWidth="2" />

      {/* Thumbs Up */}
      <path d="M26 62 L26 48 L32 48 L37 42 C38 41 40 42 40 44 L40 50 L46 50 C48 50 49 52 49 54 L46 62 Z" className="fill-white stroke-stone-900" strokeWidth="2" />

      {/* Thumbs Down */}
      <path d="M74 46 L74 60 L68 60 L63 66 C62 67 60 66 60 64 L60 58 L54 58 C52 58 51 56 51 54 L54 46 Z" className="fill-white stroke-stone-900" strokeWidth="2" />
    </svg>
  );
}

export function IllustrationIdBadge() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Badge 1 */}
      <rect x="12" y="14" width="46" height="30" rx="4" className="fill-white stroke-stone-900" strokeWidth="2" />
      <circle cx="24" cy="26" r="6" className="fill-white stroke-stone-900" strokeWidth="1.5" />
      <line x1="36" y1="24" x2="50" y2="24" className="stroke-stone-900" strokeWidth="2" />
      <line x1="36" y1="30" x2="46" y2="30" className="stroke-stone-900" strokeWidth="1.5" />

      {/* Badge 2 */}
      <rect x="42" y="34" width="46" height="32" rx="4" className="fill-white stroke-stone-900" strokeWidth="2.5" />
      <circle cx="56" cy="48" r="6" className="fill-stone-900 stroke-stone-900" />
      <line x1="68" y1="46" x2="82" y2="46" className="stroke-stone-900" strokeWidth="2" />
      <line x1="68" y1="52" x2="78" y2="52" className="stroke-stone-900" strokeWidth="1.5" />
    </svg>
  );
}
