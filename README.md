# AI Mock Interview

Next 16 + React 19 TypeScript mock interview app.

Run:

```bash
npm install
npm run dev
```

Before starting the app, create `.env.local` with a Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ai_mockinterview
CRON_SECRET=replace-with-a-long-random-secret
AUTH_SECRET=replace-with-a-long-random-secret
```

The key is used only by the server-side question generation route. Creating a course sends its topic, skill level, and question count to Gemini, then saves the generated questions with the course in localStorage.

Features:

- Create courses (topic, skill level, number of questions) stored in localStorage
- Start interview per course
- Browser TTS via `speechSynthesis`
- Browser STT via `SpeechRecognition` (where supported)
- Simple grading and improvement suggestions
- Job listings backed by MongoDB Atlas through server-only API routes

Authentication and access flow:

- `/signup` creates a regular user account.
- `/profile` stores the user profile.
- `/employer/apply` submits an employer application for admin review.
- Approved employers can publish jobs at `/employer`.
- `/admin` and `/admin/users` are restricted to admins for dashboard and employer verification.
- `/admin/jobs` is restricted to admins for full job management.

Create the first administrator manually in MongoDB by setting an existing user's `role` to `admin` and `employer_status` to `approved`. Do not expose an admin signup route. Create a MongoDB Atlas cluster, add the deployment IP to Network Access, create a least-privilege database user, and copy the connection string into `MONGODB_URI`. The application creates the `jobs` and `users` collection indexes on first use. `AUTH_SECRET` must be a long random value used to sign Auth.js sessions. Never expose `MONGODB_URI` or `AUTH_SECRET` to the browser or commit `.env.local`.
