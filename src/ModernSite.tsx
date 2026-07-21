import { useEffect, useRef, useState, useCallback } from 'react'
import './ModernSite.css'
import ModernPlayer from './ModernPlayer'

interface ModernSiteProps {
  onRevert: () => void
}

const PROJECTS = [
  {
    id: 1,
    title: 'GABA',
    description: "A selective community filled with Georgia's most ambitious people!",
    tags: ['Next.js', 'Supabase', 'Community'],
    link: 'https://gabuilders.vercel.app',
    icon: '🌐',
  },
  {
    id: 2,
    title: 'Muse',
    description: "The startup idea I'm currently building. If you vibecode, check it out!",
    tags: ['React', 'TypeScript', 'Startup'],
    link: 'https://usemuse.dev',
    icon: '🚀',
  },
  {
    id: 3,
    title: 'Swople',
    description: 'A fun betting game I made for me and my friends.',
    tags: ['React', 'Vite', 'Supabase'],
    link: 'https://swople.lockinfounders.com',
    icon: '🎲',
  },
  {
    id: 4,
    title: 'Personal Portfolio',
    description: "You're looking at it :)",
    tags: ['React', 'TypeScript', 'CSS'],
    link: '#',
    icon: '⚡',
  },
]

const SKILLS = [
  { name: 'JavaScript / TypeScript', level: 85, color: '#f59e0b' },
  { name: 'React & Next.js',         level: 80, color: '#06b6d4' },
  { name: 'Node.js',                 level: 70, color: '#10b981' },
  { name: 'CSS / Tailwind',          level: 85, color: '#8b5cf6' },
  { name: 'PostgreSQL / Supabase',   level: 65, color: '#3b82f6' },
  { name: 'Community Building',      level: 95, color: '#ec4899' },
]

const NAV_SECTIONS = ['home', 'about', 'projects', 'skills', 'contact']

// ── Skill bar ──────────────────────────────────────────────────────────────
function AnimatedBar({ level, color }: { level: number; color: string }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth(level), 100); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [level])
  return (
    <div className="ms-skill-bar-outer" ref={ref}>
      <div className="ms-skill-bar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  )
}

// ── Digit pop-in stat ───────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const groupRef = useRef<HTMLSpanElement>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    const el = groupRef.current
    if (!el) return

    const play = () => {
      el.classList.remove('is-animating')
      void el.offsetWidth          // force reflow so animation restarts
      el.classList.add('is-animating')
    }

    const obs = new IntersectionObserver(([entry]) => {
      // Only fire when the element enters the viewport from below,
      // and only once per mount.
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true
        play()
        obs.disconnect()
      }
    }, {
      // The negative bottom margin means the trigger line is
      // 15% up from the bottom of the viewport — so the element
      // must be scrolled into the lower portion of the screen
      // before it counts as "intersecting".
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.4,
    })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="ms-about-stat">
      <span ref={groupRef} className="ms-about-stat-num t-digit-group">
        {value.split('').map((ch, i) => (
          <span
            key={i}
            className="t-digit"
            {...(i > 0 ? { 'data-stagger': String(Math.min(i, 2)) } : {})}
          >
            {ch}
          </span>
        ))}
      </span>
      <span className="ms-about-stat-label">{label}</span>
    </div>
  )
}

// ── 3-D tilt contact card ──────────────────────────────────────────────────
function TiltCard() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const MAX_TILT = 12 // degrees

  const onMove = useCallback((clientX: number, clientY: number) => {
    const wrap = wrapRef.current
    const card = cardRef.current
    if (!wrap || !card) return
    const rect = wrap.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width   // 0..1
    const y = (clientY - rect.top)  / rect.height  // 0..1
    const rx = -(y - 0.5) * 2 * MAX_TILT           // rotateX: top positive
    const ry =  (x - 0.5) * 2 * MAX_TILT           // rotateY: right positive
    card.style.setProperty('--tilt-rx', `${rx}deg`)
    card.style.setProperty('--tilt-ry', `${ry}deg`)
    card.style.setProperty('--tilt-gx', `${x * 100}%`)
    card.style.setProperty('--tilt-gy', `${y * 100}%`)
    card.classList.add('is-tilting')
  }, [])

  const onEnter = useCallback((e: React.PointerEvent) => {
    wrapRef.current?.classList.add('is-hover')
    onMove(e.clientX, e.clientY)
  }, [onMove])

  const onLeave = useCallback(() => {
    const card = cardRef.current
    const wrap = wrapRef.current
    if (!card || !wrap) return
    card.classList.remove('is-tilting')
    card.style.setProperty('--tilt-rx', '0deg')
    card.style.setProperty('--tilt-ry', '0deg')
    wrap.classList.remove('is-hover')
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    onMove(e.clientX, e.clientY)
  }, [onMove])

  return (
    <div
      ref={wrapRef}
      className="t-tilt ms-tilt-wrap"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onPointerMove}
    >
      <div ref={cardRef} className="t-tilt-card ms-contact-card ms-glass">
        <div className="ms-contact-card-inner">
          {/* Avatar */}
          <div className="ms-cc-avatar">
            <img src="/profile.png" alt="Faiz Khan" className="ms-avatar-img" />
          </div>

          {/* Name + handle */}
          <div className="ms-cc-name">Faiz Khan</div>
          <div className="ms-cc-handle">@FaizKhanv7</div>

          {/* Divider */}
          <div className="ms-cc-divider" />

          {/* Links */}
          <div className="ms-cc-links">
            <a href="https://github.com/FaizKhanv7" target="_blank" rel="noreferrer" className="ms-cc-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/faiz-khan-6958b639a/" target="_blank" rel="noreferrer" className="ms-cc-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://x.com/faizkhanv7" target="_blank" rel="noreferrer" className="ms-cc-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </a>
            <a href="mailto:faiz@usemuse.dev" className="ms-cc-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* Glare layer */}
        <div ref={glareRef} className="t-tilt-glare" />
      </div>
    </div>
  )
}

