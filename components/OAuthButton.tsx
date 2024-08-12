"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router"; // Import useRouter

// Extend the global Window interface
declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

export default function OAuthButton() {
  const supabase = createClient();
  const router = useRouter(); // Initialize the useRouter hook


  useEffect(() => {
    window.handleSignInWithGoogle = async function (response) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error) {
        console.error("Error signing in with Google:", error);
      } else {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
  
        const { data: userChannel, error: channelError } = 
        await supabase
          .from("Channels")
          .select("*")
          .eq("id", user?.id)
          .single();
        console.log(userChannel.display_name);
  
        if (channelError) {
          console.error("Error fetching user channel:", channelError);
        } else if (userChannel?.display_name == null) {
          router.push("/onboarding"); // Use router.push for client-side navigation
        } else {
          router.push("/mychannel"); // Use router.push for client-side navigation
        }
      }
    }
    
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
        data-client_id="346636204935-5jfgkh4fka70u8heocvavgjmofa1hbis.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
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
