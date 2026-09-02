import { useState, useRef, useEffect } from 'react'
import { D, Icon } from '@/lib/icons'
import { CHIPS } from '@/lib/data'

function ToolBtn({ d, size = 16, stroke, title, onClick }: {
  d: string; size?: number; stroke: string; title?: string; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.7, transition:'opacity 0.12s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
    >
      <Icon d={d} size={size} stroke={stroke} sw={1.5} />
    </button>
  )
}

export default function AiPromptInput({ dark, onSend }: { dark: boolean; onSend: (t: string) => void }) {
  const [val, setVal] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = taRef.current.scrollHeight + 'px'
    }
  }, [val])

  const cardBg  = dark ? '#1e1e20' : '#ffffff'
  const cardBdr = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const topBdr  = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const txt     = dark ? '#f0ede8' : '#111113'
  const muted   = dark ? '#888680' : '#8e8e93'
  const dim     = dark ? '#555250' : '#c5c2bc'
  const divBdr  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'

  const send = () => { if (val.trim()) { onSend(val.trim()); setVal('') } }

  return (
    <div>
      {/* Card */}
      <div style={{
        background: cardBg,
        border: `1px solid ${cardBdr}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {/* Top model bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:`1px solid ${topBdr}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, paddingRight:14 }}>
              <Icon d={D.atom} size={15} stroke={muted} sw={1.4} />
              <span style={{ fontSize:13, fontWeight:600, color:txt, fontFamily:'var(--font-sans)' }}>Leo AI</span>
            </div>
            <div style={{ width:1, height:16, background:divBdr, marginRight:14 }} />
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Icon d={D.person} size={14} stroke={muted} sw={1.4} />
              <span style={{ fontSize:13, color:muted, fontFamily:'var(--font-sans)' }}>CRM Agent</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <ToolBtn d={D.sliders} size={15} stroke={muted} title="Settings" />
            <ToolBtn d={D.clock} size={15} stroke={muted} title="History" />
          </div>
        </div>

        {/* Textarea */}
        <div style={{ position:'relative', padding:'14px 14px 0' }}>
          <textarea
            ref={taRef}
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
            placeholder="Ask anything, @models, /prompts …"
            rows={2}
            style={{
              width:'100%', background:'transparent', border:'none', outline:'none', resize:'none', overflow:'hidden',
              color: val ? txt : muted, fontSize:14, lineHeight:1.6,
              fontFamily:'var(--font-sans)', minHeight:48,
            }}
          />
          <button
            title="Expand"
            style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer', opacity:0.5, display:'flex', transition:'opacity 0.12s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.5'}
          >
            <Icon d={D.expand} size={15} stroke="#7c3aed" sw={1.8} />
          </button>
        </div>

        {/* Bottom toolbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 10px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:0 }}>
            <ToolBtn d="M12 5v14M5 12h14" size={15} stroke={muted} title="Attach" />
            <div style={{ width:1, height:14, background:divBdr, margin:'0 4px' }} />
            <ToolBtn d={D.wand}   size={15} stroke={muted} title="AI tools" />
            <ToolBtn d={D.spread} size={15} stroke={muted} title="Expand" />
            <ToolBtn d={D.globe}  size={15} stroke={muted} title="Web search" />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <ToolBtn d={D.target} size={15} stroke={muted} title="Focus mode" />
            <button
              onClick={send}
              title="Send (⌘↵)"
              style={{
                width:32, height:32, borderRadius:9, border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                background: val.trim() ? '#3b82f6' : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'),
                transition:'background 0.15s',
              }}
            >
              <Icon d={D.send} size={13} stroke={val.trim() ? '#fff' : muted} sw={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingTop:10, scrollbarWidth:'none' }}>
        {CHIPS.map(c => (
          <button
            key={c.label}
            onClick={() => onSend(c.label)}
            style={{
              whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6,
              padding:'5px 12px', borderRadius:20,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              color: dark ? '#bbb8b2' : '#555', fontSize:12, cursor:'pointer', flexShrink:0, transition:'all 0.12s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = c.color
              ;(e.currentTarget as HTMLElement).style.color = c.color
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
              ;(e.currentTarget as HTMLElement).style.color = dark ? '#bbb8b2' : '#555'
            }}
          >
            <span style={{ width:6, height:6, borderRadius:'50%', background:c.color, flexShrink:0, display:'inline-block' }} />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
