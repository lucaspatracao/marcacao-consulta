(() => {
  const root = document.documentElement;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setFontScale(scale) {
    root.style.setProperty("--vitacare-font-scale", String(clamp(scale, 0.85, 1.4)));
  }

  function getFontScale() {
    const raw = getComputedStyle(root).getPropertyValue("--vitacare-font-scale").trim();
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  // Teclas rápidas (não intrusivas):
  // - Ctrl + '+' / '-' / '0' => escala de fonte
  // - Alt + H => alto contraste
  // - Alt + M => reduzir movimento
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setFontScale(getFontScale() + 0.05);
      } else if (e.key === "-") {
        e.preventDefault();
        setFontScale(getFontScale() - 0.05);
      } else if (e.key === "0") {
        e.preventDefault();
        setFontScale(1);
      }
    }

    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const k = (e.key || "").toLowerCase();
      if (k === "h") root.classList.toggle("vitacare-alto-contraste");
      if (k === "m") root.classList.toggle("vitacare-reduzir-movimento");
      if (k === "u") root.classList.toggle("vitacare-links-sublinhados");
    }
  });
})();
