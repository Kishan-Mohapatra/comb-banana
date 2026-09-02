import { D } from './icons'

export const GH_USER = {
  login:     'Kishan-Mohapatra',
  name:      'Kishan Mohapatra',
  bio:       'UX UI Designer · Based in Gunupur, India',
  location:  'Gunupur, India',
  role:      'UX UI Designer',
  repos:     2,
  followers: 0,
  following: 0,
  joined:    'Oct 2021',
  avatar:    'https://avatars.githubusercontent.com/u/93049763?v=4',
  url:       'https://github.com/Kishan-Mohapatra',
}

export const NAV = [
  { label:'Dashboard',  d:D.home,     active:true },
  { label:'Contacts',   d:D.contacts },
  { label:'Properties', d:D.props },
  { label:'Docs',       d:D.docs },
  { label:'Analytics',  d:D.chart },
  { label:'Team',       d:D.team },
  { label:'Messages',   d:D.msg },
  { label:'Settings',   d:D.settings },
]

export const FOCUS = [
  { id:1, title:'Approve offer for 123 Main St', sub:'Buyer: James Carter',             impact:'High impact',   iC:'#ef4444', due:'1h 30m', dot:'#ef4444' },
  { id:2, title:'Review contract: Oak Ave Deal', sub:'Seller: Priya Sharma',            impact:'High impact',   iC:'#ef4444', due:'3h',     dot:'#ef4444' },
  { id:3, title:'Call buyer: Lisa Thompson',     sub:'Hot lead · Budget approved',      impact:'Medium impact', iC:'#f59e0b', due:'5h',     dot:'#f59e0b' },
  { id:4, title:'Coach Marcus on negotiations',  sub:'2 deals stuck in proposal stage', impact:'Medium impact', iC:'#f59e0b', due:'5h',     dot:'#f59e0b' },
  { id:5, title:'Follow up 5 expiring leads',   sub:"Leads haven't responded in 3+ days", impact:'Low impact', iC:'#22c55e', due:'1d',    dot:'#22c55e' },
]

export const R_STATS = [
  { label:'Needs Attention',  value:'11',      sub:'↑ 4 vs yesterday',     color:'#ef4444' },
  { label:'Deals at Risk',    value:'6',       sub:'$180K at stake',        color:'#f97316' },
  { label:'Team Capacity',    value:'18 / 22', sub:'82% utilized',          color:'#22c55e' },
  { label:'AI Opportunities', value:'23',      sub:'Automations available', color:'#a78bfa' },
]

export const LIVE = [
  { text:`${GH_USER.name} joined GitHub`,     time:GH_USER.joined, dot:'#6366f1' },
  { text:'Emily responded to 14 buyers',      time:'10m ago',       dot:'#3b82f6' },
  { text:'Offer accepted on 456 Oak Ave',     time:'25m ago',       dot:'#22c55e' },
  { text:'Inspection delayed on 789 Pine Rd', time:'1h ago',        dot:'#f97316' },
  { text:'Marcus updated contract',           time:'2h ago',        dot:'#3b82f6' },
]

export const TODOS = [
  { id:1, text:`Review @${GH_USER.login} design handoff`, tag:'GITHUB',     tagC:'#6366f1', when:'TODAY',    done:false },
  { id:2, text:'Sketch onboarding step 2',                tag:'ONBOARDING', tagC:'#3b82f6', when:'TODAY',    done:false },
  { id:3, text:'Reply to Riya about the bouncing invites',tag:'INBOX',      tagC:'#6b7280', when:'TODAY',    done:false },
  { id:4, text:'Approve Q3 budget request',               tag:'OPS',        tagC:'#f97316', when:'TOMORROW', done:false },
  { id:5, text:"Push Tuesday's release notes",            tag:'MARKETING',  tagC:'#a78bfa', when:'TOMORROW', done:true  },
]

export const CHIPS = [
  { label:'Find risky deals',    color:'#3b5bdb' },
  { label:'Who needs coaching?', color:'#e8590c' },
  { label:'Summarize yesterday', color:'#d63939' },
  { label:'Refine follow-ups',   color:'#0c8599' },
  { label:'Review contracts',    color:'#a78bfa' },
  { label:'MLS updates',         color:'#22c55e' },
]

export const H_HOURS  = [9,10,11,12,13,14,15,16,17,18]
export const H_EVENTS = [
  { title:'Team Stand-up', s:9.5,  e:10,    color:'#3b82f6' },
  { title:'1:1 with Maya', s:11.5, e:12,    color:'#f97316' },
  { title:'Design Crit',   s:14,   e:14.75, color:'#8b5cf6' },
  { title:'Customer Call', s:16,   e:16.5,  color:'#374151' },
]
export const NOW_H = 10.25
