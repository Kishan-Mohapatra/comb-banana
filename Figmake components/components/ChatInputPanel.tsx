import { useState, useRef, useEffect } from 'react'
import svgPaths from '@/imports/ChatInput/svg-vgaswhc3os'

type Tool = 'wand' | 'circle' | 'cursor'

interface Chip {
  id: string
  name: string
  type: 'pdf' | 'image'
  color?: string
}

interface ChatInputPanelProps {
  dark: boolean
  onSend?: (text: string) => void
}

/* ─── PDF corner triangle ─────────────────────────────────────── */
function PdfCorner() {
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', left: 8, top: -6, width: 6, height: 6 }}>
      <div style={{ transform: 'rotate(180deg)' }}>
        <div style={{ position: 'relative', width: 6, height: 6 }}>
          <div style={{ position: 'absolute', bottom: '25%', left: '6.7%', right: '6.7%', top: 0 }}>
            <svg fill="none" height="4.5" preserveAspectRatio="none" viewBox="0 0 5.19615 4.5" width="5.19615" style={{ display: 'block', width: '100%', height: '100%' }}>
              <path d={svgPaths.p238fbe00} fill="#D4CFC7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── X close icon ────────────────────────────────────────────── */
function XCircle({ onClose, dark }: { onClose: () => void; dark: boolean }) {
  const stroke = dark ? '#a0a0a8' : '#636366'
  return (
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, flexShrink: 0 }}>
      <svg fill="none" height="10" viewBox="0 0 10 10" width="10" style={{ display: 'block' }}>
        <g clipPath="url(#xc)">
          <path d={svgPaths.pda51f00} stroke={stroke} strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs><clipPath id="xc"><rect fill="white" height="10" width="10" /></clipPath></defs>
      </svg>
    </button>
  )
}

/* ─── PDF chip ────────────────────────────────────────────────── */
function PdfChip({ name, onClose, dark }: { name: string; onClose: () => void; dark: boolean }) {
  const chipBg = dark ? '#2c2c2e' : '#ffffff'
  const chipBorder = dark ? 'rgba(255,255,255,0.12)' : '#e4e4e9'
  const textColor = dark ? '#f5f5f7' : '#111113'
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 16, background: chipBg, flexShrink: 0,
      border: `1px solid ${chipBorder}`,
    }}>
      {/* pdf icon container */}
      <div style={{ position: 'relative', width: 24, height: 26, flexShrink: 0 }}>
        <div style={{
          background: '#f2efe9', height: 26, width: 20, borderRadius: '2px 6px 2px 2px',
          position: 'relative', border: '1px solid #d4cfc7',
        }}>
          <PdfCorner />
          {/* PDF banner */}
          <div style={{
            position: 'absolute', top: 11, left: 1, width: 18, height: 10,
            background: '#e24c4c', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 6, color: '#fff', letterSpacing: 0 }}>PDF</span>
          </div>
        </div>
      </div>
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: textColor, whiteSpace: 'nowrap' }}>{name}</span>
      <XCircle onClose={onClose} dark={dark} />
    </div>
  )
}

/* ─── Image chip ──────────────────────────────────────────────── */
function ImageChip({ name, color, onClose, dark }: { name: string; color: string; onClose: () => void; dark: boolean }) {
  const chipBg = dark ? '#2c2c2e' : '#ffffff'
  const chipBorder = dark ? 'rgba(255,255,255,0.12)' : '#e4e4e9'
  const textColor = dark ? '#f5f5f7' : '#111113'
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 16, background: chipBg, flexShrink: 0,
      border: `1px solid ${chipBorder}`,
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 8, background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: textColor, whiteSpace: 'nowrap' }}>{name}</span>
      <XCircle onClose={onClose} dark={dark} />
    </div>
  )
}

