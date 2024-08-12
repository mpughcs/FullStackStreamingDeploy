"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Extend the global Window interface
declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

export default function OAuthButton() {
  const supabase = createClient();

  useEffect(() => {
    window.handleSignInWithGoogle = async function (response) {
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

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [supabase]);

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="<client ID>"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        // Disable FedCM usage
        data-use_fedcm_for_prompt="false"
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
