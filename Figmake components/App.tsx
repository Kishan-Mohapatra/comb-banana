import { useState } from 'react'
import CommandCentre from './components/CommandCentre'

export default function App() {
  const [dark, setDark] = useState(true)
  return <CommandCentre dark={dark} onToggleDark={() => setDark(d => !d)} />
}
