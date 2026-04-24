/*
  ============================================================
  PORTFOLIO DATA — edit this file to update the site.
  ============================================================

  HOW TO ADD / EDIT CONTENT:

  • PROJECTS: append to the PROJECTS array.
      id       - unique kebab-case string
      title    - short display name
      subtitle - one-line tagline (optional)
      tag      - stack summary shown on the card (e.g. "Full-Stack · Live Product")
      status   - one of: "live" (shipping), "research", "fun"
      badge    - optional text shown top-left of card (e.g. "Featured")
      featured - true to render as a big featured card at top
      tall     - true to take full height in featured row
      img      - preview image path, e.g. "assets/projects/myproject.png", or null for procedural graphic
      hero     - modal hero image path (usually same as img), or null
      year     - "2025" or "2024 — Present"
      role     - your role on the project
      scale    - short scope note ("Solo", "Internal · 5k users", …)
      desc     - 1-2 sentence pitch
      long     - array of bullet strings shown under "what I built"
      stack    - array of { cat, items[] } groups
      links    - array of { label, href }

  • EXPERIENCE: append to EXPERIENCE array.
      date, role, org, type ("work" | "research" | "edu"),
      bullets: array of strings, img: optional image path

  • SKILLS: edit SKILLS.groups (table) and SKILLS.categories (constellation).

  Everything on the page re-renders from these arrays; no HTML edits needed.
  ============================================================
*/