// ── Sliding-pill navbar links ──────────────────────────────────────────────
function NavLinks({ active }: { active: string }) {
  const pillRef  = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const mountedRef = useRef(false)

  // Write pill position. Pass animate=false to snap without transition.
  const movePill = useCallback((idx: number, animate: boolean) => {
    const pill = pillRef.current
    const link = linkRefs.current[idx]
    if (!pill || !link) return

    if (!animate) {
      // Suspend transition, write, force reflow, restore
      pill.style.transition = 'none'
      void pill.offsetWidth
    }

    pill.style.transform = `translateX(${link.offsetLeft}px)`
    pill.style.width     = `${link.offsetWidth}px`

    if (!animate) {
      // Re-enable after the browser has committed the snap position
      void pill.offsetWidth
      pill.style.transition = ''
    }
  }, [])

  // On mount: snap immediately with no animation, then mark as mounted
  useEffect(() => {
    const idx = NAV_SECTIONS.indexOf(active)
    if (idx !== -1) movePill(idx, false)
    mountedRef.current = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On active change after mount: animate
  useEffect(() => {
    if (!mountedRef.current) return
    const idx = NAV_SECTIONS.indexOf(active)
    if (idx !== -1) movePill(idx, true)
  }, [active, movePill])

  // On resize: re-snap without animation
  useEffect(() => {
    const onResize = () => {
      const idx = NAV_SECTIONS.indexOf(active)
      if (idx !== -1) movePill(idx, false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active, movePill])

  return (
    <div className="ms-nav-pill-bar" role="tablist">
      <span ref={pillRef} className="ms-nav-pill-bg" aria-hidden="true" />
      {NAV_SECTIONS.map((s, i) => (
        <a
          key={s}
          ref={el => { linkRefs.current[i] = el }}
          href={`#ms-${s}`}
          role="tab"
          aria-selected={active === s}
          className="ms-nav-pill-link"
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </a>
      ))}
    </div>
  )
}

// ── Auto-scrolling project carousel ────────────────────────────────────────
function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // Duplicate cards so the loop is seamless
  const cards = [...PROJECTS, ...PROJECTS]

  return (
    <div
      className="ms-carousel-viewport"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className={`ms-carousel-track ${paused ? 'ms-carousel-track--paused' : ''}`}
      >
        {cards.map((p, i) => (
          <div className="ms-project-card ms-glass ms-carousel-card" key={i}>
            <div className="ms-project-icon">{p.icon}</div>
            <div className="ms-project-title">{p.title}</div>
            <div className="ms-project-desc">{p.description}</div>
            <div className="ms-project-tags">
              {p.tags.map(t => <span className="ms-tag" key={t}>{t}</span>)}
            </div>
            <a
              className="ms-project-link"
              href={p.link}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
            >
              View Project <span className="ms-arrow">→</span>
            </a>
            <div className="ms-card-shine" />
          </div>
        ))}
      </div>
    </div>
  )
}

const CONTACT_EMAIL = 'faiz@usemuse.dev'

// ── Contact form (opens the visitor's mail client, pre-addressed) ────────────
function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  return (
    <form
      className="ms-form ms-glass"
      onSubmit={e => {
        e.preventDefault()
        const subject = `Portfolio message from ${name || 'someone'}`
        const body = `${message}\n\n—\nFrom: ${name}${email ? ` (${email})` : ''}`
        window.location.href =
          `mailto:${CONTACT_EMAIL}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`
      }}
    >
      <div className="ms-form-group">
        <label className="ms-label">Name</label>
        <input
          className="ms-input"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="ms-form-group">
        <label className="ms-label">Email</label>
        <input
          className="ms-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="ms-form-group">
        <label className="ms-label">Message</label>
        <textarea
          className="ms-input ms-textarea"
          placeholder="What's on your mind?"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="ms-btn ms-btn--primary ms-btn--full">
        Send Message ✦
      </button>
    </form>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ModernSite({ onRevert }: ModernSiteProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(`ms-${id}`)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (top <= 120 && bottom >= 120) { setActiveSection(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="ms-root">
      {/* Navbar */}
      <nav className={`ms-nav ${scrolled ? 'ms-nav--pill' : ''}`}>
        <div className="ms-nav-inner">
          <div className="ms-nav-logo">
            <span className="ms-logo-bracket">&lt;</span>FK<span className="ms-logo-bracket">/&gt;</span>
          </div>

          {/* Pill-sliding nav links */}
          <div className="ms-nav-links">
            <NavLinks active={activeSection} />
          </div>

          <button className="ms-revert-btn" onClick={onRevert}>
            <span className="ms-revert-icon">◈</span>
            Classic Mode
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="ms-home" className="ms-hero">
        <div className="ms-hero-bg-lines" aria-hidden="true" />
        <div className="ms-hero-content">
          <div className="ms-hero-badge">Available for projects</div>
          <h1 className="ms-hero-name">
            <span className="ms-hero-hi">Hi, I'm</span>
            <br />
            <span className="ms-gradient-text">Faiz Khan</span>
          </h1>
          <p className="ms-hero-sub">Developer · Community Builder · 16 years old</p>
          <p className="ms-hero-desc">
            I build things for the web and for people. Passionate about creating
            communities where developers can grow together.
          </p>
          <div className="ms-hero-actions">
            <a href="#ms-projects" className="ms-btn ms-btn--primary">View Projects</a>
            <a href="#ms-contact"  className="ms-btn ms-btn--ghost">Get in Touch</a>
          </div>
        </div>
        <div className="ms-hero-orb ms-orb-1" />
        <div className="ms-hero-orb ms-orb-2" />
        <div className="ms-hero-orb ms-orb-3" />
      </section>

      {/* About */}
      <section id="ms-about" className="ms-section">
        <div className="ms-section-inner">
          <div className="ms-section-label">// about me</div>
          <h2 className="ms-section-title">Who I Am</h2>
          <div className="ms-about-grid">
            <div className="ms-about-card ms-glass">
              <div className="ms-about-avatar">
                <img src="/profile.png" alt="Faiz Khan" className="ms-avatar-img" />
              </div>
              <div className="ms-about-stats">
                <AnimatedStat value="16"  label="Years Old" />
                <AnimatedStat value="4+"  label="Projects"  />
                <AnimatedStat value="∞"   label="Curiosity" />
              </div>
            </div>
            <div className="ms-about-text ms-glass">
              <p>
                Hey, you found me! I'm <strong>Faiz Khan</strong>, 16 years old and already deep in the world
                of software development. I've always loved building and helping others out, so why not combine the two?
              </p>
              <p>
                I'm a passionate developer who loves crafting web experiences, making fun projects,
                and most of all, <strong>helping others build</strong>. Whether that's through
                community platforms, open-source contributions, or just being available to help
                a fellow dev debug their first project.
              </p>
              <p>
                Coding is truly fun when it actually <em>means</em> something to
                someone. At 16, I'm just getting started, and I'm building in public every step of the way.
              </p>
              <div className="ms-currently">
                <span className="ms-currently-dot" />
                Currently learning: Systems design, Java, DevOps, AI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects — auto-scrolling carousel */}
      <section id="ms-projects" className="ms-section ms-section--alt">
        <div className="ms-section-inner">
          <div className="ms-section-label">// projects</div>
          <h2 className="ms-section-title">What I've Built</h2>
        </div>
        {/* Full-width track outside the inner container so cards bleed edge-to-edge */}
        <ProjectCarousel />
      </section>

      {/* Skills */}
      <section id="ms-skills" className="ms-section">
        <div className="ms-section-inner">
          <div className="ms-section-label">// skills</div>
          <h2 className="ms-section-title">What I Work With</h2>
          <div className="ms-skills-wrap ms-glass">
            {SKILLS.map(skill => (
              <div className="ms-skill-item" key={skill.name}>
                <div className="ms-skill-top">
                  <span className="ms-skill-name">{skill.name}</span>
                  <span className="ms-skill-pct" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <AnimatedBar level={skill.level} color={skill.color} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="ms-contact" className="ms-section ms-section--alt">
        <div className="ms-section-inner">
          <div className="ms-section-label">// contact</div>
          <h2 className="ms-section-title">Let's Build Together</h2>
          <div className="ms-contact-grid">

            {/* 3-D tilt contact card */}
            <TiltCard />

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ms-footer">
        <div className="ms-footer-inner">
          <span className="ms-footer-name ms-gradient-text">Faiz Khan</span>
          <span className="ms-footer-copy">© {new Date().getFullYear()} · Built with React & love</span>
          <div className="ms-footer-links">
            <a href="https://github.com/FaizKhanv7" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/faiz-khan-6958b639a/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com/faizkhanv7" target="_blank" rel="noreferrer">X</a>
            <a href="mailto:writetofaiz7@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <ModernPlayer />
    </div>
  )
}
