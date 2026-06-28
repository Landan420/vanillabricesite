import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock3,
  Cpu,
  ExternalLink,
  Gamepad2,
  Globe2,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
  Plus,
  Smartphone,
  Ticket,
  Volume2,
  X,
} from 'lucide-react'
import heroImage from './assets/hero.png'
import crewPhoto from './assets/gogurt-crew.webp'
import profileImage from './assets/profile.jpg'
import './App.css'

const SPEC_SECTIONS = [
  {
    label: 'PC',
    items: [
      { category: 'CPU',   icon: Cpu,         name: 'Intel Core Ultra 7 265KF',      href: 'https://www.amazon.com/s?k=Intel+Core+Ultra+7+265KF',       detail: '20 cores · 5.5 GHz boost · Arrow Lake' },
      { category: 'GPU',   icon: Gamepad2,    name: 'NVIDIA GeForce RTX 5070 Ti',    href: 'https://www.amazon.com/s?k=RTX+5070+Ti+graphics+card',      detail: '8960 CUDA cores · 16GB GDDR7 · 2497 MHz' },
      { category: 'RAM',   icon: MemoryStick, name: '64GB DDR5',                     href: 'https://www.amazon.com/s?k=64GB+DDR5+RAM' },
      { category: 'Drive', icon: HardDrive,   name: '1.8TB SSD',                     href: 'https://www.amazon.com/s?k=2TB+NVMe+SSD' },
    ],
  },
  {
    label: 'Displays',
    items: [
      { category: 'Main', icon: Monitor, name: 'Samsung LC27G7xT',  href: 'https://www.amazon.com/s?k=Samsung+LC27G7xT',  detail: '27" · 2560×1440 · 240Hz · G-SYNC' },
      { category: '2nd',  icon: Monitor, name: 'Dell S3222DGM',     href: 'https://www.amazon.com/s?k=Dell+S3222DGM',     detail: '32" · 2560×1440 · 165Hz · VRR' },
      { category: '3rd',  icon: Monitor, name: 'AOC 27G2WG3',       href: 'https://www.amazon.com/s?k=AOC+27G2WG3',       detail: '27" · 1080p · 60Hz · Portrait' },
    ],
  },
  {
    label: 'Peripherals',
    items: [
      { category: 'Mouse',   icon: Mouse,       name: 'Logitech G Pro X Superlight 2', href: 'https://www.amazon.com/s?k=Logitech+G+Pro+X+Superlight+2' },
      { category: 'KB',      icon: Keyboard,    name: 'Glorious GMMK 3',               href: 'https://www.amazon.com/s?k=Glorious+GMMK+3+keyboard' },
      { category: 'Headset', icon: Headphones,  name: 'HyperX Cloud 3',                href: 'https://www.amazon.com/s?k=HyperX+Cloud+3+headset' },
      { category: 'Mic',     icon: Volume2,     name: 'HyperX QuadCast',               href: 'https://www.amazon.com/s?k=HyperX+QuadCast+microphone' },
    ],
  },
]

const DISCORD_ID = '424775068464185345'
const HOME_TIMEZONE = 'America/Chicago'
const DEFAULT_ACCENT = [150, 70, 210]

const DEFAULT_BIO = `<p>I'm <span class="rainbow-text">Brice</span>.</p>`

const fallbackProfile = {
  username: 'vanillabrice',
  handle: 'vanillabrice',
  avatarUrl: '',
  bannerUrl: '',
  status: 'offline',
  customStatus: '',
  devices: [],
}

function SteamIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.498 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
    </svg>
  )
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function SpotifyGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.8 15.6c3.3-1.1 6.6-.9 9.6.7M6.2 12.1c3.8-1.3 7.9-1.1 11.5.8M6 8.5c4.2-1.4 8.9-1.2 12.9.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function DiscordIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.54 5.23A16.9 16.9 0 0 0 15.36 4c-.18.32-.39.75-.53 1.1a15.7 15.7 0 0 0-4.66 0c-.14-.35-.35-.78-.53-1.1-1.46.25-2.86.66-4.18 1.23C2.82 9.18 2.44 13.04 2.73 16.84A16.8 16.8 0 0 0 7.85 19.4c.41-.55.78-1.14 1.09-1.75-.6-.22-1.17-.49-1.7-.81.14-.1.28-.21.41-.32a12.1 12.1 0 0 0 10.7 0c.14.11.27.22.41.32-.54.32-1.1.59-1.71.81.31.61.68 1.2 1.09 1.75a16.7 16.7 0 0 0 5.13-2.56c.34-4.4-.58-8.22-3.73-11.61ZM8.84 14.49c-1 0-1.82-.91-1.82-2.03s.8-2.03 1.82-2.03c1.01 0 1.84.92 1.82 2.03 0 1.12-.81 2.03-1.82 2.03Zm6.32 0c-1 0-1.82-.91-1.82-2.03s.8-2.03 1.82-2.03c1.02 0 1.84.92 1.82 2.03 0 1.12-.8 2.03-1.82 2.03Z" />
    </svg>
  )
}

