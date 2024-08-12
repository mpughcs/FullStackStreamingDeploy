"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

export default function OAuthButton() {
  const supabase = createClient();

  // Define the global callback function
    window.handleSignInWithGoogle = async function (response: { credential: any; }) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
    });
    if (error) {
      console.error("Error signing in with Google:", error);
    } else {
      console.log("Signed in successfully:", data);
    }
  };

  useEffect(() => {
    // Ensure the Google Identity Services script is loaded
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      console.log("Google Identity Services script loaded.");
    };
    document.body.appendChild(script);

    // Cleanup the script if the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="346636204935-5jfgkh4fka70u8heocvavgjmofa1hbis.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
}
