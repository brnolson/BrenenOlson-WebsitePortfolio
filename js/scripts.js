// Page chrome behaviors: FPS counter, scroll progress, slim topbar, active-nav
// highlighting, and a scramble-on-scroll effect for section headlines.

(function fps() {
  let frames = 0, last = performance.now();
  const tick = () => {
    frames++;
    const now = performance.now();
    if (now - last >= 500) {
      const rate = Math.round((frames * 1000) / (now - last));
      document.querySelectorAll(".hero-fps").forEach(el => el.textContent = rate);
      frames = 0; last = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

(function scrollChrome() {
  const progress = document.getElementById("scrollProgress");
  const topbar   = document.getElementById("topbar");
  const navLinks = document.querySelectorAll(".chrome-nav a");
  if (!progress || !topbar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const total = h.scrollHeight - h.clientHeight;
    const pct = Math.min(1, scrolled / (total || 1));
    progress.style.transform = `scaleX(${pct})`;
    topbar.classList.toggle("slim", scrolled > 60);

    const ids = ["about", "pin", "projects", "skills", "experience", "research", "contact"];
    let active = null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= 120 && r.bottom > 120) { active = id; break; }
    }
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + active));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function scramble() {
  const CHARS = "!@#$%^&*()_+=-[]{}|;:<>?/~`ABCDEF0123456789";
  const run = (el) => {
    const text = el.textContent;
    let frame = 0, raf;
    const q = [...text].map(ch => ({ ch, start: Math.floor(Math.random() * 18), end: Math.floor(Math.random() * 18) + 8 }));
    const step = () => {
      let out = "", done = 0;
      q.forEach(({ ch, start, end }) => {
        if (frame >= end) { done++; out += ch; }
        else if (frame >= start) out += CHARS[Math.floor(Math.random() * CHARS.length)];
        else out += " ";
      });
      el.textContent = out;
      if (done < q.length) { frame++; raf = requestAnimationFrame(step); }
    };
    step();
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.scrambled) {
        e.target.dataset.scrambled = "1";
        run(e.target);
      }
    });
  }, { threshold: 0.4 });

  // React renders section headlines async; attach the observer on a couple of
  // settle timers so we catch late mounts (projects/experience/etc.).
  const attach = () => {
    document.querySelectorAll(".section-head, .contact-big").forEach(el => io.observe(el));
  };
  setTimeout(attach, 400);
  setTimeout(attach, 1500);
})();
