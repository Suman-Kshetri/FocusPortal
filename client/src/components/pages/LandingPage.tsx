// LandingPage.tsx
import { useState } from "react";
import {
  Folder,
  ThumbsUp,
  ArrowRight,
  Zap,
  Smartphone,
  Check,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

/** 👉 Replace with the real URL of your mobile app download page. */
const APP_DOWNLOAD_URL = "https://your-app-website.com/download";

const subjects = [
  { name: "Algorithms", files: 12, fresh: true },
  { name: "Databases", files: 8, fresh: false },
  { name: "Computer Networks", files: 5, fresh: false },
];

// 28 days of study activity: 0 = none, 1-3 = intensity. Last 7 are the streak.
const activity = [
  0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 0, 3, 1, 0, 0, 2, 1, 0, 1, 3,
  2, 2, 3, 2, 3, 3, 3,
];
const heat = [
  "bg-[#232129]",
  "bg-[#9E9EFF]/25",
  "bg-[#9E9EFF]/55",
  "bg-[#9E9EFF]",
];

const features = [
  {
    title: "Files stay where you put them",
    desc: "Notes, slides and past papers sit in one structured space, grouped by subject, instead of being scattered across five apps and three chat groups.",
  },
  {
    title: "Questions keep growing",
    desc: "A question isn’t closed when it’s answered. People reply, refine and add examples, and the thread gets better over time.",
  },
  {
    title: "The best answer rises",
    desc: "Votes push the most useful explanations to the top, so you read less and understand more.",
  },
];

// Placeholder testimonials – swap for real feedback from your users.
const testimonials = [
  {
    quote:
      "I used to dig through chat groups for last year’s notes. Now I open one folder and everything is there.",
    name: "Aarati S.",
    role: "Computer Science, 3rd year",
  },
  {
    quote:
      "Someone explained recursion better than my lecturer, and the votes told me I could trust it.",
    name: "Bikash T.",
    role: "Engineering student",
  },
  {
    quote: "The streak keeps me honest. Ten minutes a day adds up fast.",
    name: "Nisha R.",
    role: "BBA student",
  },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6BCB]";

const btnPrimary = `group inline-flex items-center justify-center gap-2 rounded-[20px] bg-white px-[18px] py-2 text-sm font-bold text-[#030405] transition-opacity duration-200 hover:opacity-70 active:opacity-100 ${focusRing}`;
const btnGhost = `inline-flex items-center justify-center gap-2 rounded-[20px] border border-[#2c2a33] px-[18px] py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#151617] ${focusRing}`;
const btnAccent = `inline-flex items-center justify-center gap-2 rounded-[20px] bg-[#9E9EFF] px-[18px] py-2 text-sm font-bold text-[#010203] transition-opacity duration-200 hover:opacity-70 active:opacity-100 ${focusRing}`;

/** Hero visual: one flat, aligned "study desk" panel instead of floating cards. */
const StudyDesk = () => {
  const [voted, setVoted] = useState(false);
  const votes = 18 + (voted ? 1 : 0);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#151617]">
      {/* Subjects */}
      <div className="px-5 py-4">
        <p className="mb-2 text-sm text-[#827C8C]">Your subjects</p>
        <ul>
          {subjects.map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-3 border-t border-[#232129] py-2.5 first:border-t-0"
            >
              <Folder size={16} className="shrink-0 text-[#827C8C]" />
              <span className="flex-1 text-sm font-bold">{s.name}</span>
              {s.fresh && (
                <span className="rounded-2xl bg-[#FFD561]/15 px-2 py-0.5 text-xs text-[#FFD561]">
                  updated today
                </span>
              )}
              <span className="w-14 text-right text-sm text-[#827C8C]">
                {s.files} files
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Question thread */}
      <div className="flex gap-4 border-t border-[#232129] px-5 py-4">
        <button
          type="button"
          onClick={() => setVoted((v) => !v)}
          aria-pressed={voted}
          aria-label="Upvote this question"
          className={`flex h-14 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-bold transition-colors duration-100 ${focusRing} ${
            voted
              ? "border-[#9E9EFF] bg-[#9E9EFF] text-[#010203]"
              : "border-[#2c2a33] text-white hover:bg-[#232129]"
          }`}
        >
          <ThumbsUp size={14} />
          {votes}
        </button>
        <div className="min-w-0 space-y-2">
          <p className="font-display text-lg font-bold leading-[1.5] tracking-[-0.45px]">
            How does recursion work?
          </p>
          <p className="text-sm leading-[1.5] text-[#827C8C]">
            Every call waits for a smaller version of the same problem to
            finish, then builds its answer from the result.
          </p>
          <p className="flex items-center gap-1 text-xs text-[#9E9EFF]">
            <Check size={14} /> Accepted answer · 18 replies
          </p>
        </div>
      </div>

      {/* Streak */}
      <div className="border-t border-[#232129] px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Zap size={16} className="text-[#FFD561]" />7 day streak
          </span>
          <span className="text-xs text-[#827C8C]">Last 28 days</span>
        </div>
        <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
          {activity.map((level, i) => (
            <span
              key={i}
              className={`aspect-square rounded-sm ${
                i === activity.length - 1 ? "bg-[#FFD561]" : heat[level]
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-[#010203] text-white antialiased"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&family=Jost:wght@500;700&display=swap');
        .font-display { font-family: 'Jost', system-ui, sans-serif; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 z-[300] w-full border-b border-[#151617] bg-[#010203]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className={`flex items-center gap-3 rounded-lg ${focusRing}`}>
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#2c2a33]">
              <img
                src="https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal"
                alt="Focus Portal"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-display hidden text-lg font-bold tracking-[-0.45px] sm:inline">
              Focus Portal
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden items-center gap-2 rounded-[20px] border border-[#2c2a33] px-[14px] py-2 text-sm font-bold transition-colors duration-200 hover:bg-[#151617] sm:inline-flex ${focusRing}`}
            >
              <Smartphone size={16} />
              Get the app
            </a>
            <Link
              to="/auth/login"
              className={`rounded-lg px-2 py-1 text-sm transition-opacity duration-200 hover:opacity-70 ${focusRing}`}
            >
              Sign in
            </Link>
            <Link to="/auth/register" className={btnPrimary}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-4 pt-32 sm:px-6 sm:pt-40">
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <h1 className="font-display text-[40px] font-bold leading-[1.3] tracking-[-1px] sm:text-[56px] sm:tracking-[-1.4px]">
              Study like it’s actually organized.
            </h1>

            <p className="max-w-xl text-base leading-[1.5] text-[#827C8C] sm:text-lg">
              One place for your files, your questions and the best answers
              from classmates, on the web and on your phone.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/auth/register" className={btnPrimary}>
                Start now
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-45"
                />
              </Link>
              <a
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={btnAccent}
              >
                <Smartphone size={16} />
                Download the app
              </a>
              <Link to="/auth/login" className={btnGhost}>
                Sign in
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            <StudyDesk />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-24 px-4 sm:mt-32 sm:px-6">
        <div className="mx-auto max-w-[1360px]">
          <h2 className="font-display max-w-2xl text-[32px] font-bold leading-[1.3] tracking-[-1px] sm:text-[40px]">
            Less hunting. More studying.
          </h2>

          <div className="mt-10">
            {features.map((f) => (
              <div
                key={f.title}
                className="grid gap-3 border-t border-[#232129] py-8 md:grid-cols-12 md:gap-12"
              >
                <h3 className="font-display text-2xl font-medium leading-[1.5] tracking-[-0.6px] md:col-span-5">
                  {f.title}
                </h3>
                <p className="text-base leading-[1.5] text-[#827C8C] md:col-span-7">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-24 px-4 sm:mt-32 sm:px-6">
        <div className="mx-auto grid max-w-[1360px] gap-3 md:grid-cols-12">
          <figure className="flex flex-col justify-between gap-10 rounded-lg bg-[#232129] px-6 py-8 sm:px-8 md:col-span-7">
            <blockquote className="font-display text-2xl font-medium leading-[1.5] tracking-[-0.6px] sm:text-[32px] sm:leading-[1.4]">
              “{testimonials[0].quote}”
            </blockquote>
            <figcaption>
              <p className="font-bold">{testimonials[0].name}</p>
              <p className="text-sm text-[#827C8C]">{testimonials[0].role}</p>
            </figcaption>
          </figure>

          <div className="grid gap-3 md:col-span-5">
            {testimonials.slice(1).map((t) => (
              <figure
                key={t.name}
                className="flex flex-col justify-between gap-6 rounded-lg bg-[#151617] px-6 py-6"
              >
                <blockquote className="text-base leading-[1.5]">
                  “{t.quote}”
                </blockquote>
                <figcaption>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-sm text-[#827C8C]">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / APP DOWNLOAD */}
      <section className="mb-24 mt-24 px-4 sm:mb-32 sm:mt-32 sm:px-6">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-8 border-t border-[#232129] pt-12 md:flex-row md:items-end">
          <div className="max-w-xl space-y-3">
            <h2 className="font-display text-[32px] font-bold leading-[1.3] tracking-[-1px] sm:text-[40px]">
              Take your study space with you.
            </h2>
            <p className="text-base leading-[1.5] text-[#827C8C]">
              Open files, answer questions and keep your streak going from your
              phone.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={btnAccent}
            >
              <Smartphone size={16} />
              Download the app
            </a>
            <Link to="/auth/register" className={btnPrimary}>
              Use on the web
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:rotate-45"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#151617] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-4 text-sm text-[#827C8C]">
          <p>Focus Portal</p>
          <p>Built by Suman</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;