/* ─── Segmented tool ──────────────────────────────────────────── */
function SegIcon({ d, active, dark }: { d: string; active: boolean; dark: boolean }) {
  const stroke = active ? (dark ? '#f5f5f7' : '#1c1c1e') : (dark ? '#636366' : '#8e8e93')
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18" style={{ display: 'block' }}>
      <g clipPath="url(#sg)">
        <path d={d} stroke={stroke} strokeLinecap="round" strokeWidth="2" />
      </g>
      <defs><clipPath id="sg"><rect fill="white" height="18" width="18" /></clipPath></defs>
    </svg>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
export default function ChatInputPanel({ dark, onSend }: ChatInputPanelProps) {
  const [chips, setChips] = useState<Chip[]>([
    { id: 'pdf1', name: 'brief.pdf', type: 'pdf' },
    { id: 'img1', name: 'cloud.png', type: 'image', color: '#87c5f8' },
  ])
  const [activeTool, setActiveTool] = useState<Tool>('wand')
  const [inputText, setInputText] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)

  /* auto-grow textarea */
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto'
      textRef.current.style.height = textRef.current.scrollHeight + 'px'
    }
  }, [inputText])

  const removeChip = (id: string) => setChips(c => c.filter(ch => ch.id !== id))

  const handleSend = () => {
    if (inputText.trim() && onSend) {
      onSend(inputText.trim())
      setInputText('')
    }
  }

  /* ── derived colors ── */
  const outerBg    = dark ? '#1c1c1e'              : '#f5f5f7'
  const outerBorder = dark ? 'rgba(255,255,255,0.08)' : '#e4e4e9'
  const innerBg    = dark ? '#2c2c2e'              : '#ffffff'
  const innerBorder = dark ? 'rgba(255,255,255,0.06)' : 'transparent'
  const textMain   = dark ? '#f5f5f7'              : '#111113'
  const textPlaceholder = dark ? '#636366'         : '#8e8e93'
  const segBg      = dark ? '#3a3a3c'              : '#f4f4f6'
  const segActiveBg = dark ? '#4a4a4e'             : '#ffffff'
  const segActiveShadow = dark ? 'none'            : '0px 2px 2px rgba(0,0,0,0.04)'
  const modelBg    = dark ? '#2c2c2e'              : '#ffffff'
  const modelBorder = dark ? 'rgba(255,255,255,0.1)' : '#e4e4e9'
  const addBtnBg   = dark ? '#2c2c2e'              : '#ffffff'
  const addBtnBorder = dark ? 'rgba(255,255,255,0.1)' : '#e4e4e9'
  const voiceBg    = dark ? '#f5f5f7'              : '#111111'
  const voiceBar   = dark ? '#111111'              : '#ffffff'

  const tools: { key: Tool; d: string }[] = [
    { key: 'wand',   d: svgPaths.p36692280 },
    { key: 'circle', d: svgPaths.p44fa100 },
    { key: 'cursor', d: svgPaths.p1c0f6080 },
  ]

  return (
    <div style={{
      position: 'relative', borderRadius: 36, background: outerBg,
      border: `1px solid ${outerBorder}`,
      boxShadow: '0px 4px 8px rgba(0,0,0,0.03)',
      width: '100%',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>

        {/* ── attachment chips row ── */}
        {chips.length > 0 && (
          <div style={{ display: 'flex', gap: 8, padding: '8px 12px 4px', flexWrap: 'wrap' }}>
            {chips.map(chip => chip.type === 'pdf'
              ? <PdfChip key={chip.id} name={chip.name} dark={dark} onClose={() => removeChip(chip.id)} />
              : <ImageChip key={chip.id} name={chip.name} color={chip.color!} dark={dark} onClose={() => removeChip(chip.id)} />
            )}
          </div>
        )}

        {/* ── inner card ── */}
        <div style={{
          background: innerBg, borderRadius: 28,
          border: `1px solid ${innerBorder}`,
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36, padding: '28px 24px 20px' }}>

            {/* text input */}
            <textarea
              ref={textRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend() }}
              placeholder="Ask Leo AI anything…"
              rows={1}
              style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 500,
                fontSize: 'clamp(16px, 2vw, 24px)', lineHeight: '32px',
                letterSpacing: '-0.5px', color: inputText ? textMain : textPlaceholder,
                background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                width: '100%', minHeight: 32, overflow: 'hidden',
              }}
            />

            {/* toolbar row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>

              {/* left group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

                {/* add-doc button */}
                <button style={{
                  width: 48, height: 48, borderRadius: 16, background: addBtnBg,
                  border: `1px solid ${addBtnBorder}`, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'opacity 0.14s',
                }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  title="Add document"
                  onClick={() => setChips(c => [...c, { id: Date.now().toString(), name: 'doc.pdf', type: 'pdf' }])}
                >
                  <svg fill="none" height="22" viewBox="0 0 22 22" width="22" style={{ display: 'block' }}>
                    <g>
                      <path d={svgPaths.p199b5dc0} stroke={textMain} strokeLinecap="round" strokeWidth="2" />
                    </g>
                  </svg>
                </button>

                {/* segmented tool panel */}
                <div style={{
                  display: 'flex', gap: 4, padding: 4, borderRadius: 16,
                  background: segBg, flexShrink: 0,
                }}>
                  {tools.map(({ key, d }) => (
                    <button key={key} onClick={() => setActiveTool(key)} style={{
                      width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: activeTool === key ? segActiveBg : 'transparent',
                      boxShadow: activeTool === key ? segActiveShadow : 'none',
                      transition: 'all 0.14s',
                    }}>
                      <SegIcon d={d} active={activeTool === key} dark={dark} />
                    </button>
                  ))}
                </div>

                {/* model selector */}
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 16, background: modelBg,
                  border: `1px solid ${modelBorder}`, cursor: 'pointer', flexShrink: 0,
                  transition: 'opacity 0.14s',
                }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >
                  <svg fill="none" height="20" viewBox="0 0 20 20" width="20" style={{ display: 'block' }}>
                    <path d={svgPaths.p398bca00} stroke={textMain} strokeLinecap="round" strokeWidth="2" />
                  </svg>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15,
                    color: textMain, whiteSpace: 'nowrap',
                  }}>GPT 5.0</span>
                </button>
              </div>

              {/* voice / send button */}
              <button onClick={handleSend} style={{
                width: 48, height: 48, borderRadius: 16, background: voiceBg, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'opacity 0.14s',
              }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                title="Send (⌘↵)"
              >
                <div style={{ display: 'flex', gap: 3, height: 20, alignItems: 'center' }}>
                  {[12, 18, 8, 16, 10].map((h, i) => (
                    <div key={i} style={{
                      width: 2.5, height: h, borderRadius: 1.5,
                      background: voiceBar,
                    }} />
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