const socials = [
  { label: 'Discord server', href: 'https://discord.gg/gogurt', icon: DiscordIcon },
]

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatMs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${pad(seconds)}`
}

function fileIcon(ext) {
  if (ext === 'lua') return '📜'
  if (['txt', 'md'].includes(ext)) return '📄'
  if (ext === 'json') return '{}'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵'
  return '📁'
}

function formatBytes(n) {
  if (n < 1024) return `${n}B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`
  return `${(n / (1024 * 1024)).toFixed(1)}MB`
}

function formatUploadDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function previewType(ext) {
  if (['lua', 'txt', 'md', 'json', 'js', 'ts', 'css', 'html', 'xml', 'yaml', 'yml', 'sh', 'py', 'rb', 'go', 'rs', 'c', 'cpp', 'h', 'java'].includes(ext)) return 'text'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio'
  return 'none'
}

function decodeDataUrl(dataUrl) {
  try {
    const comma = dataUrl.indexOf(',')
    if (comma === -1) return dataUrl
    const header = dataUrl.slice(0, comma)
    const payload = dataUrl.slice(comma + 1)
    if (header.includes('base64')) {
      const binary = atob(payload)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      return new TextDecoder().decode(bytes)
    }
    return decodeURIComponent(payload)
  } catch { return '' }
}

function formatRelativeTime(value) {
  if (!value) return ''
  const diffMs = Date.now() - new Date(value).getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'now'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
  return `${Math.floor(diffMs / day)}d ago`
}

function formatElapsed(startMs, nowMs) {
  const totalSeconds = Math.max(0, Math.floor((nowMs - startMs) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)} elapsed`
  return `${pad(minutes)}:${pad(seconds)} elapsed`
}

function getStatusText(status) {
  return {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
  }[status] ?? 'Offline'
}

const SCRAMBLE_CHARS = '¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ"\'«åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?`~'

function ScrambleText({ text, duration = 700 }) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    let frame
    const start = performance.now()
    const length = text.length

    function tick(now) {
      const elapsed = now - start
      if (elapsed >= duration) {
        setDisplay(text)
        return
      }

      const revealCount = Math.floor((elapsed / duration) * length)
      let next = ''
      for (let i = 0; i < length; i += 1) {
        next +=
          i < revealCount || text[i] === ' ' || text[i] === ','
            ? text[i]
            : SCRAMBLE_CHARS.charAt(Math.floor(Math.random() * SCRAMBLE_CHARS.length))
      }
      setDisplay(next)
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [text, duration])

  return <span className="scramble-text">{display}</span>
}

function HoverScramble({ text }) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(null)

  function trigger() {
    if (frameRef.current) return
    const start = performance.now()
    const duration = 580
    const length = text.length

    function tick(now) {
      const elapsed = now - start
      if (elapsed >= duration) {
        setDisplay(text)
        frameRef.current = null
        return
      }
      const revealCount = Math.floor((elapsed / duration) * length)
      let next = ''
      for (let i = 0; i < length; i += 1) {
        next +=
          i < revealCount || text[i] === ' ' || text[i] === ','
            ? text[i]
            : SCRAMBLE_CHARS.charAt(Math.floor(Math.random() * SCRAMBLE_CHARS.length))
      }
      setDisplay(next)
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)
  }

  useEffect(() => () => { if (frameRef.current) window.cancelAnimationFrame(frameRef.current) }, [])

  return <span className="scramble-text" onMouseEnter={trigger}>{display}</span>
}

function getDeviceIcon(device) {
  if (device === 'mobile') return Smartphone
  if (device === 'desktop') return Monitor
  return Globe2
}

