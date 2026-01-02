import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// shadcn components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await register(form); // your custom register logic
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white p-8 shadow-lg border">
          <h2 className="text-2xl font-bold mb-1">Create an account</h2>
          <p className="text-sm text-slate-500 mb-6">
            Enter your details below to register
          </p>

          {/* Error message */}
          {err && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
