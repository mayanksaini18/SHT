import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // optional, if you generated it
// If you don't have Separator, remove the import and <Separator /> usage below

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/register");
  const handleAlreadyAccount = () => navigate("/login");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
     
      
        <section className="bg-neutral-900 text-white flex flex-col items-center justify-center gap-6 p-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center">
            Build healthy<br />habits with us
          </h1>

          {/* big decorative circle (replace with image if you want) */}
          <div
            aria-hidden="true"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-amber-400/95 shadow-xl flex items-center justify-center"
          >
            {/* optional emoji / image inside circle */}
            {/* <span className="text-4xl md:text-5xl">🌱</span> */}
          </div>

          <p className="text-sm text-neutral-300 text-center max-w-xs">
            Small steps every day make big changes track habits, build streaks,
            and feel better.
          </p>
        </section>

        {/* RIGHT: Card with CTAs / small form */}
        <aside className="flex items-center justify-center p-8 bg-white">
          <Card className="w-full max-w-sm p-6">
            <h2 className="text-2xl font-bold mb-1">Welcome</h2>
            <p className="text-sm text-slate-500 mb-6">
              Create an account to save your habits and progress.
            </p>

            {/* Primary CTA */}
            <Button
              onClick={handleGetStarted}
              className="w-full mb-3"
              // if your Button accepts `variant` prop (shadcn default), you can use that too
            >
              Create account
            </Button>

            {/* Secondary link */}
            <Button
              variant="ghost"
              onClick={handleAlreadyAccount}
              className="w-full"
            >
              I have an account
            </Button>

            <Separator className="my-6" />

            <p className="text-xs text-slate-500 text-center">
              By starting or signing in, you agree to our{" "}
              <button className="text-sky-600 underline">Terms of use</button>.
            </p>
          </Card>
        </aside>
      </div>
    
  );
}
