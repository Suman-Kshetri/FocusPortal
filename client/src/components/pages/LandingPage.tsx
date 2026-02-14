// LandingPage.tsx
import { useState, useEffect } from "react";
import {
  Folder,
  MessageSquare,
  ThumbsUp,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
  Users,
  FileText,
  CheckCircle,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const LandingPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const features = [
    {
      icon: <Folder className="w-6 h-6" />,
      title: "Smart File Management",
      description:
        "Organize your study materials with unlimited folders and subfolders. Never lose track of your documents again.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-Time Q&A",
      description:
        "Ask questions and get instant answers from your study community. Collaborate in real-time.",
    },
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      title: "Community Voting",
      description:
        "Upvote the best answers and let the community highlight what matters most for effective learning.",
    },
  ];

  const steps = [
    {
      step: "01",
      icon: <Users className="w-8 h-8" />,
      title: "Create Your Account",
      description:
        "Sign up in seconds with your email. No credit card required. Start your learning journey today.",
    },
    {
      step: "02",
      icon: <FileText className="w-8 h-8" />,
      title: "Organize Your Materials",
      description:
        "Upload and organize your study files in smart folders. Create documents and spreadsheets in-app.",
    },
    {
      step: "03",
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Collaborate & Excel",
      description:
        "Ask questions, share knowledge, and study together with your peers. Achieve your academic goals.",
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal"
                  alt="Focus Portal Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                FOCUS PORTAL
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-foreground" />
                )}
              </button>

              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md hover-lift"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                <Sparkles className="w-4 h-4" />
                The Future of Collaborative Learning
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Study Smarter,{" "}
                <span className="text-gradient-primary">Achieve More</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Organize your study materials, collaborate with peers in
                real-time, and access a powerful Q&A community—all in one
                platform.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover-lift"
                >
                  Start Learning Here
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right: Visual Preview */}
            <div className="relative animate-slide-in-right lg:block hidden">
              <div className="relative z-10">
                {/* Main Card */}
                <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4">
                  {/* Folder Management Preview */}
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <Folder className="w-10 h-10 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Advanced Calculus</div>
                      <div className="text-sm text-muted-foreground">
                        24 files • Updated 2h ago
                      </div>
                    </div>
                  </div>

                  {/* Q&A Preview */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                      <div className="flex flex-col items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent/20 transition-colors">
                          <ThumbsUp className="w-4 h-4 text-accent" />
                        </button>
                        <span className="text-sm font-semibold">42</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          How to solve differential equations?
                        </div>
                        <div className="text-sm text-muted-foreground">
                          3 answers • Active now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-6 -right-6 bg-card border border-border rounded-xl shadow-lg p-4 animate-bounce-gentle">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Study Streak
                      </div>
                      <div className="text-2xl font-bold">7 days</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute inset-0 gradient-primary opacity-10 rounded-3xl blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Everything You Need to{" "}
              <span className="text-gradient-primary">Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience and
              boost productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-card border border-border rounded-2xl hover-lift transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-foreground">{feature.icon}</div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Get Started in{" "}
              <span className="text-gradient-primary">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who are already studying smarter and
              achieving their goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((item, index) => (
              <div
                key={index}
                className="p-8 bg-card border border-border rounded-2xl hover-lift transition-all duration-300 group"
              >
                <div className="text-center space-y-4">
                  <div className="flex gap-4 justify-center">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-glow">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                  </div>
                  {/* Content */}
                  <h3 className="text-xl font-semibold">{item.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover-lift"
            >
              Start Your Journey Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal"
                  alt="Focus Portal Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-gradient-primary">
                Focus Portal
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 Focus Portal. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Suman-Kshetri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Crafted by dev@suman
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
