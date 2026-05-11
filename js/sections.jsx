/* global React */
// All page sections. Data is read from window.PROJECTS, window.EXPERIENCE, window.SKILLS
// which are defined in js/data.js — edit that file to add entries.

// ---------- ABOUT ----------
window.About = () => (
  <section className="about" id="about" data-screen-label="about">
    <div className="about-portrait">
      <div className="about-portrait-frame">
        <img src="assets/Headshot.jpeg" alt="Brenen Olson" />
      </div>
      <div className="about-portrait-meta">
        <div>Location<span>Minneapolis, MN</span></div>
        <div>Degree<span>B.S. Computer Science</span></div>
        <div>GPA<span>3.809 / 4.000</span></div>
        <div>Dean's List<span>5× semesters</span></div>
      </div>
    </div>
    <div className="about-body">
      <div className="section-label"><span className="section-num">01</span> about</div>
      <p className="about-statement">
        I'm a <em>graphics engineer</em> and <em>full-stack developer</em> with
        a B.S. in Computer Science from UMN. I write <em className="med">real-time shaders</em>,
        build physics simulators, and ship production software — the whole pipeline
        from GPU to product, built by one person.
      </p>
      <div className="about-cards">
        <div className="about-card"><div className="about-card-k">Core</div><div className="about-card-v">Real-time graphics</div><div className="about-card-note">GLSL, Unreal 5, Three.js, rigid-body physics.</div></div>
        <div className="about-card"><div className="about-card-k">Also</div><div className="about-card-v">Full-stack product</div><div className="about-card-note">Vue 3, Blazor, Supabase, Cloudflare — shipped.</div></div>
        <div className="about-card"><div className="about-card-k">Research</div><div className="about-card-v">6-DoF simulation</div><div className="about-card-note">Cable-driven spacecraft motion sim w/ Cornell.</div></div>
        <div className="about-card"><div className="about-card-k">Approach</div><div className="about-card-v">End-to-end</div><div className="about-card-note">Shader to UI, firmware to cloud — no handoffs.</div></div>
      </div>
    </div>
  </section>
);

