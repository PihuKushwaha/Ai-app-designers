# AI App Designer

Turn any app idea into a complete, production-ready product blueprint —
PRD, features, user roles, screens, database schema, API spec, security
architecture and testing plan — before a single line of code is written.

## How it works

1. **Idea** — you type your app idea in one sentence.
2. **Conversation** — the AI (acting as a Product Manager / UX / System
   Architect) asks only the questions it genuinely needs, one at a time,
   until it has enough context.
3. **Blueprint** — it generates the full architecture document, rendered as
   a "drafting sheet," exportable as Markdown or JSON, and saveable to your
   Firebase project.

The whole product spec (modules, screen generator rules, output format) is
encoded in `src/data/systemPrompt.js` — edit that file to change how the AI
thinks, what it covers, or the section order of the final blueprint.

## Stack

- React (Vite) + Tailwind CSS
- Firebase (anonymous auth + Firestore, for saving blueprints)
- Vercel serverless function (`/api/generate.js`) that calls the Gemini API,
  keeping your API key off the client
- `react-markdown` to render the generated blueprint

## Local setup

```bash
npm install
cp .env.example .env
# fill in the VITE_FIREBASE_* values from your Firebase project settings
```

Because the AI calls go through a Vercel serverless function, plain `vite`
dev server won't run `/api/generate.js`. Use the Vercel CLI locally instead:

```bash
npm install -g vercel
vercel dev
```

Add `GEMINI_API_KEY` to a `.env` file that `vercel dev` picks up, or export
it in your shell before running `vercel dev`.

## Deploy (Vercel)

1. Push this project to a GitHub repo.
2. Import the repo in Vercel.
3. In Project Settings → Environment Variables, add:
   - `GEMINI_API_KEY` (server-side only — get one at https://aistudio.google.com/apikey)
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
     `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
4. In Firebase Console: enable **Anonymous** sign-in (Authentication → Sign-in method)
   and create a **Firestore** database (start in test mode, then lock down rules below).
5. Deploy.

### Suggested Firestore rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/blueprints/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## What's implemented vs. what to extend next

**Implemented (v1):**
- Dynamic question engine (idea → clarifying Q&A → readiness detection)
- Full blueprint generation (17-section architecture doc, spec-driven)
- Blueprint viewer with "drafting sheet" visual style
- Export to Markdown / JSON
- Save/reload past blueprints (Firebase, anonymous auth)

**Natural next steps** (the spec's export/screen-detail depth goes further
than a first build should try to cover at once):
- PDF export (e.g. via a library like `jspdf` or a serverless HTML→PDF step)
- Per-screen detail drill-down (click a screen in the blueprint to expand
  its full spec: components, states, animations, edge cases)
- Figma/Flutter/React Native folder-structure export
- Real email/Google login instead of anonymous auth, if blueprints should
  follow a real account across devices
- A dedicated color/typography "Design System Generator" step, run after
  the blueprint, that proposes an actual palette + type scale for the idea
