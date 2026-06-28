const FALLBACK_STEAM_ID = '76561198431786913'
const EXCLUDED_APPIDS = new Set([480]) // Spacewar + junk
const TARGET_COUNT = 8

function json(data, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'public, max-age=0, s-maxage=120')
  headers.set('access-control-allow-origin', '*')
  return new Response(JSON.stringify(data), { ...init, headers })
}

async function fetchStoreImage(appid) {
  try {
    const r = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic&cc=us&l=en`,
    )
    if (!r.ok) return null
    const d = await r.json()
    return d[String(appid)]?.success ? d[String(appid)]?.data?.header_image ?? null : null
  } catch {
    return null
  }
}

async function enrichGames(rawGames) {
  const appids = rawGames.map((g) => g.appid).join(',')
  let storeDetails = {}
  try {
    const r = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appids}&filters=basic&cc=us&l=en`,
    )
    if (r.ok) storeDetails = await r.json()
  } catch {}

  const missedIds = rawGames
    .map((g) => g.appid)
    .filter((id) => !storeDetails[String(id)]?.success)

  if (missedIds.length > 0) {
    const retries = await Promise.all(
      missedIds.map(async (id) => ({ id, url: await fetchStoreImage(id) })),
    )
    for (const { id, url } of retries) {
      if (url) storeDetails[String(id)] = { success: true, data: { header_image: url } }
    }
  }

  return rawGames.map((game) => {
    const detail = storeDetails[String(game.appid)]
    const headerUrl = detail?.success ? detail?.data?.header_image ?? null : null
    const iconUrl = game.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      : null
    return {
      appid: game.appid,
      name: game.name,
      hoursTotal: +(game.playtime_forever / 60).toFixed(1),
      hoursRecent: game.playtime_2weeks != null ? +(game.playtime_2weeks / 60).toFixed(1) : null,
      headerUrl,
      iconUrl,
    }
  })
}

export async function onRequestGet(context) {
  // Strip BOM that can be injected when secrets are set via PowerShell pipe
  const key = (context.env.STEAM_API_KEY || '').replace(/^﻿/, '')
  if (!key) return json({ error: 'Steam API key not configured.' }, { status: 500 })

  const steamId = context.env.STEAM_ID || FALLBACK_STEAM_ID
  const url = new URL(context.request.url)
  const mode = url.searchParams.get('mode')

  // Top Games mode: GetOwnedGames sorted by total playtime, full enrich
  if (mode === 'top') {
    try {
      const res = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
      )
      if (!res.ok) return json({ games: [] })
      const data = await res.json()
      const top = (data.response?.games || [])
        .filter((g) => !EXCLUDED_APPIDS.has(g.appid) && g.playtime_forever > 0)
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, TARGET_COUNT)
      if (top.length === 0) return json({ games: [] })
      return json({ games: await enrichGames(top) })
    } catch {
      return json({ games: [] })
    }
  }

  // Default: recently played
  try {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamId}&count=30&format=json`,
    )
    if (res.ok) {
      const data = await res.json()
      const recent = (data.response?.games || [])
        .filter((g) => !EXCLUDED_APPIDS.has(g.appid))
        .slice(0, TARGET_COUNT)
      if (recent.length > 0) {
        return json({ games: await enrichGames(recent) })
      }
    }
  } catch {}

  // Fallback: most-played owned games — GameImage handles CDN fallbacks on the frontend
  try {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
    )
    if (!res.ok) return json({ games: [] })
    const data = await res.json()
    const owned = (data.response?.games || [])
      .filter((g) => !EXCLUDED_APPIDS.has(g.appid) && g.playtime_forever > 0)
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, TARGET_COUNT)
    if (owned.length === 0) return json({ games: [] })
    return json({
      games: owned.map((game) => ({
        appid: game.appid,
        name: game.name,
        hoursTotal: +(game.playtime_forever / 60).toFixed(1),
        hoursRecent: null,
        headerUrl: null,
        iconUrl: game.img_icon_url
          ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
          : null,
      })),
    })
  } catch {
    return json({ games: [] })
  }
}