// ---------- PINNED SCROLL ----------
window.PinSection = () => {
  const wrapRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0); // 0..4
  const [chapter, setChapter] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const total = wrapRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = (scrolled / total) * 4; // four chapters → 0..4
      setProgress(p);
      setChapter(Math.min(3, Math.max(0, Math.round(p))));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chapters = [
    {
      title: "Approach",
      headline: "Two meters. Six micrometers.",
      sub: "Every cell in your body holds two meters of DNA, coiled into a nucleus smaller than a grain of sand. What you're approaching is a single fragment — less than a millionth of the full strand.",
    },
    {
      title: "Backbone",
      headline: "The outer rails.",
      sub: "Two sugar-phosphate spines, linked by phosphodiester bonds, form the outer rails of the ladder. The sequence of bases — A, T, G, C — hangs inward, readable only through the major groove.",
    },
    {
      title: "Helix",
      headline: "Right-handed. Antiparallel.",
      sub: "10.4 base pairs per full twist. One strand runs 5′ to 3′; the other runs 3′ to 5′ in the opposite direction. The twist carves two grooves — major and minor — that proteins land on to read or regulate the code.",
    },
    {
      title: "Structure",
      headline: "Four letters. Infinite sequences.",
      sub: "A pairs with T by two hydrogen bonds; G pairs with C by three. The extra bond in G·C makes those pairs more thermally stable — a fact evolution has written into every promoter, every regulatory switch.",
    },
  ];

  return (
    <section className="pin-wrap" ref={wrapRef} id="pin" data-screen-label="pinned-scroll">
      <div className="pin-sticky">
        <div className="pin-3d">
          <window.PinScene progress={progress} />
          <window.PinLabels />
        </div>
        <div className="pin-overlay">
          <div className="pin-header">
            <div className="pin-title-block">
              <div className="pin-counter"><span className="idx">0{chapter + 1}</span>/04 · graphics demo · scroll-driven</div>
              <h2 className="pin-headline">{chapters[chapter].headline}</h2>
              <p className="pin-sub">{chapters[chapter].sub}</p>
            </div>
            <div className="pin-chapter-rail">
              {chapters.map((c, i) => (
                <div key={c.title} className={`pin-chapter ${i === chapter ? "active" : ""}`}>
                  <span className="pin-chapter-line" />{c.title}
                </div>
              ))}
            </div>
          </div>
          <div className="pin-footer">
            <div className="pin-tag">approach → backbone → helix → structure</div>
            <div className="pin-progress-bar" style={{ "--p": `${(progress / 4) * 100}%` }} />
            <div className="pin-tag">{Math.round((progress / 4) * 100)}%</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- PROJECTS ----------
window.Projects = () => {
  const [filter, setFilter] = React.useState("all");
  const [openId, setOpenId] = React.useState(null);
  const PROJECTS = window.PROJECTS || [];
  const shown = PROJECTS.filter(p => filter === "all" || p.status === filter);
  const featured = shown.filter(p => p.featured);
  const rest = shown.filter(p => !p.featured);
  const openProject = PROJECTS.find(p => p.id === openId);

  React.useEffect(() => {
    if (!openId) return;
    const onKey = (e) => { if (e.key === "Escape") setOpenId(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [openId]);

  return (
    <section className="projects" id="projects" data-screen-label="projects">
      <div className="projects-head">
        <div>
          <div className="section-label"><span className="section-num">03</span> selected work</div>
          <h2 className="section-head">Projects shipped,<br/>simulated, and built.</h2>
          <p className="section-sub">Shipped products, graphics work, and personal builds. Click any card for the details.</p>
        </div>
        <div className="projects-filter">
          {[["all", "all"], ["live", "shipping"], ["fun", "graphics + personal"]].map(([k, label]) => (
            <button key={k} className={`filter-btn ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{label}</button>
          ))}
        </div>
      </div>

      {featured.length > 0 && (
        <div className="featured">
          {featured.slice(0, 2).map((p, i) => <ProjectCard key={p.id} p={p} tall={i === 0 && featured.length > 1} onOpen={setOpenId} />)}
        </div>
      )}
      <div className="project-grid">
        {rest.map(p => <ProjectCard key={p.id} p={p} onOpen={setOpenId} />)}
      </div>

      {openProject && <ProjectModal p={openProject} onClose={() => setOpenId(null)} />}
    </section>
  );
};

const ProjectCard = ({ p, tall, onOpen }) => (
  <div className={`project-card ${tall ? "tall" : ""}`} onClick={() => onOpen(p.id)}>
    <div className="project-media">
      {p.img ? <img src={p.img} alt={p.title} /> : <PlaceholderGraphic id={p.id} />}
      {p.badge && <div className="project-badge">{p.badge}</div>}
      {p.status === "live" && <div className="project-shipping live">Live</div>}
      <div className="project-open-hint">view case study <span>→</span></div>
    </div>
    <div className="project-body">
      <div>
        <div className="project-tag">{p.tag}</div>
        <h3 className="project-title">{p.title}</h3>
        {p.subtitle && <div className="project-subtitle">{p.subtitle}</div>}
      </div>
      <p className="project-desc">{p.desc}</p>
      <div className="project-stack-row">
        {p.stack.flatMap(g => g.items).slice(0, 5).map((s, i) => (
          <span key={s + i} className="project-chip">{s}</span>
        ))}
        {p.stack.flatMap(g => g.items).length > 5 && (
          <span className="project-chip more">+{p.stack.flatMap(g => g.items).length - 5}</span>
        )}
      </div>
      {p.links && p.links.length > 0 && (
        <div className="project-card-links" onClick={e => e.stopPropagation()}>
          {p.links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="project-card-link">
              {l.label === "github" ? "↗ github" : `↗ ${l.label}`}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ProjectModal = ({ p, onClose }) => (
  <div className="pm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="pm-dialog">
      <div className="pm-hero">
        {p.hero ? <img src={p.hero} alt={p.title} /> : <PlaceholderGraphic id={p.id} />}
        <div className="pm-hero-scrim" />
        <div className="pm-hero-badge">{p.tag}</div>
        <button className="pm-close" onClick={onClose} aria-label="close">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="pm-body">
        <div className="pm-header">
          <div>
            <h3 className="pm-title">{p.title}</h3>
            {p.subtitle && <div className="pm-subtitle">{p.subtitle}</div>}
          </div>
          {p.status === "live" && <div className="pm-status live"><span />Live in production</div>}
        </div>

        <div className="pm-meta">
          <div><div className="pm-meta-k">Year</div><div className="pm-meta-v">{p.year}</div></div>
          <div><div className="pm-meta-k">Role</div><div className="pm-meta-v">{p.role}</div></div>
          <div><div className="pm-meta-k">Scale</div><div className="pm-meta-v">{p.scale}</div></div>
        </div>

        <p className="pm-desc">{p.desc}</p>

        <div className="pm-section-title">// what I built</div>
        <ul className="pm-bullets">
          {p.long.map((l, i) => <li key={i}>{l}</li>)}
        </ul>

        <div className="pm-section-title">// stack</div>
        <div className="pm-stack-grid">
          {p.stack.map(g => (
            <div key={g.cat} className="pm-stack-col">
              <div className="pm-stack-cat">{g.cat}</div>
              <div className="pm-stack-items">
                {g.items.map(s => <span key={s} className="pm-chip">{s}</span>)}
              </div>
            </div>
          ))}
        </div>

        {p.links && p.links.length > 0 && (
          <div className="pm-links">
            {p.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="pm-link">
                {l.label} <span>↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const PlaceholderGraphic = ({ id }) => {
  const hue = (id.charCodeAt(0) * 17) % 360;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue}, 70%, 30%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 60) % 360}, 70%, 20%)`} />
        </linearGradient>
        <pattern id={`s-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 20L20 0" stroke={`hsl(${hue}, 80%, 60%)`} strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#g-${id})`} />
      <rect width="400" height="250" fill={`url(#s-${id})`} />
      <text x="20" y="235" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.4)" letterSpacing="2">{id.toUpperCase()}.PREVIEW</text>
    </svg>
  );
};

// ---------- INTERACTIVE GRAPHICS DEMO — BOIDS FLOCKING ----------
// A real-time Reynolds flocking simulation (1987), running in your browser.
// Each boid obeys three steering rules: separation (avoid crowding), alignment
// (match neighbor heading), cohesion (move toward neighbor centroid). Cursor
// acts as a predator — boids flee from it. Click to scatter the flock.
//
// This is the "skills demo": a classical graphics algorithm built from scratch,
// rendered with Canvas2D + additive-style glow + velocity-based color ramps.
window.BoidsGame = () => {
  const canvasRef = React.useRef(null);
  const [scatters, setScatters] = React.useState(0);
  const [population, setPopulation] = React.useState(0);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const LOW = (typeof window !== "undefined" && window.__QUALITY__ === "low");

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = c.clientWidth * dpr();
      c.height = c.clientHeight * dpr();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr(), dpr());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const W = () => c.clientWidth, H = () => c.clientHeight;

    // --- Boid population ---
    const BOID_COUNT = LOW ? 90 : 180;
    setPopulation(BOID_COUNT);
    const boids = [];
    for (let i = 0; i < BOID_COUNT; i++) {
      boids.push({
        x: Math.random() * W(), y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hue: Math.random(), // 0..1 → cyan→magenta color ramp
      });
    }

    // --- Interaction state ---
    const mouse = { x: -1e6, y: -1e6 };
    const onMove = (e) => {
      const rect = c.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -1e6; };
    const onClick = (e) => {
      const rect = c.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      // Shockwave scatter — radial push from click point
      for (const b of boids) {
        const dx = b.x - cx, dy = b.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < 320) {
          const force = (1 - d / 320) * 14;
          b.vx += (dx / (d || 1)) * force;
          b.vy += (dy / (d || 1)) * force;
        }
      }
      setScatters(s => s + 1);
    };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    c.addEventListener("click", onClick);

    // --- Tunables (TWEAK ME if you want different flocking behavior) ---
    const VIEW_R      = 50;   // radius within which neighbors count
    const SEP_R       = 20;   // personal space
    const MAX_V       = 3.2;  // speed cap
    const FLEE_R      = 90;   // cursor-avoidance radius
    const ALIGN_W     = 0.06; // alignment weight
    const COHESION_W  = 0.003;
    const SEP_W       = 0.15;
    const FLEE_W      = 5;    // strength when fleeing predator (cursor)

    let raf;
    const loop = () => {
      const w = W(), h = H();

      // --- Trail-friendly fade (alpha-dim instead of clear) ---
      ctx.fillStyle = "rgba(5, 6, 10, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // --- Flocking update (O(N²); fine at 180) ---
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let ax = 0, ay = 0;       // accumulated neighbor velocity
        let cxs = 0, cys = 0;     // accumulated neighbor position
        let sepX = 0, sepY = 0;   // separation accumulator
        let nCount = 0, sCount = 0;

        for (let j = 0; j < boids.length; j++) {
          if (j === i) continue;
          const o = boids[j];
          const dx = o.x - b.x, dy = o.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < VIEW_R * VIEW_R) {
            ax += o.vx; ay += o.vy;
            cxs += o.x; cys += o.y;
            nCount++;
            if (d2 < SEP_R * SEP_R) {
              const d = Math.sqrt(d2) || 1;
              sepX -= dx / d; sepY -= dy / d;
              sCount++;
            }
          }
        }
        if (nCount > 0) {
          ax /= nCount; ay /= nCount;
          cxs /= nCount; cys /= nCount;
          // Alignment
          b.vx += (ax - b.vx) * ALIGN_W;
          b.vy += (ay - b.vy) * ALIGN_W;
          // Cohesion
          b.vx += (cxs - b.x) * COHESION_W;
          b.vy += (cys - b.y) * COHESION_W;
        }
        if (sCount > 0) {
          b.vx += sepX * SEP_W;
          b.vy += sepY * SEP_W;
        }

        // Flee the cursor (predator)
        const mdx = b.x - mouse.x, mdy = b.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < FLEE_R) {
          const force = (1 - md / FLEE_R) * FLEE_W;
          b.vx += (mdx / (md || 1)) * force;
          b.vy += (mdy / (md || 1)) * force;
        }

        // Cap speed
        const v = Math.hypot(b.vx, b.vy);
        if (v > MAX_V) { b.vx = (b.vx / v) * MAX_V; b.vy = (b.vy / v) * MAX_V; }

        // Integrate
        b.x += b.vx; b.y += b.vy;

        // Wrap edges
        if (b.x < -10) b.x = w + 10;
        else if (b.x > w + 10) b.x = -10;
        if (b.y < -10) b.y = h + 10;
        else if (b.y > h + 10) b.y = -10;
      }

      // --- Draw each boid as an oriented triangle with velocity-tinted glow ---
      for (const b of boids) {
        const angle = Math.atan2(b.vy, b.vx);
        const speed = Math.hypot(b.vx, b.vy);
        const speedN = Math.min(1, speed / MAX_V);
        // Color ramp: cyan (#5eb5ff) → magenta (#e879f9) driven by hue + speed
        const t = (b.hue + speedN * 0.5) % 1;
        const r = Math.round(94 + (232 - 94) * t);
        const g = Math.round(181 + (121 - 181) * t);
        const bC = Math.round(255 - 6 * t);
        const size = 4 + speedN * 3;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.shadowColor = `rgb(${r},${g},${bC})`;
        ctx.shadowBlur = 6 + speedN * 8;
        ctx.fillStyle = `rgba(${r},${g},${bC},0.95)`;
        ctx.beginPath();
        ctx.moveTo(size * 1.4, 0);
        ctx.lineTo(-size * 0.9, size * 0.7);
        ctx.lineTo(-size * 0.9, -size * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur = 0;

      // --- Subtle cursor indicator (predator) ---
      if (mouse.x > -1000) {
        ctx.strokeStyle = "rgba(232, 121, 249, 0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, FLEE_R, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      c.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="pipeline-viz">
      <canvas ref={canvasRef} className="pipeline-canvas boids-canvas" />
      <div className="pipeline-detail open">
        <div className="pipeline-detail-head">
          <div className="pipeline-detail-id" style={{ color: "var(--cyan)", borderColor: "var(--cyan)" }}>BOIDS · 1987</div>
          <div className="pipeline-detail-title">Reynolds flocking, live</div>
        </div>
        <div className="pipeline-detail-desc">
          Three rules — separation, alignment, cohesion — produce emergent group behavior. Every frame: O(N²) neighbor query, three steering forces, speed cap, toroidal wrap. <strong style={{ color: "var(--ink)" }}>{population}</strong> agents, zero dependencies.
        </div>
        <div className="pipeline-detail-body">
          <span style={{ color: "var(--violet)" }}>↳</span> Move your cursor through the flock — boids flee a predator radius. <span style={{ color: "var(--violet)" }}>↳</span> Click to fire a radial shockwave. <span style={{ color: "var(--ink-dim)" }}>scatters:</span> <strong>{scatters}</strong>
        </div>
      </div>
    </div>
  );
};

// Alias the old names so any stale references keep working
window.PipelineViz = window.BoidsGame;
window.SkillConstellation = window.BoidsGame;

// (legacy pipeline viz below — unused; kept so nothing silently breaks)
window.OldPipelineViz = () => {
  const canvasRef = React.useRef(null);
  const [pinnedId, setPinnedId] = React.useState(null);
  const [hoverId, setHoverId] = React.useState(null);

  const STAGES = (window.PIPELINE || []);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const W = () => c.clientWidth, H = () => c.clientHeight;

    // Lay nodes out as a horizontal pipeline, evenly spaced
    const nodeAt = (i) => {
      const w = W(), h = H();
      const margin = 40;
      const usable = w - margin * 2;
      const x = margin + (usable * (STAGES.length === 1 ? 0.5 : i / (STAGES.length - 1)));
      const y = h * 0.5;
      return { x, y };
    };

    // Particles flowing from stage to stage
    const particles = [];
    const spawnParticle = () => {
      particles.push({
        stage: 0,
        t: 0,
        speed: 0.35 + Math.random() * 0.4, // how fast it crosses one stage
        color: STAGES[0] ? STAGES[0].color : "#a78bfa",
      });
    };
    let lastSpawn = 0;

    // Mouse tracking
    const mouse = { x: -1e6, y: -1e6 };
    let hoveredIdx = -1;
    const onMove = (e) => {
      const rect = c.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -1e6; };
    const onClick = () => {
      if (hoveredIdx >= 0) {
        const id = STAGES[hoveredIdx].id;
        setPinnedId((prev) => (prev === id ? null : id));
      }
    };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    c.addEventListener("click", onClick);

    // --- Stage icon renderers — drawn inside the node. Each icon is a small
    // 20x20-ish canvas drawing that evokes its stage visually. ---
    const drawIcon = (x, y, type, color, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.4;
      if (type === "points") {
        // triangle of 3 points
        const r = 3;
        [[-7,-4],[7,-4],[0,7]].forEach(([px,py]) => {
          ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill();
        });
      } else if (type === "matrix") {
        // 3x3 grid of dots
        for (let ix=-1;ix<=1;ix++) for (let iy=-1;iy<=1;iy++) {
          ctx.beginPath(); ctx.arc(ix*6, iy*6, 1.8, 0, Math.PI*2); ctx.fill();
        }
      } else if (type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(-9, 7); ctx.lineTo(9, 7); ctx.lineTo(0, -9); ctx.closePath();
        ctx.stroke();
      } else if (type === "grid") {
        // 4x4 pixel grid
        const s = 3, off = -6;
        for (let ix=0;ix<4;ix++) for (let iy=0;iy<4;iy++) {
          if ((ix+iy)%2===0) { ctx.globalAlpha = alpha * 0.85; ctx.fillRect(off+ix*s, off+iy*s, s-0.5, s-0.5); }
        }
        ctx.globalAlpha = alpha;
      } else if (type === "shade") {
        // gradient-filled circle (lighting)
        const g = ctx.createRadialGradient(-3, -3, 1, 0, 0, 9);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(1, color);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
      } else if (type === "screen") {
        // rectangle with a diagonal scanline — "framebuffer"
        ctx.strokeRect(-9, -6, 18, 12);
        ctx.beginPath(); ctx.moveTo(-9, 6); ctx.lineTo(9, -6); ctx.stroke();
      }
      ctx.restore();
    };

    let raf;
    const loop = (now) => {
      const w = W(), h = H();
      const dt = 1 / 60;

      // Spawn particles on a rolling cadence
      if (now - lastSpawn > 420) {
        spawnParticle();
        lastSpawn = now;
      }

      // Advance particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.stage++;
          p.t = 0;
          if (p.stage >= STAGES.length - 1) { particles.splice(i, 1); continue; }
          p.color = STAGES[p.stage].color;
        }
      }

      // Hover detection
      let nextHovered = -1;
      for (let i = 0; i < STAGES.length; i++) {
        const n = nodeAt(i);
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        if (dx*dx + dy*dy < 38 * 38) { nextHovered = i; break; }
      }
      if (nextHovered !== hoveredIdx) {
        hoveredIdx = nextHovered;
        setHoverId(nextHovered >= 0 ? STAGES[nextHovered].id : null);
      }

      // --- DRAW ---
      ctx.clearRect(0, 0, w, h);

      // Flow lines between stages
      ctx.lineWidth = 1;
      for (let i = 0; i < STAGES.length - 1; i++) {
        const a = nodeAt(i), b = nodeAt(i + 1);
        const g = ctx.createLinearGradient(a.x, 0, b.x, 0);
        g.addColorStop(0, STAGES[i].color + "66");
        g.addColorStop(1, STAGES[i + 1].color + "66");
        ctx.strokeStyle = g;
        ctx.beginPath(); ctx.moveTo(a.x + 38, a.y); ctx.lineTo(b.x - 38, b.y); ctx.stroke();
        // Arrowhead
        ctx.fillStyle = STAGES[i + 1].color;
        ctx.beginPath();
        ctx.moveTo(b.x - 38, b.y);
        ctx.lineTo(b.x - 44, b.y - 4);
        ctx.lineTo(b.x - 44, b.y + 4);
        ctx.closePath(); ctx.fill();
      }

      // Flowing particles along each segment
      for (const p of particles) {
        if (p.stage >= STAGES.length - 1) continue;
        const a = nodeAt(p.stage), b = nodeAt(p.stage + 1);
        const x = a.x + 38 + (b.x - 38 - (a.x + 38)) * p.t;
        const y = a.y;
        // trail
        const tailX = a.x + 38 + (b.x - 38 - (a.x + 38)) * Math.max(0, p.t - 0.18);
        const tg = ctx.createLinearGradient(tailX, y, x, y);
        tg.addColorStop(0, "rgba(255,255,255,0)");
        tg.addColorStop(1, p.color);
        ctx.strokeStyle = tg; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(tailX, y); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Stage nodes
      for (let i = 0; i < STAGES.length; i++) {
        const n = nodeAt(i);
        const stage = STAGES[i];
        const isHover  = i === hoveredIdx;
        const isPinned = stage.id === pinnedId;
        const isDimmed = pinnedId && !isPinned;
        const alpha = isDimmed ? 0.3 : 1;

        const baseR = 30;
        const r = baseR + (isHover || isPinned ? 6 : 0);

        // outer glow ring
        ctx.save();
        ctx.globalAlpha = alpha * (isHover || isPinned ? 0.9 : 0.6);
        ctx.shadowColor = stage.color; ctx.shadowBlur = isHover || isPinned ? 26 : 14;
        ctx.strokeStyle = stage.color; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
        // fill disc (darker)
        ctx.globalAlpha = alpha * 0.18;
        ctx.fillStyle = stage.color;
        ctx.beginPath(); ctx.arc(n.x, n.y, r - 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // icon
        drawIcon(n.x, n.y, stage.icon, stage.color, alpha);

        // stage number
        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = "rgba(231,233,255,0.6)";
        ctx.font = "700 10px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(i + 1).padStart(2, "0"), n.x, n.y - r - 10);
        // stage label
        ctx.fillStyle = isHover || isPinned ? "#ffffff" : "rgba(231,233,255,0.82)";
        ctx.font = `${isHover || isPinned ? 600 : 500} 11px JetBrains Mono, monospace`;
        ctx.fillText(stage.name, n.x, n.y + r + 16);
        ctx.globalAlpha = 1;
        ctx.textAlign = "start";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      c.removeEventListener("click", onClick);
    };
  }, []);

  const focusStage = STAGES.find(s => s.id === (pinnedId || hoverId));

  return (
    <div className="pipeline-viz">
      <canvas ref={canvasRef} className="pipeline-canvas" />
      <div className={`pipeline-detail ${focusStage ? "open" : ""}`}>
        {focusStage ? (
          <>
            <div className="pipeline-detail-head">
              <div className="pipeline-detail-id" style={{ color: focusStage.color, borderColor: focusStage.color }}>
                STAGE {String(STAGES.findIndex(s => s.id === focusStage.id) + 1).padStart(2, "0")}
              </div>
              <div className="pipeline-detail-title">{focusStage.name}</div>
              {pinnedId === focusStage.id && (
                <button className="pipeline-detail-close" onClick={() => setPinnedId(null)}>unpin</button>
              )}
            </div>
            <div className="pipeline-detail-desc">{focusStage.desc}</div>
            {pinnedId === focusStage.id && (
              <>
                <div className="pipeline-detail-body">{focusStage.detail}</div>
                <div className="pipeline-detail-skills">
                  {(focusStage.mySkills || []).map(s => (
                    <span key={s} className="pipeline-skill-chip" style={{ borderColor: focusStage.color, color: focusStage.color }}>{s}</span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="pipeline-detail-hint">[ hover a stage · click to pin ]</div>
        )}
      </div>
    </div>
  );
};

// Backwards-compat alias — anything still referencing SkillConstellation renders the pipeline.
window.SkillConstellation = window.PipelineViz;

// (legacy SkillConstellation follows below for reference but is overridden above)
window.OldSkillConstellation = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const CATS = (window.SKILLS && window.SKILLS.categories) || [];
    const CONNS = (window.SKILLS && window.SKILLS.connections) || [];
    const GROUPS = (window.SKILLS && window.SKILLS.groups) || [];
    const W = () => c.clientWidth, H = () => c.clientHeight;

    // Derive a skill level (0..100) by fuzzy-matching the node name against
    // the entries in SKILLS.groups. Falls back to 75 if no match found.
    const levelFor = (name) => {
      for (const g of GROUPS) {
        for (const [k, lvl] of g.items) {
          if (k.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(k.toLowerCase().split(/[\s/]+/)[0])) {
            return lvl;
          }
        }
      }
      return 75;
    };

    // Build nodes — each category laid out on a ring, skills orbiting its center.
    const nodes = [];
    CATS.forEach((cat, ci) => {
      const ang0 = (ci / CATS.length) * Math.PI * 2 - Math.PI / 2;
      cat.skills.forEach((s, i) => {
        const ringAng = (i / cat.skills.length) * Math.PI * 2 + ci * 0.4;
        nodes.push({
          id: nodes.length,
          name: s,
          cat: ci,
          color: cat.color,
          level: levelFor(s),
          // Home position in normalized (0..1) coordinates — recomputed on resize
          hx: 0.5 + Math.cos(ang0) * 0.28 + Math.cos(ringAng) * 0.11,
          hy: 0.5 + Math.sin(ang0) * 0.28 + Math.sin(ringAng) * 0.11,
          x: 0, y: 0,  // pixel-space (resolved from hx/hy each frame)
          energy: 0,   // 0..1 activation — spikes when a pulse arrives or on hover
          phase: Math.random() * Math.PI * 2, // for per-node breathing offset
        });
      });
    });

    // Node lookup by name (case-insensitive)
    const nodeByName = {};
    nodes.forEach(n => { nodeByName[n.name.toLowerCase()] = n; });

    // Build edges: same-category + explicit cross-category pairs
    const edges = [];
    const edgeSet = new Set();
    const addEdge = (a, b, cross = false) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (edgeSet.has(k)) return;
      edgeSet.add(k);
      edges.push({ a, b, cross });
    };
    // Intra-category
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].cat === nodes[j].cat) addEdge(i, j, false);
      }
    }
    // Cross-category
    CONNS.forEach(([n1, n2]) => {
      const a = nodeByName[n1.toLowerCase()];
      const b = nodeByName[n2.toLowerCase()];
      if (a && b) addEdge(a.id, b.id, a.cat !== b.cat);
    });

    // Adjacency lookup — neighbors[i] = array of node ids connected to i
    const neighbors = nodes.map(() => []);
    edges.forEach(({ a, b }) => { neighbors[a].push(b); neighbors[b].push(a); });

    // Pulses — light particles traveling from->to along an edge, fading over time.
    const pulses = [];
    const firePulse = (from, to, strength = 1) => {
      pulses.push({ from, to, t: 0, life: 0.9, strength, color: nodes[from].color });
    };
    const fireBurst = (idx, strength = 1) => {
      nodes[idx].energy = Math.min(1, nodes[idx].energy + 0.6 * strength);
      neighbors[idx].forEach(ni => firePulse(idx, ni, strength));
    };

    // Mouse / hover / pin state
    const mouse = { x: -1e6, y: -1e6 };
    let hovered = -1;
    let pinned  = -1;
    let lastHoverFire = 0;
    const onMove = (e) => {
      const rect = c.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -1e6; };
    const onClick = () => { pinned = (pinned === hovered) ? -1 : hovered; };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    c.addEventListener("click", onClick);

    // Auto-fire scheduler
    let nextAutoFire = performance.now() + 1500;

    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = W(), h = H();

      // Resolve home positions to pixel coords
      nodes.forEach(n => { n.x = n.hx * w; n.y = n.hy * h; });

      // Hover detection — pick nearest node within 24px
      let bestDist = 24 * 24, bestIdx = -1;
      for (let i = 0; i < nodes.length; i++) {
        const dx = mouse.x - nodes[i].x, dy = mouse.y - nodes[i].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist) { bestDist = d2; bestIdx = i; }
      }
      hovered = bestIdx;

      // On-hover: fire pulses at most every 220ms (so it throbs, doesn't flood)
      if (hovered >= 0 && now - lastHoverFire > 220) {
        fireBurst(hovered, 1);
        lastHoverFire = now;
      }

      // Auto-fire: pick a random node and burst from it
      if (now > nextAutoFire) {
        const idx = Math.floor(Math.random() * nodes.length);
        fireBurst(idx, 0.6);
        nextAutoFire = now + 1400 + Math.random() * 1500;
      }

      // Decay energy
      nodes.forEach(n => { n.energy = Math.max(0, n.energy - dt * 1.1); });

      // Dim factor — non-pinned, non-neighbors of pinned node are dimmed
      const pinnedNeighbors = pinned >= 0 ? new Set([pinned, ...neighbors[pinned]]) : null;
      const dimOf = (i) => (pinned < 0 || (pinnedNeighbors && pinnedNeighbors.has(i))) ? 1 : 0.22;

      // --- DRAW ---
      ctx.clearRect(0, 0, w, h);

      // Edges (base layer) — cross-category slightly brighter than intra
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const dimA = dimOf(e.a), dimB = dimOf(e.b);
        const dim = Math.min(dimA, dimB);
        const alpha = (e.cross ? 0.22 : 0.13) * dim;
        ctx.strokeStyle = e.cross ? `rgba(231, 233, 255, ${alpha})` : `rgba(167, 139, 250, ${alpha})`;
        ctx.lineWidth = e.cross ? 0.9 : 0.55;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // Pulses — update position, render a short bright trail along the edge
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const p = pulses[pi];
        p.t += dt / p.life;
        if (p.t >= 1) {
          // Arrived at target → briefly energize it
          nodes[p.to].energy = Math.min(1, nodes[p.to].energy + 0.35 * p.strength);
          pulses.splice(pi, 1);
          continue;
        }
        const a = nodes[p.from], b = nodes[p.to];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        // Trail
        const tailT = Math.max(0, p.t - 0.15);
        const tx = a.x + (b.x - a.x) * tailT;
        const ty = a.y + (b.y - a.y) * tailT;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, p.color);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2 * p.strength;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        // Head
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.95 * p.strength;
        ctx.beginPath(); ctx.arc(x, y, 3.2 * p.strength, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Nodes — radius from level + energy, glow scales with energy
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isHover = i === hovered;
        const isPinned = i === pinned;
        const dim = dimOf(i);
        const breath = 1 + Math.sin(now * 0.002 + n.phase) * 0.06;
        const baseR = (3 + (n.level - 60) * 0.18) * breath;
        const r = baseR * (1 + n.energy * 0.8) * (isHover || isPinned ? 1.35 : 1);
        const glow = 6 + 22 * n.energy + (isHover ? 16 : 0);

        // Outer glow
        ctx.shadowColor = n.color; ctx.shadowBlur = glow * dim;
        ctx.fillStyle = n.color;
        ctx.globalAlpha = dim;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core dot
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = dim * (0.35 + n.energy * 0.6);
        ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(1, r * 0.4), 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        // Label — always on; size/weight amplifies when active
        const amp = (isHover || isPinned) ? 1 : (0.7 + n.energy * 0.4);
        ctx.fillStyle = `rgba(231,233,255,${dim * Math.min(1, 0.55 + n.energy * 0.6 + (isHover || isPinned ? 0.45 : 0))})`;
        ctx.font = `${(isHover || isPinned) ? 700 : 500} ${10 + (isHover || isPinned ? 2 : 0)}px JetBrains Mono, monospace`;
        ctx.fillText(n.name, n.x + r + 5, n.y + 3 + amp * 1);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      c.removeEventListener("click", onClick);
    };
  }, []);

  const CATS = (window.SKILLS && window.SKILLS.categories) || [];
  return (
    <div className="skill-constellation">
      <canvas ref={ref} />
      <div className="skill-legend">
        {CATS.map(c => (
          <div key={c.name}><span className="skill-legend-dot" style={{ background: c.color }} />{c.name}</div>
        ))}
      </div>
      <div className="skill-caption">[ hover a node to fire · click to pin ]</div>
    </div>
  );
};

