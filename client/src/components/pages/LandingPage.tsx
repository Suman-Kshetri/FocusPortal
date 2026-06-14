// LandingPage.tsx
import { useEffect, useState } from "react";
import {
  Folder,
  MessageSquare,
  ThumbsUp,
  Moon,
  Sun,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const LandingPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = savedTheme || (prefersDark ? "dark" : "light");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

      {/* noise layer (theme aware) */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal"
                alt="Focus Portal"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm sm:text-base font-semibold tracking-tight hidden sm:inline">
              Focus Portal
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>

            <Link className="text-xs sm:text-sm hover:opacity-70" to="/auth/login">
              Sign in
            </Link>

            <Link
              to="/auth/register"
              className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Get Started
            </Link>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-start">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">


            <h1 className="text-6xl font-semibold leading-[1.05]">
              Study like it’s
              <br />
              <span className="italic font-light text-primary">
                actually organized.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Not another productivity app. A structured space where files,
              questions, and ideas stop getting lost.
            </p>

            <div className="flex gap-4 pt-4">

              <Link
                to="/auth/register"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Start now <ArrowRight size={16} />
              </Link>

              <Link
                to="/auth/login"
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Sign in
              </Link>

            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="lg:col-span-2 relative">

            <div className="absolute top-0 left-0 rotate-[-3deg] bg-card border border-border p-4 rounded-xl shadow-sm w-64">
              <div className="flex items-center gap-2 text-foreground">
                <Folder size={16} />
                <span className="text-sm font-medium">Algorithms</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                12 files • updated today
              </p>
            </div>

            <div className="absolute top-28 right-0 rotate-[4deg] bg-card border border-border p-4 rounded-xl shadow-sm w-64">
              <div className="flex items-start gap-2">
                <ThumbsUp size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    How does recursion work?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    18 answers
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-56 left-10 rotate-[-2deg] bg-card border border-border p-4 rounded-xl shadow-sm w-64">
              <div className="flex items-center gap-2 text-foreground">
                <Zap size={16} className="text-primary" />
                <span className="text-sm">7 day streak</span>
              </div>
            </div>

            <div className="absolute -z-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full top-20 left-10" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-40 px-6">
        <div className="max-w-4xl mx-auto space-y-20">

          {[
            {
              icon: <Folder size={20} className="text-primary" />,
              title: "Files that don’t get lost",
              desc: "Stop scattering notes across apps. Everything stays structured.",
            },
            {
              icon: <MessageSquare size={20} className="text-primary" />,
              title: "Questions that stay alive",
              desc: "Discussions evolve with answers and voting.",
            },
            {
              icon: <ThumbsUp size={20} className="text-primary" />,
              title: "Knowledge gets ranked",
              desc: "Community decides what matters most.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`flex gap-6 items-start ${
                i % 2 === 0 ? "" : "flex-row-reverse text-right"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                {f.icon}
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-medium">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* TIMELINE */}
      <section className="mt-24 sm:mt-32 md:mt-40 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto border-l border-border pl-4 sm:pl-8 space-y-8 sm:space-y-16">

          {[
            {
              step: "01",
              title: "Create account",
              desc: "No friction. Just start.",
            },
            {
              step: "02",
              title: "Organize chaos",
              desc: "Put your study material in structure.",
            },
            {
              step: "03",
              title: "Learn together",
              desc: "Ask, answer, evolve.",
            },
          ].map((s, i) => (
            <div key={i} className="relative">

              <div className="absolute -left-12 top-1 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {s.step}
              </div>

              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>

            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="mt-40 mb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          <h2 className="text-4xl font-semibold">
            Start organizing your learning
          </h2>

          <p className="text-muted-foreground">
            Less clutter. More clarity.
          </p>

          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started <ArrowRight size={16} />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-muted/30 px-6 py-10">
        <div className="max-w-6xl mx-auto flex justify-between text-sm text-muted-foreground">
          <p>Focus Portal</p>
          <p>Built by Suman</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;