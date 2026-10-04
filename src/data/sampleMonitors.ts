/**
 * High-fidelity realistic medical monitor display SVGs rendered into data URIs.
 * Users can pick these presets for instant 1-click multimodal AI scanner testing,
 * or upload their own device photos!
 */

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

// 1. Blood Pressure Monitor (Omron style digital LCD cuff)
export const SAMPLE_BP_MONITOR = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d9f99d"/>
      <stop offset="100%" stop-color="#bef264"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Device Casing -->
  <rect x="50" y="40" width="500" height="420" rx="36" fill="url(#bodyGrad)" stroke="#94a3b8" stroke-width="3" filter="url(#shadow)"/>
  
  <!-- Brand Header -->
  <text x="90" y="85" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#334155" letter-spacing="2">CARDIOPULSE 900</text>
  <text x="440" y="85" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748b">INTELLISENSE</text>

  <!-- LCD Screen Bezel -->
  <rect x="80" y="110" width="440" height="260" rx="16" fill="#1e293b" stroke="#334155" stroke-width="4"/>
  <!-- LCD Green Display -->
  <rect x="90" y="120" width="420" height="240" rx="8" fill="url(#screenGrad)"/>

  <!-- LCD Grid Lines & Labels -->
  <text x="120" y="155" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#1c1917" letter-spacing="1">SYS mmHg</text>
  <text x="290" y="195" font-family="'JetBrains Mono', monospace, sans-serif" font-size="76" font-weight="900" fill="#0f172a" letter-spacing="3">134</text>

  <line x1="110" y1="215" x2="490" y2="215" stroke="#a3e635" stroke-width="2"/>

  <text x="120" y="245" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#1c1917" letter-spacing="1">DIA mmHg</text>
  <text x="290" y="280" font-family="'JetBrains Mono', monospace, sans-serif" font-size="70" font-weight="900" fill="#0f172a" letter-spacing="3">86</text>

  <line x1="110" y1="298" x2="490" y2="298" stroke="#a3e635" stroke-width="2"/>

  <text x="120" y="335" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#1c1917" letter-spacing="1">PULSE /min</text>
  <text x="350" y="342" font-family="'JetBrains Mono', monospace, sans-serif" font-size="52" font-weight="900" fill="#0f172a" letter-spacing="3">78</text>

  <!-- Small Heart Icon -->
  <path d="M 230 330 C 230 320, 215 315, 205 325 C 195 315, 180 320, 180 330 C 180 345, 205 355, 205 355 C 205 355, 230 345, 230 330 Z" fill="#0f172a"/>

  <!-- Physical Buttons -->
  <circle cx="160" cy="415" r="28" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
  <text x="145" y="420" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#475569">MEM</text>

  <rect x="250" y="390" width="180" height="50" rx="25" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="295" y="422" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="2">START / STOP</text>
</svg>
`);

// 2. Glucometer (Accu-Chek style digital blood glucose meter)
export const SAMPLE_GLUCOMETER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 600" width="450" height="600">
  <defs>
    <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="blueScreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Body -->
  <rect x="75" y="30" width="300" height="540" rx="60" fill="url(#meterGrad)" stroke="#334155" stroke-width="4"/>
  
  <!-- Test Strip Port Top -->
  <rect x="190" y="15" width="70" height="20" rx="4" fill="#0284c7"/>
  <rect x="210" y="10" width="30" height="35" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Screen Bezel -->
  <rect x="105" y="80" width="240" height="280" rx="24" fill="#000000" stroke="#475569" stroke-width="2"/>
  <rect x="115" y="90" width="220" height="260" rx="16" fill="url(#blueScreen)"/>

  <!-- Screen Details -->
  <text x="135" y="130" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#e0f2fe">GLUCOCHECK PRO</text>
  <text x="135" y="150" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#93c5fd">FASTING · 08:15 AM</text>

  <!-- Big Glucose Number -->
  <text x="130" y="270" font-family="'JetBrains Mono', monospace, sans-serif" font-size="108" font-weight="900" fill="#ffffff" letter-spacing="2">114</text>
  <text x="245" y="315" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#e0f2fe">mg/dL</text>

  <!-- Target Range Indicator Bar -->
  <rect x="135" y="330" width="180" height="8" rx="4" fill="#0c4a6e"/>
  <circle cx="215" cy="334" r="7" fill="#facc15" stroke="#ffffff" stroke-width="2"/>

  <!-- Physical Buttons -->
  <circle cx="170" cy="430" r="32" fill="#334155" stroke="#475569" stroke-width="2"/>
  <path d="M 170 415 L 160 435 L 180 435 Z" fill="#94a3b8"/>

  <circle cx="280" cy="430" r="32" fill="#334155" stroke="#475569" stroke-width="2"/>
  <path d="M 170 445 L 160 425 L 180 425 Z" fill="#94a3b8" transform="translate(110, 0) rotate(180 170 435)"/>

  <circle cx="225" cy="505" r="24" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
  <text x="217" y="511" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#ffffff">OK</text>
</svg>
`);

// 3. Fingertip Pulse Oximeter
export const SAMPLE_PULSE_OXIMETER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
  <defs>
    <linearGradient id="oxiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="oledGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- Oximeter Clip Casing -->
  <rect x="70" y="50" width="360" height="300" rx="50" fill="url(#oxiGrad)" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="390" y="160" width="50" height="80" rx="12" fill="#0284c7"/>

  <!-- OLED Screen -->
  <rect x="110" y="90" width="280" height="180" rx="16" fill="url(#oledGrad)" stroke="#1e293b" stroke-width="3"/>

  <!-- SpO2 Section -->
  <text x="135" y="130" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#38bdf8">%SpO2</text>
  <text x="135" y="215" font-family="'JetBrains Mono', monospace, sans-serif" font-size="82" font-weight="900" fill="#00f2fe">98</text>

  <!-- PR (Pulse Rate) Section -->
  <text x="290" y="130" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#f43f5e">PR bpm</text>
  <text x="290" y="215" font-family="'JetBrains Mono', monospace, sans-serif" font-size="78" font-weight="900" fill="#f43f5e">72</text>

  <!-- Pleth Waveform -->
  <path d="M 125 245 Q 145 235 155 245 T 175 245 T 195 220 L 205 255 L 215 245 T 240 245 T 265 245 T 285 220 L 295 255 L 305 245 T 330 245 T 355 245 T 375 220 L 385 255" fill="none" stroke="#eab308" stroke-width="3"/>

  <!-- Button -->
  <circle cx="250" cy="305" r="18" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
</svg>
`);

// 4. Digital Clinical Thermometer
export const SAMPLE_THERMOMETER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 300" width="650" height="300">
  <defs>
    <linearGradient id="probeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>

  <!-- Metallic Sensor Tip -->
  <rect x="40" y="135" width="80" height="30" rx="15" fill="url(#probeGrad)"/>
  
  <!-- Main Handle Body -->
  <path d="M 110 135 L 560 110 C 600 110, 610 190, 560 190 L 110 165 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>

  <!-- LCD Screen -->
  <rect x="260" y="125" width="180" height="50" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
  <text x="275" y="162" font-family="'JetBrains Mono', monospace, sans-serif" font-size="34" font-weight="900" fill="#0f172a" letter-spacing="2">98.6</text>
  <text x="390" y="152" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#0f172a">°F</text>

  <!-- Power Button -->
  <circle cx="485" cy="150" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <path d="M 485 142 L 485 150 M 480 146 A 6 6 0 1 0 490 146" fill="none" stroke="#ffffff" stroke-width="2"/>
</svg>
`);
