import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";



function GoogleLogin() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      const token = await user.getIdToken();

      console.log("User:", user);
      console.log("Firebase Token:", token);

      // send token to backend if needed
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleLogin}>Continue with Google</button>;
}

export default GoogleLogin;
