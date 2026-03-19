"use client";

import { useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Song {
  title: string;
  artist: string;
  year: number;
  reason: string;
}

interface Playlist {
  playlistName: string;
  description: string;
  coverGradient: { from: string; to: string };
  songs: Song[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const GENRES = [
  "Any",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Indie",
  "R&B",
  "Latin",
];

// ── Component ──────────────────────────────────────────────────────────────

export default function Home() {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("Any");
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSong, setExpandedSong] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = mood.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError("");
    setPlaylist(null);
    setExpandedSong(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: mood.trim(), genre }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setPlaylist(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [canGenerate, mood, genre]);

  const handleCopyPlaylist = useCallback(async () => {
    if (!playlist) return;
    const text = playlist.songs
      .map((s, i) => `${i + 1}. ${s.title} - ${s.artist}`)
      .join("\n");
    await navigator.clipboard.writeText(
      `${playlist.playlistName}\n\n${text}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [playlist]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#282828] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36c-.2.2-.51.2-.71 0-1.95-1.19-4.41-1.46-7.31-.8-.28.07-.56-.1-.63-.38-.07-.28.1-.56.38-.63 3.17-.72 5.89-.41 8.07.92.2.12.27.39.2.59zm1.22-2.71c-.25.25-.62.25-.87 0-2.23-1.37-5.63-1.77-8.27-.97-.33.1-.68-.09-.78-.42-.1-.33.09-.68.42-.78 3.01-.91 6.75-.47 9.3 1.1.25.15.33.49.2.74v.33zm.11-2.82c-2.68-1.59-7.09-1.74-9.65-.96-.41.12-.84-.11-.96-.52-.12-.41.11-.84.52-.96 2.93-.89 7.82-.72 10.9 1.11.37.22.49.7.27 1.07-.22.37-.7.49-1.08.26z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-tight">
                MoodMix
              </h1>
              <p className="text-xs text-[#b3b3b3]">
                AI Playlist Generator
              </p>
            </div>
          </div>
          <a
            href="https://github.com/maxilylm/su-moodmix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#b3b3b3] hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            What&#39;s your vibe?
          </h2>
          <p className="text-[#b3b3b3] text-lg max-w-xl mx-auto">
            Describe your mood and get a curated playlist of 15 songs,
            powered by AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
              Describe your mood, vibe, or activity
            </label>
            <textarea
              placeholder="e.g. rainy Sunday morning coding session, late night drive through the city, energetic gym workout, cozy winter evening with hot chocolate..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#282828] bg-[#121212] text-white text-sm placeholder:text-[#535353] focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]/50 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
                Genre preference
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-[#282828] bg-[#121212] text-white text-sm focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]/50 transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b3b3b3' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g === "Any" ? "Any genre" : g}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className={`px-8 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                canGenerate && !loading
                  ? "bg-[#1DB954] text-black hover:bg-[#1ed760] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  : "bg-[#282828] text-[#535353] cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Playlist"
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            <div className="h-40 rounded-2xl animate-shimmer" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl animate-shimmer"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {/* Playlist Results */}
        {playlist && (
          <section className="animate-fade-in-up">
            {/* Playlist Header Card */}
            <div
              className="rounded-2xl p-6 mb-6 relative overflow-hidden animate-gradient"
              style={{
                background: `linear-gradient(135deg, ${playlist.coverGradient.from}, ${playlist.coverGradient.to}, ${playlist.coverGradient.from})`,
              }}
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
                  Playlist
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {playlist.playlistName}
                </h3>
                <p className="text-sm text-white/80 mb-4 max-w-lg">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/60">
                    {playlist.songs.length} songs
                  </span>
                  <button
                    onClick={handleCopyPlaylist}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/30 text-white/90 hover:bg-black/50 transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy Playlist
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Song List */}
            <div className="space-y-1">
              {playlist.songs.map((song, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <button
                    onClick={() =>
                      setExpandedSong(expandedSong === i ? null : i)
                    }
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left cursor-pointer"
                  >
                    {/* Track Number */}
                    <span className="w-6 text-right text-sm text-[#b3b3b3] group-hover:text-white font-mono flex-shrink-0">
                      {i + 1}
                    </span>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate">
                        {song.artist}
                      </p>
                    </div>

                    {/* Year Badge */}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#282828] text-[#b3b3b3] flex-shrink-0">
                      {song.year}
                    </span>

                    {/* Expand Arrow */}
                    <svg
                      className={`w-4 h-4 text-[#b3b3b3] transition-transform flex-shrink-0 ${
                        expandedSong === i ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded Reason */}
                  {expandedSong === i && (
                    <div className="ml-14 mr-4 mb-2 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#282828] animate-fade-in-up">
                      <p className="text-xs text-[#1DB954] font-semibold mb-1">
                        Why it fits
                      </p>
                      <p className="text-sm text-[#b3b3b3] leading-relaxed">
                        {song.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#282828] mt-20">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center text-xs text-[#535353]">
          Powered by Groq + Llama 3.3 &middot; Songs are AI-recommended
          &mdash; search your favorite streaming service to listen
        </div>
      </footer>
    </div>
  );
}
