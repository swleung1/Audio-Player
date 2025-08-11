import { useEffect, useRef, useState } from "react";

const LIST_URL = "https://playground.4geeks.com/sound/songs";
const MEDIA_BASE = "https://playground.4geeks.com/sound/";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(LIST_URL);
        const data = await res.json();
        setSongs(Array.isArray(data) ? data : data.songs || []);
      } catch (e) {
        console.error("Failed to load songs:", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (current === null || !songs[current] || !audioRef.current) return;
    audioRef.current.src = MEDIA_BASE + songs[current].url;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [current, songs, isPlaying]);

  const playAt = (i) => {
    if (i === current) return togglePlay();
    setCurrent(i);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!songs.length) return;
    if (current === null) {
      setCurrent(0);
      setIsPlaying(true);
      return;
    }
    const el = audioRef.current;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const next = () => {
    if (!songs.length) return;
    setCurrent((idx) => (idx === null ? 0 : (idx + 1) % songs.length));
    setIsPlaying(true);
  };

  const prev = () => {
    if (!songs.length) return;
    setCurrent((idx) =>
      idx === null ? 0 : (idx - 1 + songs.length) % songs.length
    );
    setIsPlaying(true);
  };

  return (
    <div className="page">
      <h1 className="title">My Music Player</h1>

      <section className="nowPlaying">
        <h2>Now Playing:</h2>
        <p className="track">
          {current !== null ? songs[current]?.name : "Pick a song"}
        </p>
      </section>

      <h3 className="choose">Choose a Song:</h3>

      <ul className="list">
        {songs.map((s, i) => {
          const active = i === current;
          const label = active && isPlaying ? "Pause" : "Play";
          return (
            <li key={i} className={`row ${active ? "active" : ""}`}>
              <span className="songTitle">{s.name}</span>
              <button className="btn" onClick={() => playAt(i)}>
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="controls">
        <button className="ctrl" onClick={prev} aria-label="Previous">
          <i className="fa-solid fa-backward-step" />
        </button>
        <button className="ctrl play" onClick={togglePlay} aria-label="Play/Pause">
          <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} />
        </button>
        <button className="ctrl" onClick={next} aria-label="Next">
          <i className="fa-solid fa-forward-step" />
        </button>
      </footer>

      <audio ref={audioRef} onEnded={next} preload="none" />
    </div>
  );
}
