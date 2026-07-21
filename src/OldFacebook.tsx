import { useState } from 'react'
import './OldFacebook.css'
import MusicPlayer from './MusicPlayer'

interface OldFacebookProps {
  onModernize: () => void
}

const PROJECTS = [
  {
    id: 1,
    title: 'GABA',
    description:
      'A selective community filled with Georgia\'s most ambitious people!',
    tags: ['Next.js', 'Supabase', 'Community'],
    link: 'https://gabuilders.vercel.app',
  },
  {
    id: 2,
    title: 'Muse',
    description:
      'The startup idea I\'m currently building. If you vibecode, check it out!',
    tags: ['React', 'Typescript', 'Startup'],
    link: 'https://usemuse.dev',
  },
  {
    id: 3,
    title: 'Swople',
    description:
      'A fun betting game I made for me and my friends.',
    tags: ['React', 'Vite', 'Supabase'],
    link: 'https://swople.lockinfounders.com',
  },
  {
    id: 4,
    title: 'Personal Portfolio',
    description:
      'You\'re looking at it :)',
    tags: ['React', 'TypeScript', 'CSS'],
    link: '#',
  },
]

const CONTACT_EMAIL = 'faiz@usemuse.dev'

export default function OldFacebook({ onModernize }: OldFacebookProps) {
  const [stalkerOpen, setStalkerOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  return (
    <div className="fb-root">
      {/* Top bar */}
      <div className="fb-topbar">
        <div className="fb-topbar-inner">
          <div className="fb-logo">
            <span className="fb-logo-f">f</span>
            <span className="fb-logo-text">acebo.. I mean Faiz :)</span>
          </div>
          <nav className="fb-nav">
          </nav>
          <button className="fb-modernize-btn" onClick={onModernize} title="Switch to modern UI">
            <span className="wand-icon">✦</span>
            Ooh what does this button do?
          </button>
        </div>
      </div>

      <div className="fb-content">
        {/* Left sidebar */}
        <aside className="fb-sidebar">
          <div className="fb-sidebar-box">
            <div className="fb-avatar-wrap">
              <div className="fb-avatar">
                <img src="/profile.png" alt="Faiz Khan" className="fb-avatar-img" />
              </div>
            </div>
            <div className="fb-sidebar-name">Faiz Khan</div>
            <div className="fb-sidebar-tagline">Developer · Community Builder</div>
            <hr className="fb-divider" />
            <ul className="fb-sidebar-list">
              <li><span className="fb-sidebar-icon">📍</span> Georgia</li>
              <li><span className="fb-sidebar-icon">🎂</span> Age 16</li>
              <li><span className="fb-sidebar-icon">💼</span> Open to work</li>
              <li><span className="fb-sidebar-icon">🌐</span> Building communities</li>
            </ul>
            <hr className="fb-divider" />
            <div className="fb-sidebar-section-title">Networks</div>
            <ul className="fb-sidebar-list">
              <li>GABA</li>
              <li>Hackathons</li>
              <li>
                <button className="fb-friends-link" onClick={() => setStalkerOpen(true)}>
                  View My Friends
                </button>
              </li>
            </ul>
          </div>

          <div className="fb-sidebar-box fb-sidebar-links">
            <div className="fb-sidebar-section-title">Links</div>
            <ul className="fb-sidebar-list">
              <li><a href="https://github.com/FaizKhanv7" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/faiz-khan-6958b639a/" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="https://x.com/faizkhanv7" target="_blank" rel="noreferrer">X (Twitter)</a></li>
              <li><a href="mailto:faiz@usemuse.dev">Email Me</a></li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="fb-main">
          {/* About */}
          <section id="about" className="fb-box">
            <div className="fb-box-header">
              <span className="fb-box-header-icon">👤</span>
              About Me
            </div>
            <div className="fb-box-body">
              <p>
                Hey, you found me! I'm <strong>Faiz Khan</strong>, 16 years old and already deep in the world
                of software development. I've always loved building and helping others out, so why not combine the two?
              </p>
              <br />
              <p>
                I'm a passionate developer who loves crafting web experiences, making fun projects,
                and most of all, <strong>helping others build</strong>. Whether that's through
                community platforms, open-source contributions, or just being available to help
                a fellow dev debug their first project.
              </p>
              <br />
              <p>
                Coding is truly fun when it actually <em>means</em> something to
                someone. At 16, I'm just getting started, and I'm building in public every step of the way.
              </p>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="fb-box">
            <div className="fb-box-header">
              <span className="fb-box-header-icon">🔨</span>
              Projects
            </div>
            <div className="fb-box-body fb-projects-grid">
              {PROJECTS.map(p => (
                <div className="fb-project-card" key={p.id}>
                  <div className="fb-project-title">{p.title}</div>
                  <div className="fb-project-desc">{p.description}</div>
                  <div className="fb-project-tags">
                    {p.tags.map(t => (
                      <span className="fb-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <a className="fb-project-link" href={p.link}>View Project →</a>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="fb-box">
            <div className="fb-box-header">
              <span className="fb-box-header-icon">⚡</span>
              Skills
            </div>
            <div className="fb-box-body">
              <div className="fb-skills-grid">
                {[
                  { name: 'JavaScript / TypeScript', level: 85 },
                  { name: 'React & Next.js', level: 80 },
                  { name: 'Node.js', level: 75 },
                  { name: 'CSS / Tailwind', level: 55 },
                  { name: 'MongoDB / Supabase', level: 70 },
                  { name: 'Community Building', level: 95 },
                ].map(skill => (
                  <div className="fb-skill-row" key={skill.name}>
                    <div className="fb-skill-label">{skill.name}</div>
                    <div className="fb-skill-bar">
                      <div
                        className="fb-skill-fill"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="fb-skill-pct">{skill.level}%</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="fb-box">
            <div className="fb-box-header">
              <span className="fb-box-header-icon">✉️</span>
              Contact
            </div>
            <div className="fb-box-body">
              <p style={{ marginBottom: '16px' }}>
                Want to collaborate, have a question, or just want to say hi? Drop me a message.
              </p>
              <form
                className="fb-contact-form"
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
                <div className="fb-form-row">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="fb-form-row">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="fb-form-row">
                  <label>Message</label>
                  <textarea
                    placeholder="What's on your mind?"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="fb-submit-btn">Send Message</button>
              </form>
            </div>
          </section>
        </main>

        {/* Right sidebar */}
        <aside className="fb-right-sidebar">
          <div className="fb-sidebar-box">
            <div className="fb-sidebar-section-title">Quick Stats</div>
            <ul className="fb-sidebar-list fb-stats">
              <li><span className="fb-stat-num">4</span> Projects</li>
              <li><span className="fb-stat-num">16</span> Years old</li>
              <li><span className="fb-stat-num">∞</span> Curiosity</li>
            </ul>
          </div>
          <div className="fb-sidebar-box">
            <div className="fb-sidebar-section-title">Currently Learning</div>
            <ul className="fb-sidebar-list">
              <li>Systems design</li>
              <li>Java</li>
              <li>DevOps / CI-CD</li>
              <li>AI</li>
            </ul>
          </div>
          <div className="fb-sidebar-box fb-fun-fact">
            <div className="fb-sidebar-section-title">Fun Fact</div>
            <p className="fb-fun-fact-text">
              I'm no coding prodigy, I'm pretty stupid.
            </p>
          </div>
          <MusicPlayer />
          <div className="fb-no-sue">🙏 Plz don't sue me</div>
        </aside>
      </div>

      <footer className="fb-footer">
        <span>Faiz Khan · {new Date().getFullYear()} · Built with React</span>
        <span>
          <a href="https://github.com/FaizKhanv7">GitHub</a> · <a href="https://www.linkedin.com/in/faiz-khan-6958b639a/">LinkedIn</a> · <a href="https://x.com/faizkhanv7" target="_blank" rel="noreferrer">X</a> · <a href="mailto:writetofaiz7@gmail.com">Email</a>
        </span>
      </footer>

      {/* Stalker popup */}
      {stalkerOpen && (
        <div className="fb-modal-overlay" onClick={() => setStalkerOpen(false)}>
          <div className="fb-modal" onClick={e => e.stopPropagation()}>
            <div className="fb-modal-header">
              <span>👥 Friends List</span>
              <button className="fb-modal-close" onClick={() => setStalkerOpen(false)}>✕</button>
            </div>
            <div className="fb-modal-body">
              <p>Haha, nice try stalker :)</p>
            </div>
            <div className="fb-modal-footer">
              <button className="fb-submit-btn" onClick={() => setStalkerOpen(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
