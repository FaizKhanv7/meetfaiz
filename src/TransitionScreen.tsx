import { useEffect, useRef, useState } from 'react'
import './TransitionScreen.css'

interface TransitionScreenProps {
  onDone: () => void
  direction: 'modernize' | 'revert'
}

// ── MODERNIZE: AI-agent steps (shimmer + swap) ─────────────────────────────
const STEPS_MODERN = [
  { label: 'Analysed design system',        thinking: 'Analysing design system…'        },
  { label: 'Resolved component tree',       thinking: 'Resolving component tree…'       },
  { label: 'Applied typographic scale',     thinking: 'Applying typographic scale…'     },
  { label: 'Compiled motion primitives',    thinking: 'Compiling motion primitives…'    },
  { label: 'Injected colour tokens',        thinking: 'Injecting colour tokens…'        },
  { label: 'Hydrated interactive states',   thinking: 'Hydrating interactive states…'   },
  { label: 'Verified accessibility tree',   thinking: 'Verifying accessibility tree…'   },
  { label: 'Built production bundle',       thinking: 'Building production bundle…'     },
]

// ── REVERT: original plain log lines ──────────────────────────────────────
const STEPS_REVERT = [
  '▓░░░░░░░░░  Loading modern styles...',
  '▓▓▓░░░░░░░  Removing the clutter...',
  '▓▓▓▓▓░░░░░  Adding gradients...',
  '▓▓▓▓▓▓░░░░  Applying modern palette...',
  '▓▓▓▓▓▓▓▓░░  Talking with a robot...',
  '▓▓▓▓▓▓▓▓▓▓  Done. Enjoy :)',
]

const STEP_DURATION_MODERN = 420
const STEP_DURATION_REVERT = 280

// ── Shimmer span ──────────────────────────────────────────────────────────
function Shimmer({ text }: { text: string }) {
  return (
    <span className="ts-shimmer" data-text={text}>
      {text}
    </span>
  )
}

// ── Swap-animated completed task line ─────────────────────────────────────
function SwapLine({ text, entryKey }: { text: string; entryKey: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('ts-swap-enter-start')
    void el.offsetHeight
    el.classList.remove('ts-swap-enter-start')
  }, [entryKey])

  return (
    <div ref={ref} className="ts-swap-line">
      <span className="ts-check">✓</span>
      <span>{text}</span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MODERNIZE screen — AI agent style
// ══════════════════════════════════════════════════════════════════════════
function ModernizeScreen({ onDone }: { onDone: () => void }) {
  const [completed, setCompleted] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (completed >= STEPS_MODERN.length) {
      setIsDone(true)
      const t = setTimeout(() => {
        setFadeOut(true)
        setTimeout(onDone, 500)
      }, 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCompleted(c => c + 1), STEP_DURATION_MODERN)
    return () => clearTimeout(t)
  }, [completed, onDone])

  const activeStep = completed < STEPS_MODERN.length ? STEPS_MODERN[completed] : null

  return (
    <div className={`ts-root ts-modern ${fadeOut ? 'ts-fadeout' : ''}`}>
      <div className="ts-grid" aria-hidden="true" />
      <div className="ts-panel">

        <div className="ts-header">
          <div className="ts-header-dot" />
          <span className="ts-header-label">faiz.build / restore</span>
        </div>

        <div className="ts-status-wrap">
          {isDone ? (
            <span className="ts-done-text">Ready.</span>
          ) : activeStep ? (
            <Shimmer text={activeStep.thinking} />
          ) : null}
        </div>

        <div className="ts-log" aria-live="polite">
          {Array.from({ length: completed }, (_, i) => (
            <SwapLine key={i} text={STEPS_MODERN[i].label} entryKey={i} />
          ))}
        </div>

        <div className="ts-bar-track">
          <div
            className="ts-bar-fill"
            style={{ width: `${isDone ? 100 : (completed / STEPS_MODERN.length) * 100}%` }}
          />
        </div>

        <div className="ts-counter">
          {isDone ? `${STEPS_MODERN.length} / ${STEPS_MODERN.length}` : `${completed} / ${STEPS_MODERN.length}`}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// REVERT screen — original retro log style
// ══════════════════════════════════════════════════════════════════════════
function RevertScreen({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const [blocks] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 90,
      y: Math.random() * 90,
      w: 4 + Math.random() * 10,
      h: 2 + Math.random() * 6,
      delay: i * 0.12,
    }))
  )

  useEffect(() => {
    if (stepIndex >= STEPS_REVERT.length) {
      setDone(true)
      const t = setTimeout(() => {
        setFadeOut(true)
        setTimeout(onDone, 500)
      }, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStepIndex(s => s + 1), STEP_DURATION_REVERT)
    return () => clearTimeout(t)
  }, [stepIndex, onDone])

  return (
    <div className={`ts-root ts-classic ${fadeOut ? 'ts-fadeout' : ''}`}>
      <div className="ts-blocks">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="ts-block"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="ts-inner">
        <div className="ts-icon">⌘</div>
        <div className="ts-title">Modernizing The Site</div>
        <div className="ts-old-log">
          {STEPS_REVERT.slice(0, stepIndex).map((s, i) => (
            <div
              key={i}
              className={`ts-log-line ${i === stepIndex - 1 ? 'ts-log-line--active' : 'ts-log-line--done'}`}
            >
              {s}
            </div>
          ))}
        </div>
        {done && <div className="ts-complete">✔ Finished</div>}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ROUTER
// retro → modern  =  show the old retro log screen
// modern → retro  =  show the new AI-agent screen
// ══════════════════════════════════════════════════════════════════════════
export default function TransitionScreen({ onDone, direction }: TransitionScreenProps) {
  if (direction === 'modernize') return <RevertScreen onDone={onDone} />
  return <ModernizeScreen onDone={onDone} />
}