function getActivityImageUrl(activity) {
  if (!activity) return null
  const img = activity.assets?.large_image
  if (!img) return null
  if (img.startsWith('mp:external/')) {
    return `https://media.discordapp.net/external/${img.slice('mp:external/'.length)}`
  }
  if (img.startsWith('spotify:')) {
    return `https://i.scdn.co/image/${img.slice('spotify:'.length)}`
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`
  }
  return null
}

function ActivityIcon({ activity }) {
  const [imgFailed, setImgFailed] = useState(false)
  const isSpotify = activity.type === 2 || activity.name === 'Spotify'

  if (isSpotify) {
    return (
      <span className="activity-icon-wrap activity-icon-spotify">
        <SpotifyGlyph size={16} />
      </span>
    )
  }

  const imgUrl = getActivityImageUrl(activity)
  if (imgUrl && !imgFailed) {
    return (
      <img
        className="activity-game-art"
        src={imgUrl}
        alt=""
        draggable="false"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <span className="activity-icon-wrap">
      {activity.type === 0 || activity.type === 'game' ? <Gamepad2 size={16} /> : <Activity size={16} />}
    </span>
  )
}

function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return now
}

function useDiscordPresence() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    function applyActivity(activityData) {
      if (cancelled) return
      const activity = activityData?.activities?.[DISCORD_ID] ?? null
      setProfile((prev) => ({
        ...prev,
        status: activity?.status || 'offline',
        customStatus: activity?.customStatus || fallbackProfile.customStatus,
        spotify: activity?.spotify || null,
        activities: activity?.activities || [],
        devices: activity?.devices || [],
      }))
    }

    async function fetchFull() {
      try {
        const [profileRes, activityRes] = await Promise.allSettled([
          fetch(`/api/discord-profile?id=${DISCORD_ID}&v=bio`),
          fetch(`/api/discord-activity?id=${DISCORD_ID}&name_${DISCORD_ID}=vanillabrice`),
        ])

        const profileData =
          profileRes.status === 'fulfilled' && profileRes.value.ok
            ? await profileRes.value.json()
            : null
        const activityData =
          activityRes.status === 'fulfilled' && activityRes.value.ok
            ? await activityRes.value.json()
            : null
        const activity = activityData?.activities?.[DISCORD_ID] ?? null

        if (!cancelled) {
          setProfile({
            username: profileData?.username || fallbackProfile.username,
            handle: profileData?.handle || fallbackProfile.handle,
            avatarUrl: profileData?.avatarUrl || fallbackProfile.avatarUrl,
            bannerUrl: profileData?.bannerUrl || fallbackProfile.bannerUrl,
            status: activity?.status || 'offline',
            customStatus: activity?.customStatus || fallbackProfile.customStatus,
            spotify: activity?.spotify || null,
            activities: activity?.activities || [],
            devices: activity?.devices || [],
          })
        }
      } catch {
        if (!cancelled) setProfile(fallbackProfile)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    async function fetchActivity() {
      if (document.hidden) return
      try {
        const res = await fetch(`/api/discord-activity?id=${DISCORD_ID}&name_${DISCORD_ID}=vanillabrice`)
        if (!res.ok) return
        applyActivity(await res.json())
      } catch {}
    }

    fetchFull()
    const activityId = window.setInterval(fetchActivity, 5000)
    const fullId = window.setInterval(() => {
      if (!document.hidden) fetchFull()
    }, 60000)

    return () => {
      cancelled = true
      window.clearInterval(activityId)
      window.clearInterval(fullId)
    }
  }, [])

  return { profile, loading }
}

function boostColor([r, g, b]) {
  const nr = r / 255, ng = g / 255, nb = b / 255
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb)
  const l = (max + min) / 2
  const d = max - min
  let h = 0, s = 0
  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === nr) h = ((ng - nb) / d + 6) % 6
    else if (max === ng) h = (nb - nr) / d + 2
    else h = (nr - ng) / d + 4
    h *= 60
  }
  const ns = Math.min(1, s * 1.4 + 0.3)
  const nl = 0.54
  const c = (1 - Math.abs(2 * nl - 1)) * ns
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = nl - c / 2
  let rr = 0, gg = 0, bb = 0
  if (h < 60) { rr = c; gg = x }
  else if (h < 120) { rr = x; gg = c }
  else if (h < 180) { gg = c; bb = x }
  else if (h < 240) { gg = x; bb = c }
  else if (h < 300) { rr = x; bb = c }
  else { rr = c; bb = x }
  return [Math.round((rr + m) * 255), Math.round((gg + m) * 255), Math.round((bb + m) * 255)]
}

function extractDominantColor(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const size = 48
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        let best = null
        let bestScore = -1
        let brightestGray = null
        let brightestGrayVal = -1
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
          if (a < 128) continue
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const sat = max === 0 ? 0 : (max - min) / max
          const bri = max / 255
          if (bri > 0.2 && bri > brightestGrayVal) { brightestGrayVal = bri; brightestGray = [r, g, b] }
          if (bri < 0.12 || bri > 0.95 || sat < 0.12) continue
          const score = sat * 3 + bri * 0.4
          if (score > bestScore) { bestScore = score; best = [r, g, b] }
        }
        if (best) {
          resolve(boostColor(best))
        } else if (brightestGray) {
          const v = Math.max(Math.round((brightestGray[0] + brightestGray[1] + brightestGray[2]) / 3), 185)
          resolve([v, v, v])
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

function animateAccent(from, to, duration = 900) {
  const start = performance.now()
  function tick(now) {
    const raw = Math.min(1, (now - start) / duration)
    const t = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw
    const [r, g, b] = from.map((c, i) => Math.round(c + (to[i] - c) * t))
    document.documentElement.style.setProperty('--accent-r', r)
    document.documentElement.style.setProperty('--accent-g', g)
    document.documentElement.style.setProperty('--accent-b', b)
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`)
    if (raw < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function useAccentColor(albumArtUrl, customColor) {
  const currentRef = useRef(DEFAULT_ACCENT)

  useEffect(() => {
    async function apply() {
      let resolved
      if (customColor && /^#[0-9a-f]{6}$/i.test(customColor)) {
        const r = parseInt(customColor.slice(1, 3), 16)
        const g = parseInt(customColor.slice(3, 5), 16)
        const b = parseInt(customColor.slice(5, 7), 16)
        resolved = [r, g, b]
      } else {
        const color = albumArtUrl ? await extractDominantColor(albumArtUrl) : null
        resolved = color ?? DEFAULT_ACCENT
      }
      animateAccent(currentRef.current, resolved)
      currentRef.current = resolved
    }
    apply()
  }, [albumArtUrl, customColor])
}

function useTilt(maxDeg = 2.5) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let enabled = false
    const timer = setTimeout(() => { enabled = true }, 1400)

    function onMove(e) {
      if (!enabled) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(900px) rotateY(${(x * maxDeg * 2).toFixed(2)}deg) rotateX(${(-y * maxDeg * 2).toFixed(2)}deg)`
    }

    function onLeave() {
      if (!enabled) return
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      clearTimeout(timer)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [maxDeg])

  return ref
}

function useServerStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load(retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch('/api/discord-server')
          if (cancelled) return
          if (res.ok) {
            const data = await res.json()
            if (!cancelled) { setStats(data); setLoading(false) }
            return
          }
        } catch {}
        if (i < retries - 1) await new Promise(r => setTimeout(r, 800 * (i + 1)))
      }
      if (!cancelled) setLoading(false)
    }

    load()
    const id = window.setInterval(() => load(), 5 * 60 * 1000)
    return () => { cancelled = true; window.clearInterval(id) }
  }, [])

  return { stats, loading }
}

function UploadsPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewingId, setViewingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const { profile: discordProfile } = useDiscordPresence()
  const siteContent = useSiteContent()
  useAccentColor(getActivityImageUrl(discordProfile?.activities?.[0]), siteContent.custom_accent_color)

  useEffect(() => {
    fetch('/api/files').then(r => r.json()).then(setFiles).catch(() => setFiles([])).finally(() => setLoading(false))
  }, [])

  function download(file) {
    const a = document.createElement('a')
    a.href = file.data
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function rawUrl(file) {
    return `${window.location.origin}/api/raw/${encodeURIComponent(file.name)}`
  }

  function copyRaw(file) {
    const url = file.ext === 'lua'
      ? `loadstring(game:HttpGet("${rawUrl(file)}"))()`
      : rawUrl(file)
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(file.id)
      setTimeout(() => setCopiedId(null), 1800)
    })
  }

  return (
    <main className="bio-shell uploads-page-shell">
      <div className="top-rainbow-bar" aria-hidden="true" />
      <div className="page-backdrop" />
      <a href="/" className="uploads-back">← back</a>
      <div className="uploads-page-content">
        <h1 className="uploads-page-title">uploads</h1>
        <p className="uploads-page-sub">files, scripts &amp; stuff</p>
        <div className="uploads-page-list">
          {loading && <p className="uploads-empty">loading…</p>}
          {!loading && files.length === 0 && <p className="uploads-empty">nothing here yet</p>}
          {files.map(f => {
            const pt = previewType(f.ext)
            const isOpen = viewingId === f.id
            const isCopied = copiedId === f.id
            return (
              <div key={f.id} className="upload-item-wrap">
                <div
                  className={`upload-item${pt !== 'none' ? ' upload-item--previewable' : ''}${isOpen ? ' upload-item--open' : ''}`}
                  onClick={pt !== 'none' ? () => setViewingId(isOpen ? null : f.id) : undefined}
                >
                  <span className="upload-item-icon">{fileIcon(f.ext)}</span>
                  <div className="upload-item-meta">
                    <span className="upload-item-name">{f.name}</span>
                    {f.description ? <span className="upload-item-desc">{f.description}</span> : null}
                    <span className="upload-item-detail">{formatBytes(f.size)} · {formatUploadDate(f.created_at)}</span>
                  </div>
                  <div className="upload-item-actions">
                    <button
                      type="button"
                      className={`upload-item-copy${isCopied ? ' upload-item-copy--done' : ''}`}
                      onClick={e => { e.stopPropagation(); copyRaw(f) }}
                      title={f.ext === 'lua' ? 'Copy loadstring' : 'Copy link'}
                    >{isCopied ? '✓' : '⎘'}</button>
                    {pt !== 'none' && <span className="upload-item-chevron" aria-hidden="true">{isOpen ? '▴' : '▾'}</span>}
                    <button type="button" className="upload-item-dl" onClick={e => { e.stopPropagation(); download(f) }} title="Download">↓</button>
                  </div>
                </div>
                {isOpen && (
                  <div className="upload-preview">
                    {pt === 'text' && <pre className="upload-preview-code"><code>{decodeDataUrl(f.data)}</code></pre>}
                    {pt === 'image' && <img className="upload-preview-img" src={f.data} alt={f.name} />}
                    {pt === 'audio' && <audio className="upload-preview-audio" controls src={f.data} />}
                    <div className="upload-preview-rawbar">
                      <span className="uprb-label">{f.ext === 'lua' ? 'exec' : 'raw'}</span>
                      <code className="uprb-url">{f.ext === 'lua' ? `loadstring(game:HttpGet("${rawUrl(f)}"))()`  : rawUrl(f)}</code>
                      <button type="button" className={`uprb-copy${isCopied ? ' uprb-copy--done' : ''}`} onClick={() => copyRaw(f)}>{isCopied ? '✓' : '⎘'}</button>
                    </div>
                    <button type="button" className="upload-preview-dl" onClick={() => download(f)}>↓ download {f.name}</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <span className="dev-tag">made by landan</span>
    </main>
  )
}

function ProfileCard({ profile, loading, nameStyle = 'neon', customName, customHandle, location }) {
  const tiltRef = useTilt(2)
  const now = useClock()
  const timeText = new Intl.DateTimeFormat('en-US', {
    timeZone: HOME_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  return (
    <div className="profile-panel" ref={tiltRef}>
      <div className="profile-meta-row">
        <div className="meta-badge">
          <Clock3 size={16} />
          <span>{timeText}</span>
        </div>
      </div>
      <section className="profile-card">
        {profile.bannerUrl
          ? <img className="profile-banner" src={profile.bannerUrl} alt="" draggable="false" />
          : <div className="profile-banner profile-banner--blank" />
        }
        {loading ? <div className="loading-overlay">Loading..</div> : null}
        <div className="profile-main">
          <div className="avatar-wrap">
            {profile.avatarUrl
              ? <img className="avatar" src={profile.avatarUrl} alt="Profile" draggable="false" />
              : <div className="avatar avatar--placeholder" />
            }
          </div>
          <div className="name-block">
            <h1>
              <span className={`name-style-${nameStyle}`}>{customName || 'vanillabrice'}</span>
            </h1>
            <div className="username-line">
              <span>@{customHandle || profile.handle}</span>
              <a
                className="add-profile-button"
                href={`https://discord.com/users/${DISCORD_ID}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Add Brice on Discord"
              >
                <Plus size={14} />
                <span>Add</span>
              </a>
              <div className="devices">
                {profile.devices.map((device) => {
                  const Icon = getDeviceIcon(device)
                  return <Icon key={device} size={15} />
                })}
              </div>
            </div>
          </div>
        </div>
        {profile.customStatus && (
          <p className="custom-status">
            <span>{profile.customStatus}</span>
          </p>
        )}
        <div className="profile-facts">
          <span className="status-fact">
            <i className={`status-dot ${profile.status}`} aria-hidden="true" />
            {getStatusText(profile.status)}
          </span>
          {location && (
            <span>
              <HoverScramble text={location} />
            </span>
          )}
        </div>
        <div className="profile-badges">
          <div className="profile-badge">
            <Ticket size={12} />
            <span className="badge-label">Invited</span>
          </div>
          <a href="https://gogurt.pages.dev" target="_blank" rel="noreferrer" className="site-link-pill">
            <ExternalLink size={9} />
            gogurt.pages.dev
          </a>
          <a href="https://ihymich.pages.dev" target="_blank" rel="noreferrer" className="site-link-pill">
            <ExternalLink size={9} />
            ihymich.pages.dev
          </a>
        </div>
      </section>
    </div>
  )
}

function SpecsModal({ onClose }) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 210)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closing])

  return (
    <div
      className={`specs-overlay${closing ? ' specs-overlay--out' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className={`specs-modal${closing ? ' specs-modal--out' : ''}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="specs-modal-header">
          <h2>My Setup</h2>
        </div>
        <div className="specs-sections">
          {SPEC_SECTIONS.map((section) => (
            <div key={section.label} className="specs-section">
              <div className="specs-section-label">{section.label}</div>
              <div className="specs-grid">
                {section.items.map((spec) => {
                  const Icon = spec.icon
                  return (
                    <a
                      key={spec.category + spec.name}
                      href={spec.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`spec-item${spec.detail ? ' spec-item--has-detail' : ''}`}
                    >
                      <span className="spec-icon-box">
                        <Icon size={20} />
                      </span>
                      <span className="spec-info">
                        <span className="spec-category">{spec.category}</span>
                        <span className="spec-name">{spec.name}</span>
                      </span>
                      <ExternalLink size={12} className="spec-link-icon" />
                      {spec.detail && (
                        <span className="spec-detail-tip">{spec.detail}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AboutCard({ onOpenSpecs, aboutBio }) {
  const tiltRef = useTilt()
  const hasText = aboutBio && aboutBio.replace(/<[^>]*>/g, '').trim().length > 0
  const bioHtml = hasText ? aboutBio : DEFAULT_BIO
  return (
    <section className="section-card about-card" ref={tiltRef}>
      <div className="section-title-row">
        <h2>About Me</h2>
        <div className="social-links">
          {socials.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
      <div className="about-copy">
        <div className="about-bio-text" dangerouslySetInnerHTML={{ __html: bioHtml }} />
        <div>
          <button className="specs-btn" onClick={onOpenSpecs}>
            View Setup
          </button>
        </div>
      </div>
    </section>
  )
}

function ServerCard({ serverStats, loading }) {
  const tiltRef = useTilt()
  return (
    <section className="mini-card server-card" ref={tiltRef}>
      <div className="mini-card-header">
        <h2>{serverStats?.guildName || '🥤 Gogurt'}</h2>
        <a className="server-pill" href="https://discord.gg/gogurt" target="_blank" rel="noreferrer">join</a>
      </div>
      <div className="server-stat-list">
        <div className="server-stat-row">
          <i className="status-dot online" aria-hidden="true" />
          {loading && !serverStats
            ? <span className="server-stat-skeleton" />
            : <span>{serverStats?.onlineCount != null ? serverStats.onlineCount.toLocaleString() + ' online' : '—'}</span>
          }
        </div>
        <div className="server-stat-row">
          <i className="status-dot offline" aria-hidden="true" />
          {loading && !serverStats
            ? <span className="server-stat-skeleton" />
            : <span>{serverStats?.memberCount != null ? serverStats.memberCount.toLocaleString() + ' members' : '—'}</span>
          }
        </div>
      </div>
    </section>
  )
}

function ActivitiesCard({ activities }) {
  const tiltRef = useTilt()
  const visible = (activities || []).filter(
    (a) => a.type !== 4 && a.name !== 'Custom Status',
  )
  const gameActivity = visible.find((a) => a.type === 'game')
  const artUrl = gameActivity ? getActivityImageUrl(gameActivity) : null

  return (
    <section className="mini-card" ref={tiltRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {artUrl && (
        <div
          className="activity-art-bg"
          style={{ backgroundImage: `url(${artUrl})` }}
        />
      )}
      <div className="mini-card-header">
        <h2>Current Activities</h2>
      </div>
      <div className="activity-list">
        {visible.slice(0, 3).map((activity) => (
          <div key={`${activity.name}-${activity.created_at || activity.id}`} className="activity-row">
            <ActivityIcon activity={activity} />
            <span>
              <strong>{activity.name}</strong>
              <small>
                {activity.details || activity.state ||
                  (activity.timestamps?.start
                    ? formatElapsed(activity.timestamps.start, Date.now())
                    : 'active now')}
              </small>
            </span>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="activity-row activity-row--empty">
            <Headphones size={18} />
            <span>
              <strong>Nothing public right now</strong>
              <small>check back later</small>
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

function useGames(mode) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setGames([])
    fetch(mode === 'top' ? '/api/steam-games?mode=top' : '/api/steam-games')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setGames(data?.games || [])
          setLoading(false)
        }
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [mode])

  return { games, loading }
}

function GameImage({ headerUrl, appid, iconUrl, name }) {
  const [idx, setIdx] = useState(0)

  const urls = [
    headerUrl,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
    `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`,
    iconUrl,
  ].filter(Boolean)

  if (idx >= urls.length) return <div className="game-img-missing" />

  return (
    <img
      key={urls[idx]}
      src={urls[idx]}
      alt={name}
      draggable="false"
      onError={() => setIdx((i) => i + 1)}
    />
  )
}

function GamesCard() {
  const tiltRef = useTilt()
  const [mode, setMode] = useState('recent')
  const { games, loading } = useGames(mode)

  return (
    <section className="section-card games-card" ref={tiltRef}>
      <div className="section-title-row">
        <h2>
          <button type="button" className="title-toggle" onClick={() => setMode(mode === 'recent' ? 'top' : 'recent')}>
            {mode === 'recent' ? 'Recently' : 'Top'}
          </button>{' '}
          {mode === 'recent' ? 'Played' : 'Games'}
        </h2>
        <div className="icon-actions">
          <a
            href="https://steamcommunity.com/profiles/76561198431786913"
            target="_blank"
            rel="noreferrer"
            aria-label="Steam profile"
          >
            <SteamIcon size={16} />
          </a>
        </div>
      </div>
      <div className="games-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="game-tile game-tile--skeleton" />
            ))
          : games.length === 0
            ? <div className="song-empty">No games found.</div>
            : games.map((game) => (
                <a
                  key={game.appid}
                  className="game-tile"
                  href={`https://store.steampowered.com/app/${game.appid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GameImage headerUrl={game.headerUrl} appid={game.appid} iconUrl={game.iconUrl} name={game.name} />
                  <div className="game-overlay">
                    <strong>{game.name}</strong>
                    <span>{game.hoursTotal.toLocaleString()} hrs total</span>
                    {mode === 'recent' && game.hoursRecent != null && (
                      <small>{game.hoursRecent} hrs past 2 weeks</small>
                    )}
                  </div>
                </a>
              ))}
      </div>
    </section>
  )
}

const NAME_STYLES = [
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'neon',   label: 'Neon'   },
  { id: 'holo',   label: 'Holo'   },
  { id: 'glitch', label: 'Glitch' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'blood',  label: 'Blood'  },
  { id: 'void',   label: 'Void'   },
  { id: 'melt',   label: 'Melt'   },
  { id: 'fire',   label: 'Fire'   },
  { id: 'ice',    label: 'Ice'    },
  { id: 'plasma', label: 'Plasma' },
  { id: 'gold',   label: 'Gold'   },
  { id: 'matrix', label: 'Matrix' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'toxic',  label: 'Toxic'  },
  { id: 'plain',  label: 'Plain'  },
]

const RTE_TOOLS = [
  { cmd: 'bold',               label: 'B',  title: 'Bold',          style: { fontWeight: 700 } },
  { cmd: 'italic',             label: 'I',  title: 'Italic',        style: { fontStyle: 'italic' } },
  { cmd: 'underline',          label: 'U',  title: 'Underline',     style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough',      label: 'S',  title: 'Strikethrough', style: { textDecoration: 'line-through' } },
  'sep',
  { cmd: 'justifyLeft',        label: '⇐', title: 'Align left'  },
  { cmd: 'justifyCenter',      label: '≡', title: 'Center'      },
  { cmd: 'justifyRight',       label: '⇒', title: 'Align right' },
  'sep',
  { cmd: 'formatBlock', arg: 'h2',         label: 'H2', title: 'Heading'    },
  { cmd: 'formatBlock', arg: 'h3',         label: 'H3', title: 'Subheading' },
  { cmd: 'formatBlock', arg: 'p',          label: '¶',  title: 'Paragraph'  },
  { cmd: 'formatBlock', arg: 'blockquote', label: '"',  title: 'Quote'      },
  'sep',
  { cmd: 'insertUnorderedList', label: '•—', title: 'Bullet list'   },
  { cmd: 'insertOrderedList',   label: '1—', title: 'Numbered list' },
  'sep',
  { cmd: 'removeFormat', label: '✕', title: 'Clear formatting' },
]

function RichBioEditor({ value, onChange }) {
  const editorRef = useRef(null)
  const skipSync = useRef(false)

  useEffect(() => {
    const el = editorRef.current
    if (!el || skipSync.current) return
    if (el.innerHTML !== (value || '')) el.innerHTML = value || ''
  }, [value])

  function exec(cmd, arg = null) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, arg)
    skipSync.current = true
    onChange(editorRef.current.innerHTML)
    setTimeout(() => { skipSync.current = false }, 0)
  }

  function onInput() {
    skipSync.current = true
    onChange(editorRef.current.innerHTML)
    setTimeout(() => { skipSync.current = false }, 0)
  }

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        {RTE_TOOLS.map((tool, i) => {
          if (tool === 'sep') return <div key={i} className="rte-sep" />
          return (
            <button
              key={tool.cmd + (tool.arg || '')}
              type="button"
              title={tool.title}
              style={tool.style}
              onMouseDown={e => { e.preventDefault(); exec(tool.cmd, tool.arg || null) }}
            >
              {tool.label}
            </button>
          )
        })}
      </div>
      <div
        ref={editorRef}
        className="rte-body"
        contentEditable
        onInput={onInput}
        suppressContentEditableWarning
        data-placeholder="say something…"
      />
    </div>
  )
}

function resizeImageFile(file, maxW, maxH) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let w = img.naturalWidth, h = img.naturalHeight
      const ratio = Math.min(maxW / w, maxH / h, 1)
      w = Math.round(w * ratio)
      h = Math.round(h * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = url
  })
}

function ImageUploadField({ label, value, onChange, maxW = 800, maxH = 400 }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const isDataUrl = value?.startsWith('data:')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { onChange(await resizeImageFile(file, maxW, maxH)) } catch {}
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="admin-field">
      {label && <span>{label}</span>}
      {isDataUrl && <img className="img-upload-thumb" src={value} alt="" />}
      <div className="img-upload-row">
        {isDataUrl
          ? <span className="img-upload-info">uploaded image</span>
          : <input className="admin-input" type="url" placeholder="https://…" value={value || ''} onChange={e => onChange(e.target.value)} />
        }
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <button type="button" className="admin-btn admin-btn--sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '…' : '↑ upload'}
        </button>
        {value && <button type="button" className="admin-clear-btn" onClick={() => onChange('')} title="Clear">✕</button>}
      </div>
    </div>
  )
}

function useSiteContent() {
  const [content, setContent] = useState({})
  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.ok ? r.json() : {})
      .then(setContent)
      .catch(() => {})
  }, [])
  return content
}

function AdminPanel() {
  const [step, setStep] = useState(() => localStorage.getItem('admin_token') ? 'check' : 'email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [content, setContent] = useState({
    custom_status: '', location: '', about_bio: '',
    custom_name: '', custom_handle: '', ascii_comment: '', name_style: 'rainbow',
    custom_avatar_url: '', custom_banner_url: '', custom_accent_color: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminFiles, setAdminFiles] = useState([])
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const uploadInputRef = useRef(null)
  const { profile: discordProfile } = useDiscordPresence()
  useAccentColor(getActivityImageUrl(discordProfile?.activities?.[0]), content.custom_accent_color)

  useEffect(() => {
    if (step !== 'check' || !token) return
    fetch('/api/admin/content', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setContent(c => ({ ...c, ...data })); setStep('panel') }
        else { localStorage.removeItem('admin_token'); setToken(''); setStep('email') }
      })
      .catch(() => setStep('email'))
  }, [step, token])

  useEffect(() => {
    if (step !== 'panel') return
    fetch('/api/files').then(r => r.json()).then(setAdminFiles).catch(() => {})
  }, [step])

  async function handleUploadFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const desc = uploadDesc
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
      try {
        const res = await fetch('/api/admin/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: file.name, ext, description: desc, data: ev.target.result, size: file.size }),
        })
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Upload failed (${res.status})`) }
        const { id } = await res.json()
        setAdminFiles(prev => [{ id, name: file.name, ext, description: desc, data: ev.target.result, size: file.size, created_at: Date.now() }, ...prev])
        setUploadDesc('')
      } catch (err) {
        setUploadError(err.message || 'Upload failed')
      }
      setUploading(false)
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  async function deleteUpload(id) {
    await fetch(`/api/admin/files?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setAdminFiles(prev => prev.filter(f => f.id !== id))
  }

  async function requestOtp(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.otpToken) setOtpToken(data.otpToken)
      setStep('otp')
    } catch { setError('Request failed.') }
    setLoading(false)
  }

  async function verifyOtp(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, otpToken }),
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('admin_token', data.token)
        setToken(data.token)
        const c = await fetch('/api/admin/content').then(r => r.json()).catch(() => ({}))
        setContent(prev => ({ ...prev, ...c }))
        setStep('panel')
      } else {
        setError(data.error || 'Invalid code.')
      }
    } catch { setError('Request failed.') }
    setLoading(false)
  }

  async function save(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
      else if (res.status === 401) { localStorage.removeItem('admin_token'); setStep('email') }
    } catch {}
    setLoading(false)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
    localStorage.removeItem('admin_token')
    setToken(''); setStep('email')
  }

  if (step === 'check') {
    return (
      <div className="admin-shell">
        <div className="top-rainbow-bar" aria-hidden="true" />
        <div className="page-backdrop" />
        <p className="admin-checking">checking session…</p>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="admin-shell">
        <div className="top-rainbow-bar" aria-hidden="true" />
        <div className="page-backdrop" />
        <form className="admin-form" onSubmit={requestOtp}>
          <h1 className="admin-title">_</h1>
          <input
            className="admin-input"
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? '…' : 'continue'}
          </button>
        </form>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="admin-shell">
        <div className="top-rainbow-bar" aria-hidden="true" />
        <div className="page-backdrop" />
        <form className="admin-form" onSubmit={verifyOtp}>
          <h1 className="admin-title">_</h1>
          <p className="admin-hint">check your email for a 6-digit code</p>
          <input
            className="admin-input admin-input--code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            required
            autoComplete="one-time-code"
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? '…' : 'verify'}
          </button>
          <button className="admin-back" type="button" onClick={() => { setStep('email'); setCode(''); setError('') }}>
            ← back
          </button>
        </form>
      </div>
    )
  }

  const namePreview = content.custom_name || 'Brice'

  return (
    <div className="admin-shell">
      <div className="top-rainbow-bar" aria-hidden="true" />
      <div className="page-backdrop" />
      <form className="admin-panel admin-panel--wide" onSubmit={save}>
        <div className="admin-panel-header">
          <h2 className="admin-panel-title"><a href="/" className="admin-site-link">site</a> editor</h2>
          <button type="button" className="admin-back" onClick={logout}>logout</button>
        </div>

        <div className="admin-fields">
          <p className="admin-section-label">profile</p>

          <label className="admin-field">
            <span>name text</span>
            <input
              className="admin-input"
              type="text"
              placeholder="Brice"
              value={content.custom_name || ''}
              onChange={e => setContent(c => ({ ...c, custom_name: e.target.value }))}
            />
          </label>

          <div className="admin-field">
            <span>name style</span>
            <div className="style-picker">
              {NAME_STYLES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`style-picker-btn${(content.name_style || 'rainbow') === s.id ? ' active' : ''}`}
                  onClick={() => setContent(c => ({ ...c, name_style: s.id }))}
                >
                  <span className={`style-picker-preview name-style-${s.id}`}>{namePreview}</span>
                  <span className="style-picker-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="admin-field">
            <span>handle (@…)</span>
            <input
              className="admin-input"
              type="text"
              placeholder="vanillabrice"
              value={content.custom_handle || ''}
              onChange={e => setContent(c => ({ ...c, custom_handle: e.target.value }))}
            />
          </label>

          <label className="admin-field">
            <span>top-right tag</span>
            <input
              className="admin-input"
              type="text"
              placeholder="vanillabrice"
              value={content.ascii_comment || ''}
              onChange={e => setContent(c => ({ ...c, ascii_comment: e.target.value }))}
            />
          </label>

          <ImageUploadField
            label="avatar (blank = discord)"
            value={content.custom_avatar_url || ''}
            onChange={val => setContent(c => ({ ...c, custom_avatar_url: val }))}
            maxW={256} maxH={256}
          />

          <ImageUploadField
            label="banner (blank = discord)"
            value={content.custom_banner_url || ''}
            onChange={val => setContent(c => ({ ...c, custom_banner_url: val }))}
            maxW={900} maxH={360}
          />

          <div className="admin-field">
            <span>theme color (blank = auto from activity)</span>
            <div className="accent-picker-row">
              <input
                type="color"
                className="accent-color-swatch"
                value={content.custom_accent_color || '#9646d2'}
                onChange={e => setContent(c => ({ ...c, custom_accent_color: e.target.value }))}
              />
              <input
                className="admin-input"
                type="text"
                placeholder="#9646d2"
                value={content.custom_accent_color || ''}
                onChange={e => setContent(c => ({ ...c, custom_accent_color: e.target.value }))}
              />
              {content.custom_accent_color && (
                <button type="button" className="admin-clear-btn" onClick={() => setContent(c => ({ ...c, custom_accent_color: '' }))} title="Reset to auto">✕</button>
              )}
            </div>
          </div>

          <p className="admin-section-label">status</p>

          <label className="admin-field">
            <span>custom status</span>
            <input
              className="admin-input"
              type="text"
              placeholder="playing something…"
              value={content.custom_status || ''}
              onChange={e => setContent(c => ({ ...c, custom_status: e.target.value }))}
            />
          </label>

          <label className="admin-field">
            <span>location</span>
            <input
              className="admin-input"
              type="text"
              placeholder="St. Louis, MO"
              value={content.location || ''}
              onChange={e => setContent(c => ({ ...c, location: e.target.value }))}
            />
          </label>

          <p className="admin-section-label">bio</p>

          <div className="admin-field">
            <span>about bio</span>
            <RichBioEditor
              value={(content.about_bio && content.about_bio.replace(/<[^>]*>/g, '').trim().length > 0) ? content.about_bio : DEFAULT_BIO}
              onChange={val => setContent(c => ({ ...c, about_bio: val }))}
            />
          </div>

          <p className="admin-section-label">uploads</p>

          {adminFiles.length > 0 && (
            <div className="admin-upload-list">
              {adminFiles.map(f => (
                <div key={f.id} className="admin-upload-item">
                  <span className="aui-icon">{fileIcon(f.ext)}</span>
                  <div className="aui-meta">
                    <span className="aui-name">{f.name}</span>
                    <span className="aui-detail">{formatBytes(f.size)} · {formatUploadDate(f.created_at)}</span>
                    {f.description ? <span className="aui-desc">{f.description}</span> : null}
                  </div>
                  <button type="button" className="admin-clear-btn" onClick={() => deleteUpload(f.id)} title="Remove">✕</button>
                </div>
              ))}
            </div>
          )}

          {uploadError && <p className="admin-upload-error">{uploadError}</p>}
          <div className="admin-upload-row">
            <input
              className="admin-input"
              type="text"
              placeholder="description (optional)"
              value={uploadDesc}
              onChange={e => setUploadDesc(e.target.value)}
            />
            <input ref={uploadInputRef} type="file" style={{ display: 'none' }} onChange={handleUploadFile} />
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => uploadInputRef.current?.click()} disabled={uploading}>
              {uploading ? '…' : '↑ upload file'}
            </button>
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" type="submit" disabled={loading}>
          {saved ? 'saved ✓' : loading ? '…' : 'save changes'}
        </button>
      </form>
    </div>
  )
}

function HardwareWarning() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setVisible(!gl)
  }, [])

  if (!visible) return null

  return (
    <aside className="hardware-warning">
      <AlertTriangle size={22} />
      <div>
        <strong>Hardware Acceleration is disabled</strong>
        <span>This may cause performance issues</span>
      </div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Close warning">
        <X size={18} />
      </button>
    </aside>
  )
}

export default function App() {
  if (window.location.pathname === '/admin') return <AdminPanel />
  if (window.location.pathname === '/uploads') return <UploadsPage />

  const { profile, loading } = useDiscordPresence()
  const { stats: serverStats, loading: serverLoading } = useServerStats()
  const siteContent = useSiteContent()
  const [specsOpen, setSpecsOpen] = useState(false)
  useAccentColor(getActivityImageUrl(profile.activities?.[0]), siteContent.custom_accent_color)

  const mergedProfile = {
    ...profile,
    customStatus: profile.customStatus || siteContent.custom_status || '',
    avatarUrl: siteContent.custom_avatar_url || profile.avatarUrl,
    bannerUrl: siteContent.custom_banner_url || profile.bannerUrl,
  }

  return (
    <main className="bio-shell">
      <div className="top-rainbow-bar" aria-hidden="true" />
      <div className="ascii-comment">
        <span aria-hidden="true">{siteContent.ascii_comment || 'vanillabrice'}</span>
        <a href="/uploads" className="uploads-top-link">uploads</a>
        <a href="/admin" className="uploads-top-link">login</a>
      </div>
      <div className="page-backdrop" />
      <section className="bio-container">
        <div className="top-grid">
          <ProfileCard
            profile={mergedProfile}
            loading={loading}
            nameStyle={siteContent.name_style || 'rainbow'}
            customName={siteContent.custom_name || 'Brice'}
            customHandle={siteContent.custom_handle}
            location={siteContent.location || 'St. Louis, MO'}
          />
          <div className="side-stack">
            <ActivitiesCard activities={mergedProfile.activities} />
            <ServerCard serverStats={serverStats} loading={serverLoading} />
            <AboutCard onOpenSpecs={() => setSpecsOpen(true)} aboutBio={siteContent.about_bio} />
          </div>
        </div>
        <GamesCard />
      </section>
      {specsOpen && <SpecsModal onClose={() => setSpecsOpen(false)} />}
      <HardwareWarning />
      <span className="dev-tag">made by landan</span>
    </main>
  )
}
