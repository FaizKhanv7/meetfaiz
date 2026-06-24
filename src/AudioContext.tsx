import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { TRACKS, type Track } from './MusicPlayer'

interface AudioContextValue {
  tracks: Track[]
  trackIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  progressPct: number
  play: () => void
  pause: () => void
  toggle: () => void
  goNext: () => void
  goPrev: () => void
  seekTo: (t: number) => void
  jumpTo: (i: number) => void
}

const Ctx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio())
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Load track when index changes
  useEffect(() => {
    const audio = audioRef.current
    audio.src = TRACKS[trackIndex].src
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [trackIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd = () => {
      setTrackIndex(i => (i + 1) % TRACKS.length)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const toggle = useCallback(() => setIsPlaying(p => !p), [])

  const goNext = useCallback(() => {
    setTrackIndex(i => (i + 1) % TRACKS.length)
  }, [])

  const goPrev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    } else {
      setTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length)
    }
  }, [])

  const seekTo = useCallback((t: number) => {
    audioRef.current.currentTime = t
    setCurrentTime(t)
  }, [])

  const jumpTo = useCallback((i: number) => {
    setTrackIndex(i)
    setIsPlaying(true)
  }, [])

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Ctx.Provider
      value={{
        tracks: TRACKS,
        trackIndex,
        isPlaying,
        currentTime,
        duration,
        progressPct,
        play,
        pause,
        toggle,
        goNext,
        goPrev,
        seekTo,
        jumpTo,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
  return ctx
}