window.PROJECTS = [
  {
    id: "tethr",
    title: "Tethr",
    subtitle: "Wedding Save-the-Date Platform",
    tag: "Full-Stack · Live Product",
    status: "live", badge: "Featured", featured: true, tall: true,
    img: null, hero: null,
    year: "2024 — Present",
    role: "Solo founder-engineer",
    scale: "Shipping in production",
    desc: "A production-ready web app built for real guests. Full auth, real-time reservations, scalable backend, third-party integrations for email and SMS. Built end-to-end by one person.",
    long: [
      "Architected on Cloudflare Workers + Supabase — zero-cost cold starts, generous free tier, global edge.",
      "Passwordless magic-link auth with row-level security policies; guests can only see their own RSVPs.",
      "Real-time reservation counts via Supabase Realtime; guests see seat availability update live.",
      "Transactional email via Resend, SMS via Twilio — wired through a single message queue.",
    ],
    stack: [
      { cat: "Frontend", items: ["Vue 3", "TypeScript", "Tailwind"] },
      { cat: "Backend",  items: ["Cloudflare Workers", "Supabase", "PostgreSQL"] },
      { cat: "Services", items: ["Resend", "Twilio", "Stripe"] },
    ],
    links: [{ label: "gettethr.app", href: "#" }],
  },
  {
    id: "spacesim",
    title: "SPACESiM",
    subtitle: "6-DoF Cable-Driven Motion Simulator",
    tag: "Research · Unreal 5",
    status: "research", badge: "Research", featured: true,
    img: "assets/projects/spaceSim.png", hero: "assets/projects/spaceSim.png",
    year: "2025",
    role: "Simulation Developer",
    scale: "UMN × Cornell collab",
    desc: "Real-time 6-DoF cable-tension simulator emulating safety-critical spacecraft motion. Rigid-body dynamics and Newtonian mechanics in Unreal 5.",
    long: [
      "Eight independently-tensioned cables suspend a payload with six degrees of freedom — three translational, three rotational.",
      "Hooke's Law-based tension model with recoil and cable stretch; physically-accurate for simulated docking mission planning.",
      "Cornell researchers use it to validate mechanism designs in-silico before touching hardware.",
      "Custom runtime force-visualization HUD built in UMG to debug tension feedback in real time.",
    ],
    stack: [
      { cat: "Engine",  items: ["Unreal Engine 5", "Blueprints"] },
      { cat: "Code",    items: ["C++", "GLSL"] },
      { cat: "Physics", items: ["Rigid-body dynamics", "Newtonian mechanics"] },
    ],
    links: [],
  },
  {
    id: "carousel",
    title: "Kardex Carousel Inventory",
    subtitle: "Internal warehouse tool",
    tag: "Full-Stack · Blazor",
    status: "live",
    img: "assets/projects/carousel.png", hero: "assets/projects/carousel.png",
    year: "2025 — Present",
    role: "Full-stack engineer",
    scale: "Internal · 5,000+ items",
    desc: "Full-stack Blazor app with an animated carousel mirroring real warehouse hardware, CRUD for thousands of items, deployed to secure internal IIS.",
    long: [
      "Animated SVG carousel mirrors the physical Kardex hardware — operators see the virtual state match the real machine.",
      "CRUD interface over 5,000+ parts with fuzzy search and bin-location prediction.",
      "Deployed to secure internal IIS behind Active Directory SSO.",
      "Optimized large image assets via compression and lazy-loading for smooth tray-retrieval transitions.",
    ],
    stack: [
      { cat: "Frontend", items: ["Blazor Server", "SVG", "Bootstrap"] },
      { cat: "Backend",  items: ["ASP.NET Core", "Entity Framework", "SQLite"] },
      { cat: "Deploy",   items: ["IIS", "Windows Server"] },
    ],
    links: [],
  },
  {
    id: "ars",
    title: "R&D Engineering Resource Supervisor",
    subtitle: "Shared-resource management platform",
    tag: "Full-Stack · Internal",
    status: "live",
    img: "assets/projects/ars.png", hero: "assets/projects/ars.png",
    year: "2025",
    role: "Full-stack engineer",
    scale: "Internal · 5,000+ resources",
    desc: "Full-stack Blazor app from scratch managing 5,000+ shared engineering resources. Concurrency edge cases, integration tests, optimistic locking.",
    long: [
      "Optimistic concurrency with row-version checks — no more two engineers overwriting each other's reservation.",
      "bUnit + xUnit test suite with >80% coverage on state-changing endpoints.",
      "Admin dashboard with utilization heat-maps across teams.",
      "Deployed to a local IIS server for secure access within a closed network.",
    ],
    stack: [
      { cat: "Frontend", items: ["Blazor Server", "MudBlazor"] },
      { cat: "Backend",  items: ["ASP.NET Core", "EF Core", "SQL Server"] },
      { cat: "Testing",  items: ["xUnit", "bUnit", "Playwright"] },
    ],
    links: [],
  },
  {
    id: "pancake",
    title: "Pancake Shop",
    subtitle: "3D Portfolio in a Virtual Café",
    tag: "3D · Three.js",
    status: "fun",
    img: "assets/projects/pancake.png", hero: "assets/projects/pancake.png",
    year: "2025 — Present",
    role: "Solo",
    scale: "Just for fun",
    desc: "Stylized Three.js resume inside a virtual café. Smooth camera interpolation, baked lighting, playful hotspot interactions.",
    long: [
      "Custom camera controller with cubic-bezier interpolation between hotspots — no whiplash on transitions.",
      "Lighting entirely baked into textures; runs at 60fps on mobile.",
      "Interactive pancakes and menu items represent sections like skills, experience, and contact.",
    ],
    stack: [
      { cat: "Graphics", items: ["Three.js", "WebGL", "GLSL", "JavaScript"] },
      { cat: "Tooling",  items: ["Blender", "Figma"] },
    ],
    links: [],
  },
  {
    id: "rouge",
    title: "Rouge",
    subtitle: "Unreal 5 Action Game",
    tag: "3D · Game Dev",
    status: "research",
    img: "assets/projects/rouge.png", hero: "assets/projects/rouge.png",
    year: "2024 — Present",
    role: "Solo",
    scale: "Personal / portfolio",
    desc: "Handcrafted Unreal 5 game with physics-based interactions, dynamic environment effects, and original sound design.",
    long: [
      "Advanced gameplay mechanics, graphics, and real-time rendering for an immersive 3D experience.",
      "Physics-based interactions with destructible environment props.",
      "Original particle systems and post-process materials for combat feedback.",
      "Original sound design mastered in Reaper.",
    ],
    stack: [
      { cat: "Engine", items: ["Unreal 5", "Blueprints", "C++"] },
      { cat: "Audio",  items: ["Reaper"] },
    ],
    links: [],
  },
  {
    id: "ummbbones",
    title: "UMMB Trombones Webapp",
    subtitle: "Section-wide centralized hub",
    tag: "Full-Stack · Blazor",
    status: "live",
    img: "assets/projects/ummbbones.png", hero: "assets/projects/ummbbones.png",
    year: "2025 — Present",
    role: "Solo developer",
    scale: "40+ active members",
    desc: "Centralized, live-updated platform for 40+ trombone players — schedules, player details, and announcements.",
    long: [
      "Responsive Blazor web app deployed on Vercel for reliable, scalable hosting.",
      "Live data updates ensure current schedules and info are always accessible.",
      "Interactive components for fast navigation of player profiles, practice schedules, and events.",
    ],
    stack: [
      { cat: "Frontend", items: ["Blazor", "JavaScript"] },
      { cat: "Code",     items: ["C#"] },
      { cat: "Deploy",   items: ["Vercel"] },
    ],
    links: [],
  },
  {
    id: "textrain",
    title: "Text Rain",
    subtitle: "Image-threshold particle physics",
    tag: "2D · Graphics",
    status: "fun",
    img: "assets/projects/textRain.png", hero: "assets/projects/textRain.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Image-threshold detection drives falling-text physics. Includes a \"SAVE YOUR GPU\" chaos mode.",
    long: [
      "Real-time webcam threshold detection — bright pixels repel, dark pixels let letters fall through.",
      "Verlet-integrated particles with letter-shaped collision volumes.",
      "Chaos mode cranks letter count and radius until your fans spin up.",
    ],
    stack: [
      { cat: "Graphics", items: ["TypeScript", "WebGL", "Canvas2D"] },
      { cat: "Math",     items: ["Verlet integration"] },
    ],
    links: [],
  },
  {
    id: "gopherguesser",
    title: "UMN Campus GeoGuesser",
    subtitle: "Campus exploration game",
    tag: "Web · Game Dev",
    status: "fun",
    img: "assets/projects/gopherGuesser.png", hero: "assets/projects/gopherGuesser.png",
    year: "2024",
    role: "Frontend lead",
    scale: "Social Coding Club",
    desc: "Collaborative campus exploration game — identify UMN locations from images. Built with React.js and Tailwind.",
    long: [
      "Collaborated with the UMN Social Coding Club on an interactive campus game.",
      "Led frontend development; implemented custom keybindings for dynamic navigation.",
      "UI/UX refined with Tailwind; iteratively improved after user-testing sessions.",
    ],
    stack: [
      { cat: "Frontend", items: ["React.js", "Tailwind", "JavaScript"] },
      { cat: "Backend",  items: ["Node.js"] },
    ],
    links: [],
  },
  {
    id: "vts",
    title: "Virtual Transit System",
    subtitle: "Object-oriented simulator",
    tag: "Java · OOP",
    status: "fun",
    img: "assets/projects/vts.png", hero: "assets/projects/vts.png",
    year: "2024",
    role: "Collaborative",
    scale: "Coursework",
    desc: "Java simulation of UMN campus transit with UML-driven OO design, design patterns, and a full test framework.",
    long: [
      "Applied UML and object-oriented principles for system modeling.",
      "Implemented design patterns for scalability and adaptability to different transit scenarios.",
      "Test framework using Mockito for unit testing and JaCoCo for coverage analysis.",
    ],
    stack: [
      { cat: "Language", items: ["Java"] },
      { cat: "Design",   items: ["UML", "Design Patterns"] },
      { cat: "Testing",  items: ["Mockito", "JaCoCo"] },
    ],
    links: [],
  },
  {
    id: "sortstack",
    title: "Marching Band Leadership Sort",
    subtitle: "Constraint-based optimization",
    tag: "Python · Algorithms",
    status: "fun",
    img: "assets/projects/sortStack.png", hero: "assets/projects/sortStack.png",
    year: "2024",
    role: "Solo",
    scale: "Automated selection tool",
    desc: "Constraint-based sorting algorithm to optimize marching-band leadership team selection.",
    long: [
      "Constraint-based matching to balance leader assignments across sections.",
      "Prioritizes match variability while keeping selection fair.",
      "Python data structures and optimization techniques reduce manual effort.",
    ],
    stack: [
      { cat: "Language", items: ["Python"] },
      { cat: "Domain",   items: ["Algorithm design", "Optimization"] },
    ],
    links: [],
  },
  {
    id: "audition",
    title: "Audio/Video Editing Tools",
    subtitle: "PyAutoGUI automation",
    tag: "Python · Scripting",
    status: "fun",
    img: "assets/projects/auditionTools.png", hero: "assets/projects/auditionTools.png",
    year: "2023",
    role: "Solo",
    scale: "Student Tech Support",
    desc: "Python automation tools to streamline audio/video editing for my Student Tech Support role.",
    long: [
      "Automated slide spacing, audio cue placement, and document generation from PowerPoint.",
      "Cut audio-splicing post-production time by 75%.",
      "Adaptable for various editing and media-processing workflows.",
    ],
    stack: [
      { cat: "Language", items: ["Python"] },
      { cat: "Automation", items: ["PyAutoGUI"] },
    ],
    links: [],
  },
  {
    id: "chess",
    title: "2D Array Chess",
    subtitle: "Classic chess in pure Java",
    tag: "Java · Game",
    status: "fun",
    img: "assets/projects/chess.png", hero: "assets/projects/chess.png",
    year: "2023",
    role: "Solo",
    scale: "Coursework",
    desc: "Chess implementation built on 2D arrays — move validation, check detection, castling, en passant.",
    long: [
      "2D array representation of the board for efficient state tracking.",
      "Move validation, check detection, and turn-based play enforcement.",
      "Special rules implemented: castling, en passant, promotion.",
    ],
    stack: [
      { cat: "Language", items: ["Java"] },
      { cat: "Domain",   items: ["Data Structures", "Algorithms"] },
    ],
    links: [],
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    subtitle: "Recursive flood-fill classic",
    tag: "Java · Game",
    status: "fun",
    img: "assets/projects/mineSweeper.png", hero: "assets/projects/mineSweeper.png",
    year: "2023",
    role: "Solo",
    scale: "Coursework",
    desc: "Java Minesweeper — recursive flood-fill uncovering, dynamic state management, search-based tile reveals.",
    long: [
      "Efficient tile-reveal mechanics via search algorithms.",
      "Recursive flood-fill for uncovering safe areas dynamically.",
      "Data structures manage game state and improve update performance.",
    ],
    stack: [
      { cat: "Language", items: ["Java"] },
      { cat: "Domain",   items: ["Recursion", "Search"] },
    ],
    links: [],
  },
  {
    id: "rocketgame",
    title: "Python Turtle Rocket",
    subtitle: "2D event-driven game",
    tag: "Python · Game",
    status: "fun",
    img: "assets/projects/rocketGame.png", hero: "assets/projects/rocketGame.png",
    year: "2023",
    role: "Solo",
    scale: "Personal",
    desc: "Interactive 2D rocket game in Python Turtle Graphics — real-time movement, collision detection, UI elements.",
    long: [
      "Real-time rocket movement and obstacle navigation.",
      "Event-driven programming for smooth player interactions.",
      "Basic game-dev techniques including collision detection and UI.",
    ],
    stack: [
      { cat: "Language", items: ["Python"] },
      { cat: "Graphics", items: ["Turtle"] },
    ],
    links: [],
  },
  {
    id: "musictrainer",
    title: "Music Staff Trainer",
    subtitle: "Note-reading educational tool",
    tag: "Python · EdTech",
    status: "fun",
    img: "assets/projects/musicTrainer.png", hero: "assets/projects/musicTrainer.png",
    year: "2021 (Restored 2025)",
    role: "Solo",
    scale: "Educational",
    desc: "Python Turtle-graphics app that dynamically generates note-reading challenges on a staff.",
    long: [
      "Algorithmic random-note generation on a visual music staff.",
      "Real-time input handling for note identification and response validation.",
      "Structured, adaptable learning experience.",
    ],
    stack: [
      { cat: "Language", items: ["Python"] },
      { cat: "Graphics", items: ["Turtle"] },
    ],
    links: [],
  },
  {
    id: "portfolio",
    title: "Website Portfolio",
    subtitle: "The site you are reading",
    tag: "Web · Three.js",
    status: "fun",
    img: "assets/projects/portfolio.png", hero: "assets/projects/portfolio.png",
    year: "2025 — Present",
    role: "Solo",
    scale: "Ongoing",
    desc: "This portfolio itself — a Three.js graphics demo doubling as a résumé.",
    long: [
      "Raymarched shader orb (GLSL, cursor-reactive) as the hero.",
      "Scroll-driven cell-to-DNA anatomy journey, entirely GPU-driven.",
      "Projects, skills, and experience fully data-driven (data.js).",
    ],
    stack: [
      { cat: "Graphics", items: ["Three.js", "GLSL", "WebGL"] },
      { cat: "Web",      items: ["HTML", "CSS", "JavaScript", "React (CDN)"] },
    ],
    links: [],
  },
];

