import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@/components/auth/google-login";
import { ArrowRight } from "lucide-react";

const modules = [
  {
    icon: "/mood.svg",
    label: "Mood",
    value: "😊 Feeling good",
    color: "bg-violet-500/10 border-violet-500/20",
    style: { top: "4%", left: "2%", animationDelay: "0s", animationDuration: "4.2s" },
  },
  {
    icon: "/sleep.svg",
    label: "Sleep",
    value: "7.5h last night",
    color: "bg-sky-500/10 border-sky-500/20",
    style: { top: "8%", right: "0%", animationDelay: "0.8s", animationDuration: "5s" },
  },
  {
    icon: "/water.svg",
    label: "Water",
    value: "6 / 8 glasses",
    color: "bg-cyan-500/10 border-cyan-500/20",
    style: { bottom: "18%", left: "0%", animationDelay: "1.6s", animationDuration: "4.6s" },
  },
  {
    icon: "/healthy-habit.svg",
    label: "Habits",
    value: "3 / 4 done",
    color: "bg-emerald-500/10 border-emerald-500/20",
    style: { bottom: "8%", right: "2%", animationDelay: "2.4s", animationDuration: "5.4s" },
  },
  {
    icon: "/fitness.svg",
    label: "Fitness",
    value: "240 kcal",
    color: "bg-orange-500/10 border-orange-500/20",
    style: { top: "44%", right: "-2%", animationDelay: "1.2s", animationDuration: "4.8s" },
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 animate-fade-in">
        <span className="text-lg font-semibold tracking-tight">LifeOS</span>
        <Link href="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center px-6 md:px-16">
        <div className="flex items-center justify-between w-full gap-16">

          {/* Left — Copy */}
          <div className="w-full max-w-lg space-y-10 shrink-0">
            <div className="space-y-4">
              <h1
                className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                A better way to
                <br />
                take care of yourself.
              </h1>
              <p
                className="text-muted-foreground text-base leading-relaxed max-w-md animate-fade-in-up"
                style={{ animationDelay: "0.25s" }}
              >
                Habits, mood, sleep, hydration, fitness, and insights
                — organized in one place.
              </p>
            </div>

            <div
              className="space-y-0 max-w-sm animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/register">
                <Button className="w-full h-11 font-medium">
                  Create an account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <div className="flex items-center gap-3 py-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <GoogleLogin />
            </div>

            <p
              className="text-xs text-muted-foreground animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Free to use. No credit card needed.
            </p>
          </div>

          {/* Right — Animated illustration composition */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="relative w-full max-w-md aspect-square">

              {/* Main illustration — slow float */}
              <img
                src="/illustration.svg"
                alt="Wellness illustration"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />

              {/* Floating module cards */}
              {modules.map((mod) => (
                <div
                  key={mod.label}
                  className={`animate-float-sm absolute flex items-center gap-2.5 px-3 py-2 rounded-xl border backdrop-blur-sm ${mod.color}`}
                  style={mod.style as React.CSSProperties}
                >
                  <img
                    src={mod.icon}
                    alt={mod.label}
                    className="h-7 w-7 shrink-0 select-none"
                    draggable={false}
                  />
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground leading-none mb-0.5">{mod.label}</p>
                    <p className="text-xs font-semibold leading-none">{mod.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-6 animate-fade-in" style={{ animationDelay: "0.7s" }}>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LifeOS
        </p>
      </footer>
    </div>
  );
}
