import { useEffect, useState } from 'react'
import './LoadingScreen.css'

const ASCII_NAME = `
  ███████╗ █████╗ ██╗███████╗    ██╗  ██╗██╗  ██╗ █████╗ ███╗   ██╗
  ██╔════╝██╔══██╗██║╚══███╔╝    ██║ ██╔╝██║  ██║██╔══██╗████╗  ██║
  █████╗  ███████║██║  ███╔╝     █████╔╝ ███████║███████║██╔██╗ ██║
  ██╔══╝  ██╔══██║██║ ███╔╝      ██╔═██╗ ██╔══██║██╔══██║██║╚██╗██║
  ██║     ██║  ██║██║███████╗    ██║  ██╗██║  ██║██║  ██║██║ ╚████║
  ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`

const SPINNER_FRAMES = ['/', '|', '\\', '-']

interface LoadingScreenProps {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [frame, setFrame] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Initializing...')
  const [fadeOut, setFadeOut] = useState(false)

  const STATUS_MESSAGES = [
    'Initializing...',
    'Loading profile...',
    'Fetching projects...',
    'Building connections...',
    'Almost ready...',
    'Welcome.',
  ]

  useEffect(() => {
    const spinInterval = setInterval(() => {
      setFrame(f => (f + 1) % SPINNER_FRAMES.length)
    }, 120)
    return () => clearInterval(spinInterval)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + 2
      })
    }, 40)
    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    const idx = Math.floor((progress / 100) * (STATUS_MESSAGES.length - 1))
    setStatus(STATUS_MESSAGES[Math.min(idx, STATUS_MESSAGES.length - 1)])
  }, [progress])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(onDone, 600)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [progress, onDone])

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-inner">
        <pre className="ascii-name">{ASCII_NAME}</pre>
        <div className="loading-status-row">
          <span className="spinner">{SPINNER_FRAMES[frame]}</span>
          <span className="status-text">{status}</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-label">{progress}%</div>
      </div>
    </div>
  )
}
