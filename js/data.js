/*
  ============================================================
  PORTFOLIO DATA
  ============================================================

  HOW TO ADD / EDIT CONTENT:

  * PROJECTS: append to the PROJECTS array.
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
      scale    - short scope note ("Solo", "Internal · 5k users", ...)
      desc     - 1-2 sentence pitch
      long     - array of bullet strings shown under "what I built"
      stack    - array of { cat, items[] } groups
      links    - array of { label, href }

  * EXPERIENCE: append to EXPERIENCE array.
      date, role, org, type ("work" | "research" | "edu"),
      bullets: array of strings, img: optional image path

  * SKILLS: edit SKILLS.groups (table) and SKILLS.categories (constellation).

  Everything on the page re-renders from these arrays; no HTML edits needed.
  ============================================================
*/

window.PROJECTS = [

  // ============================================================
  // FEATURED ROW
  // ============================================================

  {
    id: "tethr-wedding",
    title: "Tethr AI",
    subtitle: "I built an AI — a constraint-aware seating optimizer and multi-turn guest concierge, shipped in production",
    tag: "AI · Full-Stack · Live Product",
    status: "live", badge: "AI · Live", featured: true, tall: true, highlight: true,
    img: null, hero: null,
    year: "2024 — Present",
    role: "Founder · Solo engineer",
    scale: "Shipping in production · mytethr.com",
    desc: "I built Kai — two Claude-powered AI features inside a production wedding platform that go well beyond a chatbot. A constraint-aware seating optimizer reasons over guest relationship graphs and physical table constraints, enforcing a strict JSON schema over Claude's output. A multi-turn guest concierge handles full conversation history, detects short-affirmation replies, classifies post-response intent, and rate-limits per IP. Both run on real user data today.",
    long: [
      "Seating optimizer: guest bios, relationship flags, and table constraints are merged from three data sources and sent to Claude with a strict JSON schema enforced on the output. Plan-tier gating controls access per account with developer and paid overrides.",
      "Guest concierge: full multi-turn conversation history, short-affirmation detection that resolves 'yes please' back to the preceding question rather than treating it as a new prompt, per-IP rate limiting with configurable windows, and a post-reply intent classifier that runs as a separate function after each response.",
      "Table tag automation: a daily Supabase cron job fires at 9 AM CT and sends personalized table-tag emails to every guest for events whose wedding date is tomorrow, with reset tooling for re-sends.",
      "Production infrastructure: magic-link passwordless auth with row-level security, Stripe Checkout and webhook handling, Resend transactional email, Cloudflare for DNS, and Vercel for deployment.",
    ],
    stack: [
      { cat: "AI",        items: ["Claude API (Anthropic)", "Constraint reasoning", "Structured JSON output", "Multi-turn chat", "Intent classification"] },
      { cat: "Frontend",  items: ["Vue 3", "TypeScript", "Tailwind", "GSAP", "PrimeVue"] },
      { cat: "Backend",   items: ["Supabase Edge Functions", "Deno", "PostgreSQL", "Supabase Realtime"] },
      { cat: "Services",  items: ["Stripe", "Resend", "Cloudflare", "Vercel"] },
    ],
    links: [{ label: "mytethr.com", href: "https://mytethr.com" }],
  },

  {
    id: "abide-circle",
    title: "Abide Circle",
    subtitle: "Family visit accountability app — by Tethr",
    tag: "Full-Stack · Behavioral Systems · Live Product",
    status: "live", highlight: true,
    img: "assets/projects/abide.png", hero: "assets/projects/abide.png",
    year: "2025 — Present",
    role: "Founder · Solo engineer",
    scale: "Shipping in production · abidecircle.com",
    desc: "Production SaaS under Tethr Software LLC. Families create a circle around an elderly parent or sick loved one, schedule visits, and the app handles the social accountability layer: streaks, nudges, milestone recognition, and weekly digests — all automated.",
    long: [
      "Role-based access across three user types: family admins manage the circle and see analytics, visitors sign up for visits and log mood and photos, and loved ones get a simplified high-contrast view with minimal UI.",
      "Behavioral nudging pipeline: seven Supabase Edge Functions handle visit confirmations, pre-visit reminders, post-visit follow-ups, streak alerts, milestone emails, weekly digests, and an unsubscribe flow — all triggered by database events or scheduled crons.",
      "Streak system calculates visit consistency with timezone-aware logic and DST edge cases covered by a Vitest unit suite. Manual nudge and streak refresh available to admins.",
      "Stripe subscription with trial period, Checkout, Customer Portal, and webhook handling. Feature gating runs through a single useGate() composable so no component checks subscription status directly.",
      "Playwright E2E test suite seeds isolated users and a test circle against a staging Supabase instance and cleans up after itself. Never runs against production.",
    ],
    stack: [
      { cat: "Frontend",  items: ["Vue 3", "TypeScript", "Tailwind", "GSAP", "PrimeVue"] },
      { cat: "Backend",   items: ["Supabase Edge Functions", "Deno", "PostgreSQL", "Supabase Realtime"] },
      { cat: "Services",  items: ["Stripe", "Resend", "Vercel"] },
      { cat: "Testing",   items: ["Playwright E2E", "Vitest"] },
    ],
    links: [{ label: "abidecircle.com", href: "#" }],
  },

  {
    id: "echovision",
    title: "EchoVision",
    subtitle: "Mixed reality accessibility app — AI describes what a visually impaired user sees",
    tag: "Unity · XR · AI · Accessibility",
    status: "fun", badge: "Graphics · AI", featured: true, highlight: true, category: "graphics",
    img: "assets/projects/echoVision.png", hero: "assets/projects/echoVision.png",
    year: "2025",
    role: "Co-developer — passthrough integration, voice pipeline, interaction design",
    scale: "Meta Quest 3 · Solo + Daniel Vu",
    desc: "A Meta Quest 3 mixed reality app that streams real headset camera footage to an AI backend, transcribes voice queries hands-free, and speaks back context-aware descriptions through an animated avatar. Built at the intersection of real-time computer graphics and real-world accessibility — the system can identify objects in a user's hand, read signage, and narrate surroundings for visually or cognitively impaired people.",
    long: [
      "Passthrough integration using QuestCamera API streams live headset camera frames in real time. Combined with OpenXR spatial anchoring, the app places UI panels as world-space billboards that stay fixed in the physical environment.",
      "Voice pipeline: microphone capture feeds a Python FastAPI backend that handles transcription and LLM inference. Results are returned to the headset and spoken through an avatar with a state machine that cycles through Idle → Listening → Processing → Success/Error modes.",
      "Gesture control via Meta XR SDK: a palm-up gesture triggers the listening state without the user needing to press anything — critical for accessibility contexts where one hand may be occupied.",
      "Custom ShaderLab and HLSL shaders drive the avatar feedback visuals. Spatial UI panels are camera-facing billboards anchored in real world coordinates so they don't drift as the user moves.",
      "Potential use cases: navigation instructions, identifying objects in hand, reading labels, describing scenes for users with visual impairment or cognitive load constraints.",
    ],
    stack: [
      { cat: "XR",        items: ["Unity 2022 LTS", "Meta XR SDK", "OpenXR", "QuestCamera API"] },
      { cat: "Shaders",   items: ["ShaderLab", "HLSL"] },
      { cat: "AI",        items: ["Python FastAPI", "LLM inference", "Speech transcription"] },
      { cat: "Interaction", items: ["Voice recognition", "Gesture control", "Spatial UI", "Billboards"] },
    ],
    links: [],
  },

  {
    id: "raytracer",
    title: "C++ Raytracer Engine",
    subtitle: "Built from scratch, every intersection by hand",
    tag: "C++ · Ray Tracing · BVH",
    status: "fun", badge: "Graphics", featured: true, highlight: true, category: "graphics",
    img: "assets/projects/raytracer.png", hero: "assets/projects/raytracer.png",
    year: "2025",
    role: "Solo",
    scale: "Standalone engine · C++",
    desc: "A complete Whitted-style ray tracing renderer written from scratch in C++. Spheres, triangles, planes, boxes, and arbitrary OBJ meshes with recursive reflection and refraction, three light types, per-pixel shadows, texture and normal mapping, and a BVH acceleration structure that achieves over 10x speedup on complex scenes.",
    long: [
      "Built every layer from first principles: ray-object intersection math for spheres and triangles, Phong illumination model with ambient, diffuse and specular terms, and recursive Whitted-style reflection and refraction to a configurable depth.",
      "BVH (Bounding Volume Hierarchy) organizes triangle geometry into a binary AABB tree. Ray traversal skips entire subtrees on miss, reducing intersection complexity from O(n) to O(log n). A high-poly watch model that previously timed out now renders in seconds.",
      "Smooth per-vertex normal interpolation on triangle meshes eliminates faceted shading artifacts on curved surfaces. Textures and normal maps are applied in tangent space, with a TBN matrix computed per-hit to transform the sampled normal into world space.",
      "Scene format is a declarative text file: camera placement, film resolution, material properties (reflectance, IOR, shininess), point and directional and spot lights, and geometry. The parser handles arbitrary scene composition without recompiling.",
      "Spot lights with smooth inner-to-outer cone falloff, shadow rays offset along the normal to prevent self-intersection, and recursion depth clamping for performance on glass-heavy scenes.",
    ],
    stack: [
      { cat: "Language",   items: ["C++17"] },
      { cat: "Rendering",  items: ["Whitted ray tracing", "Phong shading", "BVH acceleration", "Normal mapping", "Texture mapping"] },
      { cat: "Geometry",   items: ["Spheres", "Triangles", "Planes", "Boxes", "OBJ meshes"] },
      { cat: "Lighting",   items: ["Point", "Directional", "Spot", "Shadows", "Reflection", "Refraction"] },
    ],
    links: [],
  },

  {
    id: "elevator-opengl",
    title: "Elevator Rush",
    subtitle: "OpenGL 4.6 cel-shaded infinite runner, built from scratch",
    tag: "C++ · OpenGL 4.6 · Deferred Rendering",
    status: "fun", badge: "In Development", featured: true, highlight: true, category: "graphics",
    img: "assets/projects/elevator-opengl.png", hero: "assets/projects/elevator-opengl.png",
    year: "2025 — Present",
    role: "Solo",
    scale: "Personal",
    desc: "An anime-style infinite runner built from the GPU up in C++ and OpenGL 4.6. Deferred shading pipeline with a hand-rolled GBuffer, cel shading via a 1D toon ramp texture, screen-space outline extraction, particle VFX, procedural obstacle generation, and a full upgrade system. Still in active development.",
    long: [
      "Deferred rendering pipeline with a custom GBuffer: separate color, world-space normal, and linearized depth attachments written in the geometry pass. The lighting pass reads the GBuffer and applies cel shading entirely in screen space, so every object in the scene gets the same treatment without extra draw calls.",
      "Cel shading uses a 1D toon ramp texture created at startup: diffuse dot product is used as a UV coordinate into the ramp, quantizing the light gradient into hard bands. A rim light and specular term are mixed on top for the anime highlight look.",
      "Screen-space outline pass samples neighboring fragment normals and depths to detect discontinuities. Edges between surfaces and silhouettes are darkened in one fullscreen quad draw, regardless of mesh topology or face count.",
      "Particle system has its own vertex and fragment shader pair. Particles are camera-aligned quads with per-particle velocity, lifetime, and color uploaded as uniform buffer data. The VFX manager issues particle bursts on collision events.",
      "Full game loop: procedural shaft theme generator, difficulty ramp manager, upgrade system with per-session save data, and fully rebindable controls stored in a settings file.",
    ],
    stack: [
      { cat: "Language",   items: ["C++17"] },
      { cat: "Graphics",   items: ["OpenGL 4.6", "GLSL", "GLAD", "GLM"] },
      { cat: "Rendering",  items: ["Deferred GBuffer", "Cel / toon shading", "Screen-space outlines", "Particle VFX"] },
      { cat: "Window",     items: ["SDL2"] },
    ],
    links: [],
  },

  // ============================================================
  // GRAPHICS COURSEWORK
  // ============================================================

  {
    id: "artistic-rendering",
    title: "Artistic Rendering",
    subtitle: "Five shader models written from scratch",
    tag: "GLSL · Shader Programming · TypeScript",
    status: "fun", badge: "Graphics", highlight: true, category: "graphics",
    img: "assets/projects/artistic.png", hero: "assets/projects/artistic.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Implemented five complete GLSL shader pairs from scratch in a single assignment: Gouraud, Phong, cel/toon with diffuse and specular ramps, stencil-based silhouette outline, and tangent-space normal mapping. All five modes are switchable at runtime on the same mesh library.",
    long: [
      "Gouraud vs. Phong comparison makes the aliasing tradeoff tangible: Gouraud interpolates the full lighting equation per-vertex across the face, Phong re-evaluates it per-fragment producing smooth specular highlights on curved surfaces.",
      "Toon shader samples 1D ramp textures for diffuse and specular channels separately, quantizing light into distinct bands. An inflated back-face mesh drawn with front-face culling generates the silhouette outline in a second pass via the stencil buffer.",
      "Normal map shader constructs a TBN matrix (tangent, bitangent, normal) per-fragment and transforms the sampled tangent-space normal into world space before evaluating the lighting equation. Surface micro-detail appears without any additional geometry.",
      "All five shading modes are switchable on the same mesh set (teapot, bunny, armadillo) with multiple texture options at runtime, making lighting model differences immediately visible side-by-side.",
    ],
    stack: [
      { cat: "Shaders",    items: ["GLSL (vert + frag)", "Gouraud", "Phong", "Toon / cel", "Silhouette outline", "Normal mapping"] },
      { cat: "Framework",  items: ["TypeScript", "WebGL", "GopherGfx"] },
    ],
    links: [],
  },

  {
    id: "skeletal-animation",
    title: "Skeletal Animation",
    subtitle: "BVH motion capture on a custom rigged character",
    tag: "TypeScript · WebGL · Bone Hierarchies",
    status: "fun", badge: "Graphics", category: "graphics",
    img: "assets/projects/ants.png", hero: "assets/projects/ants.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Motion capture playback system driven by BVH files. Parses bone topology and per-frame channel data, applies poses through a full skeletal hierarchy using matrix chains, and renders on both the provided ant character and a custom penguin rig.",
    long: [
      "Bone hierarchy traversal computes each bone's world-space transform by chaining local-to-parent transforms from the root down. Any leaf bone's final position is the product of every ancestor matrix in the chain.",
      "BVH parser extracts the skeleton topology and rest pose in one pass, then reads per-frame rotation and translation channels for each bone. Motion clips are applied by writing each frame's channel values into the corresponding bone's local transform matrix.",
      "Pose interpolation blends between adjacent motion clip frames so playback stays smooth at any display frame rate, independent of the capture frame rate.",
      "Custom penguin character designed and rigged to match the BVH joint naming convention, demonstrating that the skeletal system generalizes to any character topology.",
    ],
    stack: [
      { cat: "Animation",  items: ["BVH motion capture", "Forward kinematics", "Bone hierarchies"] },
      { cat: "Math",       items: ["Matrix chains", "Quaternion interpolation"] },
      { cat: "Framework",  items: ["TypeScript", "WebGL", "GopherGfx"] },
    ],
    links: [],
  },

  {
    id: "world-of-drawings",
    title: "A World Made of Drawings",
    subtitle: "Paint strokes in 3D space that face the camera",
    tag: "TypeScript · WebGL · Billboards · GLSL",
    status: "fun", category: "graphics",
    img: "assets/projects/purplecrayon.png", hero: "assets/projects/purplecrayon.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "A first-person world where you paint strokes directly onto the scene. 2D screen-space input is projected onto 3D geometry via ray casting, placed as a camera-facing billboard, and rendered with toon and outline shaders to maintain a hand-drawn look throughout.",
    long: [
      "Stroke projection casts a ray from screen space through the scene using ray-plane and ray-sphere intersection tests. The resulting 3D anchor point places each billboard in world space at the exact draw location on the ground or an existing billboard surface.",
      "Billboards recalculate their orientation every frame: the view-space right and up vectors are extracted from the camera matrix and used to build a rotation that always faces the viewer regardless of camera angle.",
      "Toon and outline shaders from Assignment 5 are applied to the scene geometry to keep the hand-drawn aesthetic consistent between the 3D environment and the painted strokes.",
      "Added jump mechanic: a vertical velocity and gravity integrator on the player controller allows navigating up to elevated billboard surfaces.",
    ],
    stack: [
      { cat: "Rendering",  items: ["Billboards", "Toon / outline shaders", "Ray casting"] },
      { cat: "Framework",  items: ["TypeScript", "WebGL", "GopherGfx"] },
    ],
    links: [],
  },

  {
    id: "earthquake-viz",
    title: "Earthquake Visualization",
    subtitle: "Global seismic data mapped to a 3D globe",
    tag: "TypeScript · WebGL · Data Visualization",
    status: "fun", category: "graphics",
    img: "assets/projects/earthquake.png", hero: "assets/projects/earthquake.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Real earthquake records visualized as magnitude-scaled markers positioned on a rotating 3D globe. Geographic coordinates are converted to spherical surface positions and markers animate on selection.",
    long: [
      "Converts latitude and longitude into 3D Cartesian positions on the sphere surface using the standard polar-to-Cartesian transform, placing every marker at the precise geographic location.",
      "Marker radius encodes earthquake magnitude: larger events are immediately visually distinct from background seismicity at any camera angle.",
      "Orbit controls let the camera rotate around the globe on drag with smooth inertia, making it easy to inspect activity in any region.",
    ],
    stack: [
      { cat: "Framework",  items: ["TypeScript", "WebGL", "GopherGfx"] },
      { cat: "Math",       items: ["Spherical coordinates", "Coordinate transforms"] },
    ],
    links: [],
  },

  {
    id: "hole-in-ground",
    title: "Hole in the Ground",
    subtitle: "3D rigid-body physics simulation game",
    tag: "TypeScript · WebGL · Rigid-Body Physics",
    status: "fun", category: "graphics",
    img: "assets/projects/hole.png", hero: "assets/projects/hole.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Objects fall into a growing hole in the ground driven by rigid-body dynamics. Each level the aperture expands faster and object spawns increase. Extra: a hole-shrink keybind for recovery and timed text overlays for level intros.",
    long: [
      "Rigid-body integrator tracks position, linear velocity, and angular velocity per object. On each frame, forces are accumulated, integrated, and boundary collisions are resolved with impulse responses.",
      "Hole growth rate is parameterized per level and scales procedurally, creating a difficulty ramp without hardcoding individual level values.",
      "Extra wizard features: real-time hole shrink keybinding for players stuck with an overfull hole, and timed text overlays that introduce each level with context.",
    ],
    stack: [
      { cat: "Physics",    items: ["Rigid-body dynamics", "Impulse-based collision response"] },
      { cat: "Framework",  items: ["TypeScript", "WebGL", "GopherGfx"] },
    ],
    links: [],
  },

  {
    id: "csci5607-p4",
    title: "3D First-Person Game Engine",
    subtitle: "Built from scratch in C++ and OpenGL",
    tag: "C++ · OpenGL · SDL3",
    status: "fun", badge: "Graphics", highlight: true, category: "graphics",
    img: "assets/projects/maze.png", hero: "assets/projects/maze.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "A first-person 3D game engine built from scratch in C++ and OpenGL. OBJ model loading, UV texture mapping, multiple point lights, a spot flashlight, smooth animated doors, jumping, and first-person collision detection — all written without a game engine.",
    long: [
      "OBJ parser loads arbitrary 3D models at runtime. Keys, doors, NPCs, and level props are independently modeled files placed in the scene at startup via a custom text map format.",
      "Phong lighting model supports multiple simultaneous point lights plus a spot flashlight attached to the player camera. Ambient, diffuse, and specular terms computed per-fragment in GLSL.",
      "First-person collision detection against walls and locked doors. Doors animate smoothly on unlock — the transform is interpolated over a fixed duration in the game loop, not a physics engine.",
      "Custom map format: a text grid of wall, door, key, and start tokens. Designed two maps specifically to exercise all engine features in one playthrough.",
    ],
    stack: [
      { cat: "Language",    items: ["C++17"] },
      { cat: "Graphics",    items: ["OpenGL", "SDL3", "GLSL"] },
      { cat: "Techniques",  items: ["OBJ loading", "UV texture mapping", "Phong lighting", "Collision detection"] },
    ],
    links: [],
  },

  // ============================================================
  // OTHER PROJECTS
  // ============================================================

  {
    id: "gamblr",
    title: "Gamblr",
    subtitle: "Gambling tracker with a working 3D casino and slot machine",
    tag: "Vue 3 · Three.js · Firebase",
    status: "fun", category: "graphics",
    img: "assets/projects/gamblr.png", hero: "assets/projects/gamblr.png",
    year: "2025",
    role: "Graphics lead",
    scale: "Team of 5 · Coursework",
    desc: "Gambling habit tracker centered on a fully rendered 3D casino environment and a mechanically correct animated slot machine. Draggable analytics widgets, speech-to-text note entry, visit heatmaps, and Firebase for real-time data.",
    long: [
      "3D casino floor and slot machine rendered with Three.js: GLTF scene loading, ambient and point lights, and smooth camera framing that pushes in on the machine during each spin.",
      "Slot machine is mechanically correct: reel strip arithmetic determines win and loss outcomes, reels animate with overshoot easing, and payout sequences trigger light and audio feedback synchronized to the reel stop.",
      "Draggable dashboard widget system (Vue Draggable / SortableJS) lets users arrange charts, heatmaps, and visit logs into any layout. Widget positions persist across sessions via Firestore.",
      "Speech-to-text session notes via Google Cloud Speech API. The API call routes through a Firebase Cloud Function so credentials never reach the browser.",
    ],
    stack: [
      { cat: "3D",        items: ["Three.js", "GLTF", "WebGL"] },
      { cat: "Frontend",  items: ["Vue 3", "JavaScript", "PrimeVue"] },
      { cat: "Backend",   items: ["Firebase", "Cloud Functions", "Firestore"] },
      { cat: "APIs",      items: ["Google Cloud Speech"] },
    ],
    links: [{ label: "gamblr-16a50.web.app", href: "#" }],
  },

  {
    id: "ars",
    title: "ARS",
    subtitle: "ATS Resource Supervisor",
    tag: "Full-Stack · Web",
    status: "fun",
    img: "assets/projects/ars.png", hero: "assets/projects/ars.png",
    year: "2025",
    role: "Solo",
    scale: "Personal",
    desc: "ATS Resource Supervisor — a web tool for managing and supervising ATS resources.",
    long: [],
    stack: [
      { cat: "Web", items: ["HTML", "CSS", "JavaScript"] },
    ],
    links: [],
  },

  {
    id: "trombone-website",
    title: "Trombone Website",
    subtitle: "Personal trombone project site",
    tag: "Web",
    status: "fun",
    img: "assets/projects/ummbbones.png", hero: "assets/projects/ummbbones.png",
    year: "2025",
    role: "Solo",
    scale: "Personal",
    desc: "A personal website for trombone — showcasing recordings, resources, and more.",
    long: [],
    stack: [
      { cat: "Web", items: ["HTML", "CSS", "JavaScript"] },
    ],
    links: [],
  },

  {
    id: "rhythmscape",
    title: "RhythmScape",
    subtitle: "Hit notes, build the 3D world",
    tag: "Three.js · Canvas 2D · React",
    status: "fun", category: "graphics",
    img: "assets/projects/rhythmscape.png", hero: "assets/projects/rhythmscape.png",
    year: "2025",
    role: "Solo",
    scale: "Personal",
    desc: "A rhythm game where each successful note hit reveals a new 3D object in a live scene. Two independent 60fps render loops run in parallel: Canvas 2D for the gameplay lane and Three.js for the 3D world being built behind it.",
    long: [
      "Hybrid rendering architecture: Canvas 2D runs the gameplay lane with Bezier-curved note tracks, particle trails, gradient effects, and combo overlays all at 60fps. Three.js renders the 3D scene separately and updates only when game state changes, keeping GPU work isolated between layers.",
      "GLTF model loading with Draco decompression and a model cache. On each successful hit, a model is pulled from the cache and entered into the scene with a scale-up transition driven by a custom easing function.",
      "Audio sync references AudioContext.currentTime rather than wall clock time so note timing windows stay accurate across frame rate variance. Timing window is 200ms per lane.",
      "Dev-mode free camera (WASD and pointer lock) lets you fly through the scene being built while a song plays, useful for inspecting placement before shipping a level.",
    ],
    stack: [
      { cat: "Graphics",   items: ["Three.js", "Canvas 2D", "GLTF / Draco"] },
      { cat: "Framework",  items: ["React", "JavaScript"] },
      { cat: "Audio",      items: ["Web Audio API"] },
    ],
    links: [],
  },

  {
    id: "noteslift",
    title: "NotesLift",
    subtitle: "Accessible lecture transcript tool adopted by UMN School of Public Health",
    tag: "C# · WPF · .NET 8",
    status: "live",
    img: "assets/projects/noteslift.png", hero: "assets/projects/noteslift.png",
    year: "2024 — 2025",
    role: "Co-developer",
    scale: "UMN School of Public Health · 1,000+ students",
    desc: "A native Windows app that extracts content from PowerPoint presentations and generates clean, accessible Markdown transcripts. Initiated on-shift at UMN's School of Public Health, officially adopted by the department, and used to support lecture accessibility for over a thousand students.",
    long: [
      "Parses .pptx files using DocumentFormat.OpenXml, walking the slide XML tree to extract slide text, speaker notes, and structure in order. Converts to clean Markdown via Markdig.",
      "Rewritten from a Python command-line script into a polished WPF app with .NET 8 so faculty and staff could run it without a terminal. Deployed as a single-file self-contained executable to the department file server.",
      "Unit test suite covers edge cases in the extraction logic: slide ordering, mixed content, and varied PowerPoint formatting to ensure transcript fidelity across real faculty presentations.",
    ],
    stack: [
      { cat: "Language",   items: ["C#"] },
      { cat: "Framework",  items: [".NET 8", "WPF"] },
      { cat: "Libraries",  items: ["DocumentFormat.OpenXml", "Markdig"] },
      { cat: "Testing",    items: ["xUnit"] },
    ],
    links: [],
  },

  {
    id: "svg-editor",
    title: "SVG Path Editor",
    subtitle: "Built the developer tool that did not exist",
    tag: "Vanilla JS · SVG · Developer Tool",
    status: "fun", highlight: true,
    img: "assets/projects/svgEditor.png", hero: "assets/projects/svgEditor.png",
    year: "2026",
    role: "Solo",
    scale: "Personal",
    desc: "I kept needing a fast, visual way to write and tweak SVG path code — and nothing that existed hit the right balance. So I built it. A live-preview editor that puts the raw d attribute front and center with drag-and-drop anchor editing, undo/redo, variable substitution, and persistent zoom.",
    long: [
      "Live preview updates on every keystroke. Coordinate readout follows the cursor in viewBox units. Zoom and pan state persists across edits so the viewport never resets while tuning control points.",
      "Drag mode maps path anchor nodes and Bezier handles back to d-attribute tokens in the code string. Dragging normalizes the surrounding segment in-place: relative commands convert to absolute, H and V commands convert to L when moved in 2D. Code stays accurate throughout.",
      "Variable substitution resolves ${name} tokens from a JSON sidebar into the preview render, so template strings with color variables display correctly without modifying the actual path code.",
      "Vanilla JS, zero dependencies, three files. Built because no existing tool combined live path code editing with draggable handles without a visual-first UI abstracting away the raw string.",
    ],
    stack: [
      { cat: "Language",   items: ["Vanilla JS"] },
      { cat: "Web APIs",   items: ["SVG", "Canvas", "DOM"] },
    ],
    links: [{ label: "svg-code-editor-three.vercel.app", href: "https://svg-code-editor-three.vercel.app" }],
  },

  {
    id: "pancake",
    title: "Pancake Shop",
    subtitle: "3D Portfolio in a Virtual Cafe",
    tag: "3D · Three.js",
    status: "fun", category: "graphics",
    img: "assets/projects/pancake.png", hero: "assets/projects/pancake.png",
    year: "2025 — Present",
    role: "Solo",
    scale: "Personal",
    desc: "Stylized Three.js resume inside a virtual cafe. Smooth camera interpolation, baked lighting, and playful hotspot interactions.",
    long: [
      "Custom camera controller with cubic-bezier interpolation between hotspots so transitions have no whiplash.",
      "Lighting entirely baked into textures; runs at 60fps on mobile.",
      "Interactive pancakes and menu items represent sections like skills, experience, and contact.",
    ],
    stack: [
      { cat: "Graphics",  items: ["Three.js", "WebGL", "GLSL", "JavaScript"] },
      { cat: "Tooling",   items: ["Blender", "Figma"] },
    ],
    links: [],
  },

  {
    id: "rouge",
    title: "Rouge",
    subtitle: "Unreal 5 Action Game",
    tag: "3D · Game Dev",
    status: "fun", category: "graphics",
    img: "assets/projects/rouge.png", hero: "assets/projects/rouge.png",
    year: "2024 — Present",
    role: "Solo",
    scale: "Personal",
    desc: "Handcrafted Unreal 5 game with physics-based interactions, dynamic environment effects, and original sound design.",
    long: [
      "Advanced gameplay mechanics, real-time rendering, and post-process materials for combat feedback.",
      "Physics-based interactions with destructible environment props.",
      "Original particle systems for hit and environmental effects.",
      "Original sound design mastered in Reaper.",
    ],
    stack: [
      { cat: "Engine",  items: ["Unreal 5", "Blueprints", "C++"] },
      { cat: "Audio",   items: ["Reaper"] },
    ],
    links: [],
  },

  {
    id: "textrain",
    title: "Text Rain",
    subtitle: "Image-threshold particle physics",
    tag: "2D · Graphics",
    status: "fun", category: "graphics",
    img: "assets/projects/textRain.png", hero: "assets/projects/textRain.png",
    year: "2025",
    role: "Solo",
    scale: "Coursework",
    desc: "Webcam image-threshold detection drives falling-text physics. Letters accumulate on bright pixels and fall through dark ones. Includes a chaos mode that stress-tests your GPU.",
    long: [
      "Real-time webcam brightness threshold detection: bright pixels repel letters, dark pixels let them fall through.",
      "Verlet-integrated particles with letter-shaped collision volumes.",
      "Chaos mode cranks letter count and collision radius until the frame rate drops.",
    ],
    stack: [
      { cat: "Graphics",  items: ["TypeScript", "WebGL", "Canvas2D"] },
      { cat: "Math",      items: ["Verlet integration"] },
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
    desc: "Collaborative campus exploration game: identify UMN locations from images. Built with React.js and Tailwind as part of the UMN Social Coding Club.",
    long: [
      "Led frontend development for the club project.",
      "Implemented custom keybindings for dynamic navigation and map interaction.",
      "UI refined with Tailwind iteratively after user-testing sessions.",
    ],
    stack: [
      { cat: "Frontend",  items: ["React.js", "Tailwind", "JavaScript"] },
      { cat: "Backend",   items: ["Node.js"] },
    ],
    links: [],
  },

  {
    id: "portfolio",
    title: "Website Portfolio",
    subtitle: "The site you are reading",
    tag: "Web · Three.js · GLSL",
    status: "fun",
    img: "assets/projects/portfolio.png", hero: "assets/projects/portfolio.png",
    year: "2025 — Present",
    role: "Solo",
    scale: "Ongoing",
    desc: "This portfolio itself: a Three.js and GLSL graphics demo that doubles as a resume. Raymarched hero orb, scroll-driven DNA journey, interactive pipeline visualization, and a neural skill constellation. All content is data-driven.",
    long: [
      "Raymarched shader orb in the hero: a cursor-reactive displacement field written in GLSL fragment shader with fresnel iridescence based on view angle.",
      "Scroll-driven cell-to-DNA anatomy journey, entirely GPU-driven via Three.js and custom shader materials that morph geometry along a scroll timeline.",
      "Interactive real-time rendering pipeline visualization: each stage is a clickable node that pins detail about what happens at that GPU stage.",
      "All projects, skills, and experience are data-driven from data.js so the entire site re-renders from a single array edit.",
    ],
    stack: [
      { cat: "Graphics",  items: ["Three.js", "GLSL", "WebGL"] },
      { cat: "Web",       items: ["HTML", "CSS", "JavaScript", "React (CDN)"] },
    ],
    links: [],
  },
];

window.EXPERIENCE = [
  {
    type: "work",
    date: "2024 — Present",
    role: "Founder & Engineer",
    org: "Tethr Software LLC — Minneapolis, MN",
    bullets: [
      "Founded and sole-engineered two production SaaS products: mytethr.com (wedding platform) and abidecircle.com (family visit accountability app).",
      "Built AI features with the Claude API beyond a simple chatbot: a constraint-aware seating optimizer with structured JSON output and a multi-turn guest concierge with affirmation detection, rate limiting, and intent classification.",
      "Full product ownership across both products: schema design, Stripe billing, Supabase Edge Functions, Playwright E2E test suites, and production deployments on Vercel.",
    ],
  },
  {
    type: "work",
    date: "02/2026 — Present · Contract",
    role: "Freelance Developer",
    org: "Art Unlimited — Grand Rapids, MN",
    bullets: [
      "Contracted to build internal web portal applications (details under NDA).",
    ],
  },
  {
    type: "work",
    date: "05/2025 — Present · transitioning to full-time",
    role: "Software Engineer",
    org: "KEB America — Shakopee, MN",
    bullets: [
      "Built a full-stack Blazor + SQLite inventory system with an animated SVG carousel mirroring physical Kardex warehouse hardware; deployed to internal IIS behind Active Directory SSO, managing 5,000+ parts.",
      "Architected a shared-resource management platform (Blazor + SQL Server) with optimistic concurrency, row-version conflict resolution, and a bUnit/xUnit test suite at over 80% coverage on state-changing endpoints.",
      "Wrote C# test cases for automated validation of embedded lift-control parameters using HiL simulation.",
      "Developed embedded C firmware for safety-critical lift systems, integrating over serial interfaces.",
    ],
  },
  {
    type: "research",
    date: "01/2025 — 12/2025 · Research",
    role: "Simulation Software Developer",
    org: "Cable-Driven 6-DoF Spacecraft Motion Simulator · UMN x Cornell",
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
//  GRAPHICS PIPELINE
// ============================================================
window.PIPELINE = [
  {
    id: "vertex", name: "Vertex Data", icon: "points", color: "#5eb5ff",
    desc: "Raw geometry enters: positions, normals, UVs, attributes.",
    detail: "The input side: meshes authored in Blender, generated procedurally, or streamed from engines. My work: custom VBO layouts in C++ OpenGL and Three.js/WebGL, Unreal's UStaticMesh authoring, OBJ parser for the raytracer's triangle mesh input, GLSL attribute indexing.",
    mySkills: ["Three.js", "WebGL", "OpenGL", "Unreal 5", "Blender", "OBJ loading"],
  },
  {
    id: "vshader", name: "Vertex Shader", icon: "matrix", color: "#a78bfa",
    desc: "Per-vertex transform: model to view to clip space.",
    detail: "GPU programs running once per vertex. Matrix math for MVP transforms, skeletal bone skinning, GPU-side vertex displacement. My work: displacement shader on the hero orb, wave-vertex shaders, billboard alignment shaders that face quads toward the camera.",
    mySkills: ["GLSL", "Shaders", "Matrix Math", "Unreal Materials", "Skeletal skinning"],
  },
  {
    id: "primitive", name: "Primitive Assembly", icon: "triangle", color: "#e879f9",
    desc: "Vertices gathered into triangles, lines, or points.",
    detail: "Fixed-function stage where indexed vertices become primitives. The GPU reads the index buffer, groups by topology, and performs early culling against the view frustum. My work: indexed triangle rendering in all OpenGL projects, point topology for the particle systems in Elevator Rush.",
    mySkills: ["Topology", "Indexed Rendering", "Frustum Culling"],
  },
  {
    id: "raster", name: "Rasterization", icon: "grid", color: "#ff9b80",
    desc: "Triangles diced into fragment candidates.",
    detail: "Where geometry becomes pixels. Each triangle is walked across the screen, generating a fragment for every covered pixel with interpolated depth and barycentric attributes. My work: MSAA in OpenGL, custom scan-conversion in the C++ raytracer (ray-triangle barycentric intersection).",
    mySkills: ["Scan Conversion", "MSAA", "Depth Buffering", "Barycentric coords"],
  },
  {
    id: "fshader", name: "Fragment Shader", icon: "shade", color: "#ffc14d",
    desc: "Per-pixel color: lighting, texturing, post-processing.",
    detail: "The programmable per-pixel stage. I write fragment shaders for Phong, Gouraud, toon/cel ramp sampling, normal mapping with TBN matrix construction, screen-space outline detection, and PBR-adjacent fresnel for the hero orb. The raytracer implements the same lighting math in CPU C++.",
    mySkills: ["GLSL", "Phong / Gouraud", "Toon / cel", "Normal mapping", "Post-process", "Ray tracing"],
  },
  {
    id: "framebuffer", name: "Framebuffer", icon: "screen", color: "#67e8c5",
    desc: "Depth-tested, alpha-blended output to the render target.",
    detail: "Final compositing: depth test, stencil ops, alpha blending, writes to the default framebuffer or off-screen FBOs. My work: GBuffer in Elevator Rush (color + normal + depth FBOs for the deferred pass), outline and particle post-passes reading the GBuffer, multi-pass bloom.",
    mySkills: ["FBOs", "GBuffer / Deferred", "Stencil", "Alpha Compositing", "Multi-Pass"],
  },
];

window.SKILLS = {
  categories: [
    { name: "graphics",   color: "#a78bfa", skills: ["GLSL", "OpenGL", "Unreal 5", "Three.js", "WebGL", "Blueprints", "Shaders", "Ray Tracing"] },
    { name: "backend",    color: "#5eb5ff", skills: ["C#", "Blazor", ".NET", "ASP.NET", "EF", "SQLite", "Supabase"] },
    { name: "languages",  color: "#67e8c5", skills: ["Java", "Python", "C", "C++", "TS", "OCaml", "Asm"] },
    { name: "web",        color: "#e879f9", skills: ["Vue 3", "React", "Tailwind", "Cloudflare", "Vercel"] },
  ],

  connections: [
    ["GLSL", "Three.js"], ["GLSL", "Shaders"], ["GLSL", "Unreal 5"], ["GLSL", "OpenGL"],
    ["OpenGL", "C++"], ["OpenGL", "Ray Tracing"], ["Ray Tracing", "C++"],
    ["Three.js", "WebGL"], ["Three.js", "React"], ["Three.js", "TS"],
    ["Unreal 5", "Blueprints"], ["Unreal 5", "C++"], ["Blueprints", "C++"],
    ["C#", ".NET"], ["C#", "Blazor"], ["C#", "ASP.NET"],
    ["Blazor", ".NET"], ["Blazor", "EF"], ["ASP.NET", ".NET"], ["EF", "SQLite"],
    ["Supabase", "Cloudflare"], ["Cloudflare", "Vercel"],
    ["Vue 3", "TS"], ["React", "TS"], ["Vue 3", "Tailwind"], ["React", "Tailwind"],
    ["Python", "Java"], ["Java", "C"], ["C", "C++"], ["C", "Asm"],
    ["TS", "React"], ["TS", "Vue 3"],
  ],

  groups: [
    { title: "// graphics + realtime", items: [
      ["GLSL / Shaders", 90], ["OpenGL", 85], ["Unreal Engine 5", 80], ["Three.js / WebGL", 85], ["Ray Tracing", 80], ["Physics Sim", 78], ["Blueprints", 75],
    ]},
    { title: "// languages", items: [
      ["C#", 95], ["Python", 90], ["Java", 88], ["C / C++", 85], ["TypeScript", 85], ["OCaml", 70],
    ]},
    { title: "// full-stack + cloud", items: [
      ["Blazor / .NET", 95], ["Vue 3", 85], ["React", 80], ["Supabase / PostgreSQL", 80], ["Cloudflare / Vercel", 85], ["Entity Framework", 90],
    ]},
    { title: "// ops + testing", items: [
      ["Git / GitHub", 95], ["Docker", 75], ["Azure DevOps", 80], ["xUnit / bUnit / Playwright", 85], ["HIL Testing", 70],
    ]},
  ],
};
