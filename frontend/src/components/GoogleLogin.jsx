import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function GoogleLogin() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener in App.jsx will handle the user state.
      // We can navigate to the main part of the app.
      navigate("/");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      // Optionally, show an error to the user (e.g., with a toast notification)
    }
  };

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className="w-full h-12 border-slate-300 hover:bg-slate-50 flex gap-3"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.03 1.54 7.41 2.82l5.05-4.91C33.27 4.5 28.99 2.5 24 2.5 14.9 2.5 7.25 8.58 4.7 16.77l6.24 4.84C12.39 14.2 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.64-.15-3.21-.43-4.73H24v9.01h12.4c-.54 2.9-2.16 5.35-4.6 7.02l7.05 5.46c4.12-3.8 6.25-9.38 6.25-16.76z"
        />
        <path
          fill="#FBBC05"
          d="M10.94 28.39A14.5 14.5 0 0 1 10 24c0-1.53.27-3.01.75-4.39l-6.24-4.84A23.95 23.95 0 0 0 2 24c0 3.84.93 7.47 2.57 10.78l6.37-6.39z"
        />
        <path
          fill="#34A853"
          d="M24 45.5c5 0 9.19-1.65 12.25-4.49l-7.05-5.46c-1.96 1.32-4.48 2.1-5.2 2.1-6.2 0-11.46-4.68-13.06-10.87l-6.37 6.39C7.26 40.92 14.9 45.5 24 45.5z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}

export default GoogleLogin;