window.EXPERIENCE = [
  {
    type: "work",
    date: "05/2025 — Present · transitioning to full-time",
    role: "Software Engineer",
    org: "KEB America — Shakopee, MN",
    bullets: [
      "Architected full-stack internal tooling (Blazor + SQLite) managing 5,000+ engineering resources.",
      "Wrote C# test cases for automated validation of embedded lift-control parameters using HiL simulation.",
      "Developed embedded C firmware for safety-critical lift systems, integrating over serial interfaces.",
    ],
  },
  {
    type: "research",
    date: "01/2025 — 12/2025 · Research",
    role: "Simulation Software Developer",
    org: "Cable-Driven 6-DoF Spacecraft Motion Simulator · UMN × Cornell",
    bullets: [
      "Built real-time 6-DoF cable-tension and trajectory simulator in Unreal 5 for safety-critical motion.",
      "Engineered physics-based cable-force and payload-stability calculations using rigid-body dynamics and Newtonian mechanics.",
    ],
  },
  {
    type: "work",
    date: "02/2023 — 12/2025",
    role: "Student Tech Support Services",
    org: "School of Public Health — UMN",
    bullets: [
      "Produced lectures for 1,000+ students; supported faculty in the School of Public Health.",
      "Python automation (PyAutoGUI + OS) cut audio-splicing time by 75%.",
      "Initiated and developed NotesLift — an accessibility tool adopted by the School.",
    ],
  },
  {
    type: "edu",
    date: "Graduated 12/2025",
    role: "B.S. Computer Science",
    org: "UMN Twin Cities — College of Science & Engineering · GPA 3.809",
    bullets: [
      "Dean's List: Fall 2023, Spring 2024, Fall 2024, Spring 2025, Fall 2025.",
      "Coursework emphasis: graphics, systems, embedded.",
    ],
  },
];

