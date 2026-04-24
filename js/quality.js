// Detect the user's device tier and motion preference, set globals that the
// Three.js components (hero-orb, pin-scene) read at startup. Loaded BEFORE those.

(function detectQuality() {
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;
  const fewCores = (navigator.hardwareConcurrency || 8) < 4;
  const deviceMemoryLow = (navigator.deviceMemory || 8) <= 4;

  // Save battery flag — Chrome exposes this asynchronously; the orb reads
  // the value cached here, so we default "high" on first paint.
  window.__QUALITY__ = (coarsePointer || narrow || fewCores || deviceMemoryLow) ? "low" : "high";

  // Respect the OS-level "Reduce motion" setting.
  window.__REDUCED_MOTION__ = matchMedia("(prefers-reduced-motion: reduce)").matches;
})();
