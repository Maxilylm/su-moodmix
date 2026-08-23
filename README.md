# MoodMix

> Describe a mood or activity and get a 15-track playlist built around it.

**[Live demo](https://su-moodmix.vercel.app)**

Recommendation algorithms react to what you already played, not to the specific evening you're trying to soundtrack. MoodMix takes a free-text mood — "late night drive through the city", "rainy Sunday coding session" — plus an optional genre filter, and asks Groq's Llama 3.3 70B to curate 15 real, existing songs. The result is a named playlist with a description, a per-song note on why it belongs, and a gradient cover built from two hex colors the model picks to match the mood.

## Features

- Free-text mood, vibe, or activity prompt
- Optional genre filter across ten options, from Any to Pop, Jazz, Indie, R&B, and Latin
- 15 songs per playlist, each with artist, release year, and a reason for inclusion
- Generated playlist name, description, and two-color gradient cover art
- Copy the full tracklist to the clipboard as plain text
- Spotify-inspired dark interface — recommendations only, no Spotify account or integration involved

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Groq API — `llama-3.3-70b-versatile` in JSON response mode

## Running locally

```bash
npm install
npm run dev
```

Set `GROQ_API_KEY` in `.env.local`.

---

Part of a series of 91 small web apps. [Browse them all](https://su-slopmachine.vercel.app).