// ============================================================
//  GRAPHICS PIPELINE — the "skills demo" section renders this as an
//  interactive visualization of the real-time rendering pipeline.
//  Each stage becomes a glowing node in the canvas. Add or reorder
//  entries and the visualization rebuilds itself.
//    id      — stable kebab-case id
//    name    — short display name
//    icon    — visual motif: "points" | "triangle" | "matrix" | "grid" |
//              "shade" | "screen" — or add your own in sections.jsx
//    desc    — one-line summary shown on hover / click
//    detail  — longer detail shown when the stage is pinned (click)
//    color   — accent hex string (matches the site palette)
//    mySkills — your concrete skills that live at this stage
// ============================================================
window.PIPELINE = [
  {
    id: "vertex", name: "Vertex Data", icon: "points", color: "#5eb5ff",
    desc: "Raw geometry enters: positions, normals, UVs, attributes.",
    detail: "The input side — meshes authored in Blender, generated procedurally, or streamed from engines. My work: custom buffer layouts in Three.js/WebGL, Unreal's UStaticMesh authoring, GLSL attribute indexing.",
    mySkills: ["Three.js", "WebGL", "Unreal 5", "Blender"],
  },
  {
    id: "vshader", name: "Vertex Shader", icon: "matrix", color: "#a78bfa",
    desc: "Per-vertex transform — model → view → clip space.",
    detail: "GPU programs running once per vertex. Matrix math for MVP transforms, skeletal skinning, GPU-side vertex displacement (noise, wave, etc.). My work: displacement shader on the hero orb, wave-vertex shaders for the Text Rain demo.",
    mySkills: ["GLSL", "Shaders", "Matrix Math", "Unreal Materials"],
  },
  {
    id: "primitive", name: "Primitive Assembly", icon: "triangle", color: "#e879f9",
    desc: "Vertices gathered into triangles, lines, or points.",
    detail: "Fixed-function stage where indexed vertices become actual primitives. The GPU reads the index buffer, groups by topology (triangle list, strip, fan), and performs early culling/clipping against the view frustum.",
    mySkills: ["Topology", "Indexed Rendering", "Frustum Culling"],
  },
  {
    id: "raster", name: "Rasterization", icon: "grid", color: "#ff9b80",
    desc: "Triangles diced into fragment candidates — pixel-sized samples.",
    detail: "Where geometry becomes pixels. Each triangle is walked across the screen, generating a fragment for every pixel it covers. Depth interpolation, barycentric-coordinate setup for later shader inputs.",
    mySkills: ["Scan Conversion", "MSAA", "Depth Buffering"],
  },
  {
    id: "fshader", name: "Fragment Shader", icon: "shade", color: "#ffc14d",
    desc: "Per-pixel color — lighting, texturing, post-processing.",
    detail: "The programmable per-pixel stage. I write fragment shaders for PBR lighting, fresnel iridescence (see the hero orb), screen-space effects, post-processing, and custom materials in Unreal. Ray-march distance fields when I need to.",
    mySkills: ["GLSL", "PBR", "Post-Process", "SDF Ray Marching"],
  },
  {
    id: "framebuffer", name: "Framebuffer", icon: "screen", color: "#67e8c5",
    desc: "Depth-tested, alpha-blended output to the render target.",
    detail: "Final compositing: depth test, alpha blending, stencil ops. Writes to the default framebuffer or off-screen FBOs for multi-pass pipelines (bloom, SSAO, deferred lighting). Then it's on the screen.",
    mySkills: ["FBOs", "Bloom", "Alpha Compositing", "Multi-Pass Render"],
  },
];

