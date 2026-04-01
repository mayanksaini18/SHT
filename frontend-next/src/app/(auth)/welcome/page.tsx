import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@/components/auth/google-login";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5">
        <span className="text-lg font-semibold tracking-tight">LifeOS</span>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center px-6 md:px-16">
        <div className="flex items-center justify-between w-full gap-16">
          {/* Left — Copy */}
          <div className="w-full max-w-lg space-y-10 shrink-0">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15]">
                A better way to
                <br />
                take care of yourself.
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                Habits, mood, sleep, hydration, fitness, and insights
                — organized in one place.
              </p>
            </div>

            <div className="space-y-3 max-w-sm">
              <Link href="/register">
                <Button className="w-full h-11 font-medium">
                  Create an account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <GoogleLogin />
            </div>

            <p className="text-xs text-muted-foreground">
              Free to use. No credit card needed.
            </p>
          </div>

          {/* Right — Illustration */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <img
              src="/illustration.svg"
              alt="Wellness illustration"
              className="w-full max-w-md select-none"
              draggable={false}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LifeOS
        </p>
      </footer>
    </div>
  );
}
