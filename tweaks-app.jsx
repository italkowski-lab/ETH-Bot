/* Tweaks island — applies live styling to the (vanilla) landing page. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4634CC",
  "headingFont": "Plus Jakarta Sans",
  "heroGrid": true,
  "demoFloat": true
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--head", `"${t.headingFont}", system-ui, sans-serif`);
    const grid = document.querySelector(".hero-grid");
    if (grid) grid.style.display = t.heroGrid ? "" : "none";
    const phone = document.querySelector(".demo-stage .phone");
    if (phone) phone.style.animationPlayState = t.demoFloat ? "running" : "paused";
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Marca" />
      <TweakColor
        label="Color de acento"
        value={t.accent}
        options={["#4634CC", "#2E63C4", "#6A2EA0", "#C9241D", "#0E9C8A"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSelect
        label="Tipografía de títulos"
        value={t.headingFont}
        options={["Plus Jakarta Sans", "Sora", "Manrope", "Space Grotesk"]}
        onChange={(v) => setTweak("headingFont", v)}
      />
      <TweakSection label="Animación" />
      <TweakToggle
        label="Cuadrícula del hero"
        value={t.heroGrid}
        onChange={(v) => setTweak("heroGrid", v)}
      />
      <TweakToggle
        label="Flotar la demo de chat"
        value={t.demoFloat}
        onChange={(v) => setTweak("demoFloat", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
