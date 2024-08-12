"use client";
import { createClient } from "@/utils/supabase/client";

export default function OAuthButton() {
  const supabase = createClient();
  

  const handleOAuthSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {

        redirectTo: 'https://full-stack-streaming-deploy-o23f.vercel.app/auth/callback',

      },
    });

    if (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <button onClick={handleOAuthSignIn} className="btn btn-primary">
      Sign in with Google
    </button>
  );
}
