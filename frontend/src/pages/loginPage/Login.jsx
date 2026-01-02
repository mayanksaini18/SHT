import React, { useState,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext"; // keep your context path
// shadcn components (CLI generated)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // optional
import { AlertTriangle } from "lucide-react";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  // If you move logic to context, you can use this: const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth,email, password); // your auth function
      // onAuthStateChanged listener in App.jsx will handle the user state.
      // We can navigate to the main part of the app.
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      // Provide more specific error messages from Firebase
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setErr("Invalid email or password. Please try again.");
      } else {
        setErr(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Login</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

          {err && (
            <div className="mb-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
              <AlertTriangle className="w-4 h-4" />
              <div>{err}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/forgot" className="text-sm text-sky-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-600 hover:underline">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
