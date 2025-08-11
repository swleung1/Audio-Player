const LIST_URL = "https://playground.4geeks.com/sound/songs";

export async function fetchSongs() {
  const res = await fetch(LIST_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.songs || [];
}

export const MEDIA_BASE = "https://playground.4geeks.com/sound/";