window.Skills = () => {
  const GROUPS = (window.SKILLS && window.SKILLS.groups) || [];
  return (
    <section className="skills" id="skills" data-screen-label="skills">
      <div className="skills-head">
        <div className="section-label"><span className="section-num">04</span> skills · live demo</div>
        <h2 className="section-head">180 boids.<br />Three rules.</h2>
        <p className="section-sub">A live Reynolds flocking simulation — one of the foundational algorithms of real-time graphics. Move your cursor through the flock. Click to scatter them. Supporting skill levels below.</p>
      </div>
      <div className="skills-layout pipeline-layout">
        <window.BoidsGame />
        <div className="skill-table">
          {GROUPS.map(g => (
            <div key={g.title}>
              <div className="skill-group-title">{g.title}</div>
              {g.items.map(([name, lvl]) => (
                <div key={name} className="skill-row">
                  <div className="skill-name">{name}</div>
                  <div className="skill-bar" style={{ "--lvl": lvl + "%" }} />
                  <div className="skill-lvl">{lvl}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- EXPERIENCE ----------
window.Experience = () => {
  const XP = window.EXPERIENCE || [];
  return (
    <section className="xp" id="experience" data-screen-label="experience">
      <div className="xp-head">
        <div className="section-label"><span className="section-num">05</span> experience</div>
        <h2 className="section-head">Founder, engineer,<br />and graduate.</h2>
      </div>
      <div className="xp-timeline">
        {XP.map((item, i) => (
          <div key={i} className={`xp-item ${item.type === "research" ? "research" : item.type === "edu" ? "edu" : ""}`}>
            <div className="xp-date">{item.date}</div>
            <div className="xp-role">{item.role}</div>
            <div className="xp-org">{item.org}</div>
            <div className="xp-bullets">
              {item.bullets.map((b, bi) => <div key={bi} className="xp-bullet">{b}</div>)}
            </div>
            {item.img && <div className="xp-img"><img src={item.img} alt={item.role} /></div>}
          </div>
        ))}
      </div>
    </section>
  );
};

// ---------- RESEARCH ----------
window.Research = () => (
  <section className="research" id="research" data-screen-label="research">
    <div className="section-label"><span className="section-num">06</span> research</div>
    <h2 className="section-head" style={{ marginBottom: 40 }}>Spacecraft cables,<br />six degrees of freedom.</h2>
    <div className="research-card">
      <div className="research-media">
        <img src="assets/projects/spaceSim.png" alt="SPACESiM" />
      </div>
      <div className="research-body">
        <div className="research-collab">UMN × Cornell University · funded</div>
        <h3 className="research-title">Cable-Driven 6-DoF Spacecraft Motion Simulator</h3>
        <p className="research-desc">
          A real-time simulator modeling a payload moving in 6 degrees of freedom, suspended by 8 independently-tensioned cables. Hooke's-Law-based tension, recoil, and stretch give physically-accurate behavior for simulated docking-mission planning, so Cornell researchers can test models and mechanisms in-silico before touching hardware.
        </p>
        <div className="research-stats">
          <div className="research-stat"><div className="research-stat-v">6</div><div className="research-stat-k">degrees of freedom</div></div>
          <div className="research-stat"><div className="research-stat-v">8</div><div className="research-stat-k">independent cables</div></div>
          <div className="research-stat"><div className="research-stat-v">UE5</div><div className="research-stat-k">real-time engine</div></div>
        </div>
      </div>
    </div>
  </section>
);

// ---------- CONTACT ----------
window.Contact = () => (
  <section className="contact" id="contact" data-screen-label="contact">
    <div className="contact-inner">
      <div>
        <div className="section-label"><span className="section-num">07</span> contact</div>
        <h2 className="contact-big">Let's build <span className="accent">something</span>.</h2>
        <a className="contact-email" href="mailto:brnolson33@gmail.com">
          brnolson33@gmail.com
          <span style={{ color: "var(--violet)" }}>→</span>
        </a>
        <div className="contact-links">
          <a className="contact-link" href="https://github.com/brnolson" target="_blank" rel="noreferrer">
            <span className="contact-link-k">github</span><span>brnolson</span><span className="contact-link-arrow">↗</span>
          </a>
          <a className="contact-link" href="https://www.linkedin.com/in/brenen-olson/" target="_blank" rel="noreferrer">
            <span className="contact-link-k">linkedin</span><span>brenen-olson</span><span className="contact-link-arrow">↗</span>
          </a>
          <a className="contact-link" href="mailto:brnolson33@gmail.com">
            <span className="contact-link-k">email</span><span>brnolson33@gmail.com</span><span className="contact-link-arrow">↗</span>
          </a>
        </div>
      </div>
      <form className="contact-form" action="https://formspree.io/f/mldgnwgw" method="POST">
        <label htmlFor="email">your email</label>
        <input type="email" id="email" name="email" required placeholder="you@example.com" />
        <label htmlFor="message">message</label>
        <textarea id="message" name="message" rows="6" required placeholder="hey brenen — I'd love to talk about..." />
        <button type="submit" className="cta primary" style={{ alignSelf: "flex-start" }}>send message →</button>
      </form>
    </div>
  </section>
);

// ---------- KONAMI ----------
window.Konami = () => {
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let idx = 0;
    const onKey = (e) => {
      const k = e.key;
      if (k.toLowerCase() === code[idx].toLowerCase() || k === code[idx]) {
        idx++;
        if (idx === code.length) { setActive(true); idx = 0; }
      } else {
        idx = (k === code[0]) ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;
  return (
    <div className={`konami-overlay ${active ? "active" : ""}`}>
      <div className="konami-terminal">
        <button className="konami-close" onClick={() => setActive(false)}>[ esc ]</button>
        <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
{`> ACCESS GRANTED — brenen.olson:root
> loading .bio...

  name       Brenen Olson
  role       graphics engineer
  mission    build graphics at the edge of reality
  secret     this portfolio is itself a graphics demo

> fun facts:
  • 320-member marching band trombone section lead
  • shipped wedding app w/ real auth on Cloudflare + Supabase
  • named a chaos mode "SAVE YOUR GPU"

> type 'hire' to hire me.

`}</pre>
      </div>
    </div>
  );
};
