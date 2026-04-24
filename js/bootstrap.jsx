/* global React, ReactDOM */
// NOTE: this file is JSX source. If you edit it, re-run `node compile.cjs`
// to regenerate js/bootstrap.js — the browser loads the compiled .js directly.
//
// Mounts every React section into its placeholder div in index.html.

(function bootstrap() {
  const mount = (id, Component) => {
    const el = document.getElementById(id);
    if (!el || !Component) return;
    ReactDOM.createRoot(el).render(<Component />);
  };

  mount("heroMount",     window.HeroOrb);
  mount("aboutMount",    window.About);
  mount("pinMount",      window.PinSection);
  mount("projectsMount", window.Projects);
  mount("skillsMount",   window.Skills);
  mount("xpMount",       window.Experience);
  mount("researchMount", window.Research);
  mount("contactMount",  window.Contact);
  mount("konamiMount",   window.Konami);
})();