window.SKILLS = {
  // Neural skill network — nodes are skills, edges are relationships.
  // Each skill in "categories" becomes a node on the graph. Within a category
  // every node is connected to every other; additional cross-category edges
  // are listed in `connections`.
  categories: [
    { name: "graphics",  color: "#a78bfa", skills: ["GLSL", "Unreal 5", "Three.js", "WebGL", "Blueprints", "Shaders"] },
    { name: "backend",   color: "#5eb5ff", skills: ["C#", "Blazor", ".NET", "ASP.NET", "EF", "SQLite", "Supabase"] },
    { name: "languages", color: "#67e8c5", skills: ["Java", "Python", "C", "C++", "TS", "OCaml", "Asm"] },
    { name: "web",       color: "#e879f9", skills: ["Vue 3", "React", "Tailwind", "Cloudflare", "Vercel"] },
  ],

  // Cross-category edges that tell the story of how skills connect across
  // disciplines. Add pairs to wire new relationships into the network.
  connections: [
    ["GLSL", "Three.js"], ["GLSL", "Shaders"], ["GLSL", "Unreal 5"],
    ["Three.js", "WebGL"], ["Three.js", "React"], ["Three.js", "TS"],
    ["Unreal 5", "Blueprints"], ["Unreal 5", "C++"], ["Blueprints", "C++"],
    ["C#", ".NET"], ["C#", "Blazor"], ["C#", "ASP.NET"],
    ["Blazor", ".NET"], ["Blazor", "EF"], ["ASP.NET", ".NET"], ["EF", "SQLite"],
    ["Supabase", "Cloudflare"], ["Cloudflare", "Vercel"],
    ["Vue 3", "TS"], ["React", "TS"], ["Vue 3", "Tailwind"], ["React", "Tailwind"],
    ["Python", "Java"], ["Java", "C"], ["C", "C++"], ["C", "Asm"],
    ["TS", "React"], ["TS", "Vue 3"],
  ],

  // Level-bars table (right side of skills section).
  groups: [
    { title: "// graphics + realtime", items: [
      ["GLSL / Shaders", 85], ["Unreal Engine 5", 80], ["Three.js / WebGL", 85], ["Physics Sim", 75], ["Blueprints", 75],
    ]},
    { title: "// languages", items: [
      ["C#", 95], ["Python", 90], ["Java", 88], ["C / C++", 80], ["TypeScript", 85], ["OCaml", 70],
    ]},
    { title: "// full-stack + cloud", items: [
      ["Blazor / .NET", 95], ["Vue 3", 85], ["React", 80], ["Supabase / PostgreSQL", 80], ["Cloudflare / Vercel", 85], ["Entity Framework", 90],
    ]},
    { title: "// ops + testing", items: [
      ["Git / GitHub", 95], ["Docker", 75], ["Azure DevOps", 80], ["xUnit / bUnit / jUnit", 85], ["HIL Testing", 70],
    ]},
  ],
};
