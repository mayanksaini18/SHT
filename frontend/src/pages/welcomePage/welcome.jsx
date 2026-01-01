import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import GoogleLogin from "@/components/GoogleLogin";


export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white text-slate-900 overflow-hidden">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-emerald-600 hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/register")}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium tracking-wide"
            >
              Start for free →
            </Button>

           
           <Button
              variant="outline"
              className="w-full h-12 border-slate-300 text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.44 7.86 10.97.57.1.78-.25.78-.55v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.04.78 2.1v3.12c0 .31.2.66.79.55 4.56-1.53 7.85-5.86 7.85-10.97C23.5 5.74 18.27.5 12 .5z" />
              </svg>
              Sign up with GitHub
            </Button>
{/* Apple */}
            <Button
              variant="outline"
              className="w-full h-12 border-slate-300 hover:bg-slate-50 flex gap-3"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.6 13.2c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.4 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.2.9-1.3 1.2-2.6 1.2-2.7-.1 0-2.3-.9-2.3-3.6zM14.4 6.3c.6-.8 1-1.9.9-3-.9 0-2 .6-2.6 1.3-.6.7-1 1.8-.9 2.9 1 .1 2-.5 2.6-1.2z" />
              </svg>
              Sign up with Apple


            </Button>
             {/* Google */}
            <GoogleLogin />
            
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 leading-relaxed">
            By signing up, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-slate-700">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-slate-700">
              Privacy Policy
            </span>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-100">
        <img
          src="https://images.unsplash.com/photo-1569230919100-d3fd5e1132f4?q=80&w=1036&auto=format&fit=crop"
          alt="Nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
