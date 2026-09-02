import { useState, useRef, useEffect } from 'react'
import { D, Icon } from '@/lib/icons'
import { GH_USER, NAV, FOCUS, R_STATS, LIVE, TODOS, H_HOURS, H_EVENTS, NOW_H } from '@/lib/data'
import AiPromptInput from './AiPromptInput'

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Av({ name, src, size = 28, bg = '#f59e0b' }: { name: string; src?: string; size?: number; bg?: string }) {
  const [imgErr, setImgErr] = useState(false)
  if (src && !imgErr) {
    return <img src={src} onError={() => setImgErr(true)} alt={name} style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, objectFit:'cover' }} />
  }
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size * 0.36, fontWeight:700, color:'#0a0a0a', fontFamily:'var(--font-mono)' }}>
      {name[0]}
    </div>
  )
}

/* ─── Horizontal Calendar ────────────────────────────────────────── */
function HCal({ dark }: { dark: boolean }) {
  const cellW  = 64
  const totalW = H_HOURS.length * cellW
  const pxOf   = (h: number) => (h - H_HOURS[0]) * cellW
  const bc     = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  return (
    <div style={{ overflowX:'auto', fontSize:10 }}>
      <div style={{ display:'flex', marginLeft:40, width:totalW, flexShrink:0, paddingBottom:3 }}>
        {H_HOURS.map(h => (
          <div key={h} style={{ width:cellW, flexShrink:0, color:h === 10 ? 'var(--accent)' : 'var(--text-dim)', fontFamily:'var(--font-mono)' }}>
            {h === 12 ? '12P' : h > 12 ? `${h - 12}P` : `${h}A`}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center' }}>
        <div style={{ width:40, flexShrink:0 }}>
          <div style={{ fontSize:8, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.04em' }}>THU</div>
          <div style={{ fontWeight:700, fontSize:13, fontFamily:'var(--font-mono)' }}>31</div>
        </div>
        <div style={{ position:'relative', height:44, width:totalW, flexShrink:0, borderTop:`1px solid ${bc}` }}>
          {H_EVENTS.map(ev => (
            <div key={ev.title} style={{
              position:'absolute', top:2, height:40,
              left:pxOf(ev.s), width:(ev.e - ev.s) * cellW - 2,
              background: ev.color + '22', borderLeft:`2px solid ${ev.color}`,
              borderRadius:'0 4px 4px 0', padding:'2px 4px',
              color:ev.color, fontWeight:500, fontSize:9, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>
              {ev.title}
            </div>
          ))}
          <div style={{ position:'absolute', top:0, bottom:0, left:pxOf(NOW_H), width:1, background:'#ef4444', opacity:0.9 }}>
            <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%) translateX(-50%)', background:'#ef4444', color:'#fff', fontSize:8, fontWeight:700, padding:'1px 4px', borderRadius:3, whiteSpace:'nowrap', fontFamily:'var(--font-mono)' }}>
              10:15 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── ToolBtn ────────────────────────────────────────────────────── */
function ToolBtn({ d, size = 16, stroke, title, onClick }: { d: string; size?: number; stroke: string; title?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} title={title} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.7, transition:'opacity 0.12s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
    >
      <Icon d={d} size={size} stroke={stroke} sw={1.5} />
    </button>
  )
}

/* ─── Analytics Panel ────────────────────────────────────────────── */
type TodoItem = typeof TODOS[number]

function AnalyticsPanel({ dark, open, onToggle, todos, toggleTodo, calTab, setCalTab }: {
  dark: boolean; open: boolean; onToggle: () => void
  todos: TodoItem[]; toggleTodo: (id: number) => void
  calTab: string; setCalTab: (v: 'Day' | 'Week' | 'Month') => void
}) {
  const sur   = dark ? '#141414' : '#ffffff'
  const sur2  = dark ? '#1c1c1c' : '#f0ede8'
  const bdr   = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const bdrS  = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const txt   = dark ? '#f0ede8' : '#1a1814'
  const muted = dark ? '#888680' : '#7a7570'
  const dim   = dark ? '#555250' : '#c5c2bc'
  const acc   = '#f59e0b'

  return (
    <div style={{
      width: open ? 380 : 60, flexShrink:0,
      borderLeft:`1px solid ${bdr}`, background:sur,
      transition:'width 0.26s cubic-bezier(0.4,0,0.2,1)',
      overflow:'hidden', display:'flex', flexDirection:'column',
    }}>
      {/* Collapsed */}
      {!open && (
        <button onClick={onToggle} title="Open Analytics" style={{
          width:60, flex:1, background:'transparent', border:'none', cursor:'pointer',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
          color:muted, transition:'color 0.14s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = acc}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = muted}
        >
          <Icon d={D.chart} size={17} stroke="currentColor" />
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', writingMode:'vertical-rl', transform:'rotate(180deg)', whiteSpace:'nowrap' }}>Analytics</span>
          <Icon d={D.chevL} size={13} stroke="currentColor" />
        </button>
      )}

      {/* Expanded */}
      {open && (
        <div style={{ width:380, display:'flex', flexDirection:'column', height:'100%', overflowY:'auto' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${bdr}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <Icon d={D.chart} size={14} stroke={acc} />
              <span style={{ fontWeight:600, fontSize:12, color:txt, letterSpacing:'0.01em' }}>Analytics</span>
            </div>
            <button onClick={onToggle} title="Collapse" style={{ background:'none', border:'none', cursor:'pointer', color:muted, display:'flex', padding:2, borderRadius:4, transition:'color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = txt}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = muted}
            >
              <Icon d={D.chevR} size={14} stroke="currentColor" />
            </button>
          </div>

          {/* Stats 2×2 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${bdr}`, flexShrink:0 }}>
            {R_STATS.map((st, i) => (
              <div key={st.label} style={{ padding:'13px 14px 11px', borderRight:i%2===0?`1px solid ${bdr}`:'none', borderBottom:i<2?`1px solid ${bdr}`:'none' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:st.color }} />
                    <span style={{ fontSize:10, color:muted, fontWeight:500 }}>{st.label}</span>
                  </div>
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:dim, fontSize:13, lineHeight:1, padding:'0 1px' }}>⋮</button>
                </div>
                <div style={{ fontSize:20, fontWeight:700, fontFamily:'var(--font-mono)', letterSpacing:'-0.03em', color:txt, lineHeight:1, marginBottom:3 }}>{st.value}</div>
                <span style={{ fontSize:10, color:muted }}>{st.sub}</span>
              </div>
            ))}
          </div>

          {/* Live Feed */}
          <div style={{ padding:'13px 15px', borderBottom:`1px solid ${bdr}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontWeight:600, fontSize:11, color:txt }}>Live Feed</span>
              <button style={{ fontSize:10, color:acc, background:'none', border:'none', cursor:'pointer' }}>View all</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {LIVE.map((l, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:l.dot, flexShrink:0 }} />
                  <span style={{ flex:1, fontSize:11, color:txt, lineHeight:1.4 }}>{l.text}</span>
                  <span style={{ fontSize:9, color:dim, fontFamily:'var(--font-mono)', flexShrink:0 }}>{l.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div style={{ padding:'13px 15px', borderBottom:`1px solid ${bdr}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.06em', color:muted, textTransform:'uppercase' }}>Today's Tasks</span>
              <button style={{ fontSize:10, color:acc, background:'none', border:'none', cursor:'pointer' }}>+ New</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {todos.map(t => (
                <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                  <button onClick={() => toggleTodo(t.id)} style={{
                    width:14, height:14, borderRadius:4, border:`1.5px solid ${t.done ? acc : bdrS}`,
                    background:t.done ? acc : 'transparent', flexShrink:0, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', marginTop:1,
                  }}>
                    {t.done && <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, color:t.done ? dim : txt, textDecoration:t.done ? 'line-through' : 'none', lineHeight:1.35 }}>{t.text}</div>
                    <div style={{ display:'flex', gap:4, marginTop:2 }}>
                      <span style={{ fontSize:8, fontWeight:700, letterSpacing:'0.05em', background:t.tagC + '22', color:t.tagC, padding:'1px 4px', borderRadius:3 }}>{t.tag}</span>
                      <span style={{ fontSize:8, color:dim, fontFamily:'var(--font-mono)' }}>{t.when}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div style={{ padding:'13px 15px 15px', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:9 }}>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:muted, padding:2, display:'flex', borderRadius:3, transition:'color 0.12s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = acc}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = muted}
                title="Today"
              >
                <Icon d={D.home} size={12} stroke="currentColor" />
              </button>
              <div style={{ display:'flex', background:sur2, borderRadius:5, padding:2, gap:1 }}>
                {(['Day','Week','Month'] as const).map(v => (
                  <button key={v} onClick={() => setCalTab(v)} style={{
                    padding:'2px 8px', borderRadius:4, border:'none', cursor:'pointer', fontSize:10,
                    background:calTab === v ? acc : 'transparent', color:calTab === v ? '#0a0a0a' : muted,
                    fontWeight:calTab === v ? 600 : 400, transition:'all 0.14s',
                  }}>{v}</button>
                ))}
              </div>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:muted, display:'flex' }}><Icon d={D.chevL} size={11} stroke={muted} /></button>
              <span style={{ fontSize:11, fontWeight:600, color:txt, whiteSpace:'nowrap' }}>Jul 31, 2025</span>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:muted, display:'flex' }}><Icon d={D.chevR} size={11} stroke={muted} /></button>
            </div>
            <HCal dark={dark} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── CommandCentre ──────────────────────────────────────────────── */
export default function CommandCentre({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [sideCollapsed,  setSideCollapsed]  = useState(false)
  const [analyticsOpen,  setAnalyticsOpen]  = useState(false)
  const [calTab,         setCalTab]         = useState<'Day' | 'Week' | 'Month'>('Day')
  const [todos,          setTodos]          = useState(TODOS)
  const [chat,           setChat]           = useState<{ role: 'user' | 'ai'; text: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat])

  const sendMsg    = (t: string) => {
    if (!t.trim()) return
    setChat(h => [...h, { role:'user', text:t }, { role:'ai', text:`Here's what I found for "${t}" — pulling live data from your CRM pipeline.` }])
  }
  const toggleTodo = (id: number) => setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const sideW = sideCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)'
  const sur   = dark ? '#141414' : '#ffffff'
  const sur2  = dark ? '#1c1c1c' : '#f0ede8'
  const bdr   = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const txt   = dark ? '#f0ede8' : '#1a1814'
  const muted = dark ? '#888680' : '#7a7570'
  const dim   = dark ? '#555250' : '#c5c2bc'
  const acc   = '#f59e0b'
  const hasChat = chat.length > 0

  return (
    <div className={dark ? '' : 'light'} style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)', color:txt, fontFamily:'var(--font-sans)' }}>

      {/* ══ Sidebar ══════════════════════════════════════════════ */}
      <aside style={{ width:sideW, flexShrink:0, overflow:'hidden', background:sur, borderRight:`1px solid ${bdr}`, display:'flex', flexDirection:'column', transition:'width 0.22s cubic-bezier(0.4,0,0.2,1)', zIndex:10 }}>
        {/* Logo */}
        <div style={{ height:52, display:'flex', alignItems:'center', gap:10, padding:'0 16px', borderBottom:`1px solid ${bdr}`, flexShrink:0 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:acc, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'#0a0a0a', flexShrink:0, fontFamily:'var(--font-mono)' }}>S</div>
          {!sideCollapsed && <span style={{ fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', color:txt }}>SalesFlow CRM</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px 0', overflowY:'auto', overflowX:'hidden' }}>
          {NAV.map(item => (
            <button key={item.label} style={{
              width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 16px',
              background:item.active ? acc + '22' : 'transparent', border:'none', cursor:'pointer', textAlign:'left', whiteSpace:'nowrap',
              color:item.active ? acc : muted,
              borderLeft:item.active ? `2px solid ${acc}` : '2px solid transparent', transition:'color 0.14s',
            }}
              onMouseEnter={e => { if (!item.active) (e.currentTarget as HTMLElement).style.color = txt }}
              onMouseLeave={e => { if (!item.active) (e.currentTarget as HTMLElement).style.color = muted }}
            >
              <span style={{ flexShrink:0 }}><Icon d={item.d} size={15} stroke="currentColor" /></span>
              {!sideCollapsed && <span style={{ fontSize:13, fontWeight:item.active ? 500 : 400 }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop:`1px solid ${bdr}`, flexShrink:0 }}>
          {/* Profile */}
          {!sideCollapsed && (
            <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
              <Av src={GH_USER.avatar} name={GH_USER.name} size={28} bg="#6366f1" />
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontWeight:500, fontSize:12, color:txt, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{GH_USER.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:1 }}>
                  <span style={{ fontSize:10, color:muted }}>{GH_USER.role}</span>
                  <span style={{ fontSize:9, color:'#6366f1', background:'#6366f120', padding:'1px 5px', borderRadius:3, fontWeight:600 }}>GH</span>
                </div>
              </div>
            </div>
          )}

          {/* Analytics toggle */}
          <div style={{ borderTop:`1px solid ${bdr}` }}>
            <button onClick={() => setAnalyticsOpen(o => !o)} title={analyticsOpen ? 'Collapse analytics' : 'Open analytics'} style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:sideCollapsed ? 'center' : 'flex-start',
              gap:7, padding:'8px 16px', background:'transparent', border:'none', cursor:'pointer',
              color:analyticsOpen ? acc : muted, fontSize:11, transition:'color 0.14s',
            }}>
              <Icon d={D.chart} size={14} stroke="currentColor" />
              {!sideCollapsed && <span>{analyticsOpen ? 'Hide Analytics' : 'Open Analytics'}</span>}
            </button>
          </div>

          {/* Collapse toggle */}
          <button onClick={() => setSideCollapsed(c => !c)} style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:sideCollapsed ? 'center' : 'flex-end',
            gap:6, padding:'8px 16px', background:'transparent', border:'none', cursor:'pointer',
            color:muted, fontSize:12, borderTop:`1px solid ${bdr}`,
          }}>
            <span style={{ transform:sideCollapsed ? 'rotate(180deg)' : 'none', transition:'transform 0.22s', display:'inline-flex' }}>
              <Icon d={D.arrowsLL} size={13} stroke={muted} />
            </span>
            {!sideCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ══ Main ═════════════════════════════════════════════════ */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Header */}
        <header style={{ height:52, display:'flex', alignItems:'center', gap:10, padding:'0 20px', borderBottom:`1px solid ${bdr}`, background:sur, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, color:muted, fontSize:12 }}>
            <span>Dashboard</span>
            <span style={{ color:dim }}>/</span>
            <span style={{ color:txt, fontWeight:500 }}>Morning Command Centre</span>
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, background:sur2, border:`1px solid ${bdr}`, borderRadius:7, padding:'6px 10px', width:190 }}>
            <Icon d={D.search} size={13} stroke={muted} />
            <input placeholder="Search anything…" style={{ background:'transparent', border:'none', outline:'none', color:txt, fontSize:12, width:'100%' }} />
            <span style={{ fontSize:10, color:dim, fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>⌘K</span>
          </div>
          <button style={{ position:'relative', background:'transparent', border:'none', cursor:'pointer', color:muted, padding:6, borderRadius:6 }}>
            <Icon d={D.bell} size={16} stroke={muted} />
            <span style={{ position:'absolute', top:4, right:4, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:`1.5px solid ${sur}` }} />
          </button>
          <button onClick={onToggleDark} style={{ background:sur2, border:`1px solid ${bdr}`, borderRadius:6, padding:'5px 8px', cursor:'pointer', color:muted, display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
            <Icon d={dark ? D.sun : D.moon} size={13} stroke={muted} />
            {dark ? 'Light' : 'Dark'}
          </button>
          <Av name="S" size={28} bg={acc} />
          <span style={{ fontSize:12, fontWeight:500, color:txt }}>Sarah</span>
          <Icon d={D.chevD} size={11} stroke={muted} />
        </header>

        {/* Body */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Left content column */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

            {/* Scrollable area */}
            <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding: hasChat ? '24px 32px 16px' : '40px 32px 16px', display:'flex', flexDirection:'column', gap:20, alignItems:'center' }}>

              {!hasChat && (
                <>
                  <div style={{ textAlign:'center', width:'100%' }}>
                    <h1 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:700, letterSpacing:'-0.03em', color:txt }}>Good morning, Sarah ☀️</h1>
                    <p style={{ color:muted, marginTop:6, fontSize:13 }}>Here's your AI morning brief</p>
                  </div>
                  <section style={{ width:'min(60vw, 720px)' }}>
                    <div style={{ fontWeight:600, fontSize:11, marginBottom:8, color:muted, letterSpacing:'0.04em', textTransform:'uppercase' }}>Today's Focus</div>
                    <div style={{ display:'flex', flexDirection:'column', border:`1px solid ${bdr}`, borderRadius:8, overflow:'hidden' }}>
                      {FOCUS.map((t, i) => (
                        <div key={t.id} style={{
                          display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background:sur,
                          borderBottom:i < FOCUS.length - 1 ? `1px solid ${bdr}` : 'none', cursor:'pointer', transition:'background 0.12s',
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = sur2}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = sur}
                        >
                          <div style={{ width:7, height:7, borderRadius:'50%', background:t.dot, flexShrink:0 }} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <span style={{ fontWeight:500, fontSize:12, color:txt }}>{t.title}</span>
                            <span style={{ fontSize:11, color:dim, marginLeft:8 }}>{t.sub}</span>
                          </div>
                          <span style={{ fontSize:11, fontWeight:500, color:t.iC, whiteSpace:'nowrap', flexShrink:0 }}>{t.impact}</span>
                          <span style={{ fontSize:11, color:muted, fontFamily:'var(--font-mono)', whiteSpace:'nowrap', flexShrink:0, marginLeft:8 }}>{t.due}</span>
                          <Icon d={D.chevR} size={12} stroke={dim} />
                        </div>
                      ))}
                    </div>
                  </section>
                  <div style={{ textAlign:'center', color:muted, fontSize:13, fontWeight:500, marginTop:8 }}>How can I help you today?</div>
                </>
              )}

              {/* Chat history */}
              {chat.map((m, i) => (
                <div key={i} style={{ width:'min(60vw, 720px)', display:'flex', flexDirection:'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'user' ? (
                    <div style={{ background:'#2563eb', color:'#fff', borderRadius:'18px 18px 4px 18px', padding:'10px 16px', fontSize:13, lineHeight:1.55, maxWidth:'80%' }}>
                      {m.text}
                    </div>
                  ) : (
                    <div style={{ fontSize:14, lineHeight:1.7, color:txt, maxWidth:'90%', paddingTop:2 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:acc, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#0a0a0a' }}>L</div>
                        <span style={{ fontSize:11, fontWeight:600, color:muted }}>Leo AI</span>
                      </div>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}

              {!hasChat && <div style={{ flex:1 }} />}
            </div>

            {/* Pinned AI input */}
            <div style={{ flexShrink:0, padding:'12px 32px 20px', borderTop:`1px solid ${bdr}`, background:'var(--bg)' }}>
              <div style={{ width:'min(60vw, 720px)', margin:'0 auto' }}>
                <AiPromptInput dark={dark} onSend={sendMsg} />
                <p style={{ fontSize:10, color:dim, textAlign:'center', marginTop:10 }}>
                  Leo AI can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics panel */}
          <AnalyticsPanel
            dark={dark}
            open={analyticsOpen}
            onToggle={() => setAnalyticsOpen(o => !o)}
            todos={todos}
            toggleTodo={toggleTodo}
            calTab={calTab}
            setCalTab={setCalTab}
          />
        </div>
      </main>
    </div>
  )
}
