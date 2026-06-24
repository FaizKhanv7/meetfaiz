import { useState } from 'react'
import { useAudio } from './AudioContext'
import './ModernPlayer.css'

function formatTime(secs: number) {
  if (!isFinite(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ModernPlayer() {
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

  const [collapsed, setCollapsed] = useState(false)
  const track = tracks[trackIndex]

  return (
    <div className={`msp-root ${collapsed ? 'msp-root--collapsed' : ''}`}>
      {/* Header bar — always visible */}
      <div className="msp-header">
        <div className="msp-header-left">
          {/* Tiny vinyl */}
          <div className="msp-mini-art">
            <div className={`msp-mini-vinyl ${isPlaying ? 'msp-vinyl-spin' : ''}`}>
              <div className="msp-vinyl-hole" />
            </div>
          </div>
          <div className="msp-header-meta">
            <span className="msp-title">{track.title}</span>
            <span className="msp-artist">{track.artist}</span>
          </div>
        </div>
        <div className="msp-header-right">
          {/* Inline play/pause in header */}
          <button className="msp-btn msp-btn-play-sm" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M6 19h4V5H6zm8-14v14h4V5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button
            className="msp-btn msp-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand player' : 'Collapse player'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="14"
              height="14"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            >
              <path d="M7 14l5-5 5 5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable body */}
      <div className="msp-body">
        {/* Seek bar */}
        <div className="msp-progress-wrap">
          <span className="msp-time">{formatTime(currentTime)}</span>
          <div className="msp-track-bg">
            <div className="msp-track-fill" style={{ width: `${progressPct}%` }} />
            <input
              type="range"
              className="msp-seek"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={e => seekTo(Number(e.target.value))}
              aria-label="Seek"
            />
          </div>
          <span className="msp-time">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="msp-controls">
          <button className="msp-btn msp-btn-skip" onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>
          <button className="msp-btn msp-btn-play" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M6 19h4V5H6zm8-14v14h4V5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button className="msp-btn msp-btn-skip" onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>

        {/* EQ bars */}
        {isPlaying && (
          <div className="msp-eq" aria-hidden="true">
            <span className="msp-eq-bar" />
            <span className="msp-eq-bar" />
            <span className="msp-eq-bar" />
            <span className="msp-eq-bar" />
            <span className="msp-eq-bar" />
          </div>
        )}

        {/* Track list */}
        <div className="msp-tracklist">
          {tracks.map((t, i) => (
            <button
              key={i}
              className={`msp-track-item ${i === trackIndex ? 'msp-track-item--active' : ''}`}
              onClick={() => jumpTo(i)}
            >
              <span className="msp-track-num">{i + 1}</span>
              <span className="msp-track-name">{t.title}</span>
              <span className="msp-track-artist">{t.artist}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
