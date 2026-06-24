import { useState } from 'react'
import LoadingScreen from './LoadingScreen'
import OldFacebook from './OldFacebook'
import ModernSite from './ModernSite'
import TransitionScreen from './TransitionScreen'
import { AudioProvider } from './AudioContext'

type Phase =
  | 'loading'       // initial ASCII loading screen
  | 'classic'       // old facebook portfolio
  | 'transitioning' // build animation
  | 'modern'        // modern metallic portfolio
  | 'reverting'     // build animation back

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')

  return (
    <AudioProvider>
      {phase === 'loading' && (
        <LoadingScreen onDone={() => setPhase('classic')} />
      )}

      {phase === 'classic' && (
        <OldFacebook onModernize={() => setPhase('transitioning')} />
      )}

      {phase === 'transitioning' && (
        <TransitionScreen
          direction="modernize"
          onDone={() => setPhase('modern')}
        />
      )}

      {phase === 'modern' && (
        <ModernSite onRevert={() => setPhase('reverting')} />
      )}

      {phase === 'reverting' && (
        <TransitionScreen
          direction="revert"
          onDone={() => setPhase('classic')}
        />
      )}
    </AudioProvider>
  )
}
