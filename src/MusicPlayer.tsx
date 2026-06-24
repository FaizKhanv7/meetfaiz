import { useAudio } from './AudioContext'
import './MusicPlayer.css'

export interface Track {
  title: string
  artist: string
  src: string
}

// ─── ADD YOUR TRACKS HERE ─────────────────────────────────────────────────────
// Drop MP3 files into /public/music/ and reference them like:
//   src: '/music/song.mp3'
// ─────────────────────────────────────────────────────────────────────────────
export const TRACKS: Track[] = [
  { title: 'White Keys', artist: 'Dominic Fike', src: '/music/whitekeys.mp3' },
  { title: 'Empty Out Your Pockets', artist: 'Juice WRLD', src: '/music/emptyoutyourpockets.mp3' },
  { title: 'WE ON GO', artist: 'BIA', src: '/music/weongo.mp3' },
]

function formatTime(secs: number) {
  if (!isFinite(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicPlayer() {
  const {
    tracks,
    trackIndex,
    isPlaying,
    currentTime,
    duration,
    progressPct,
    toggle,
    goNext,
    goPrev,
    seekTo,
    jumpTo,
  } = useAudio()

  const track = tracks[trackIndex]

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    seekTo(Number(e.target.value))
  }

  return (
    <div className="mp-box fb-sidebar-box">
      <div className="mp-header">
        <span className="mp-note">♫</span>
        <span className="mp-header-title">Now Playing</span>
      </div>

      <div className="mp-track-info">
        <div className="mp-disc" aria-hidden="true">
          <div className={`mp-disc-inner ${isPlaying ? 'mp-disc-spin' : ''}`}>♪</div>
        </div>
        <div className="mp-meta">
          <div className="mp-song-title" title={track.title}>{track.title}</div>
          <div className="mp-song-artist">{track.artist}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mp-progress-wrap">
        <span className="mp-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="mp-seek"
          min={0}
          max={duration || 100}
          step={0.5}
          value={currentTime}
          onChange={handleSeekChange}
          style={{ '--progress': `${progressPct}%` } as React.CSSProperties}
          aria-label="Seek"
        />
        <span className="mp-time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="mp-controls">
        <button className="mp-btn mp-btn-skip" onClick={goPrev} aria-label="Previous track">◄◄</button>
        <button className="mp-btn mp-btn-play" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="mp-btn mp-btn-skip" onClick={goNext} aria-label="Next track">►►</button>
      </div>

      {/* Track list */}
      <div className="mp-tracklist">
        {tracks.map((t, i) => (
          <button
            key={i}
            className={`mp-track-item ${i === trackIndex ? 'mp-track-item--active' : ''}`}
            onClick={() => jumpTo(i)}
          >
            <span className="mp-track-num">{i + 1}.</span>
            <span className="mp-track-name">{t.title}</span>
            {i === trackIndex && isPlaying && (
              <span className="mp-eq" aria-hidden="true">
                <span className="mp-eq-bar" />
                <span className="mp-eq-bar" />
                <span className="mp-eq-bar" />
                <span className="mp-eq-bar" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
