"use client"; 

import { useState, useEffect } from "react";
import Stream from "@/components/Stream";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import StartStreamButton from "@/components/StartStreamButton";
import { redirect } from "next/dist/server/api-utils";
import router from "next/router";

export default function MyChannel() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const supabase = createClient();


    const fetchChannelData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if(!user) return router.push("/login");
      if (user) {
        const { data: channelData } = await supabase
          .from("Channels")
          .select("*")
          .eq("id", user.id)
          .single();
        setIsStreaming(channelData.is_streaming);
        setDisplayName(channelData.display_name);
        
      }
    };

    fetchChannelData();
    

    const handleChannelUpdate = (payload: { new: { is_streaming: boolean | ((prevState: boolean) => boolean); }; }) => {
      console.log("Channel update received:", payload);
      setIsStreaming(payload.new.is_streaming);
    };

    const channelSubscription = supabase
      .channel("Channels")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Channels" },
        handleChannelUpdate
      )
      .subscribe();

    return () => {
      channelSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <h1 className="font-bold text-xl">Your channel</h1>
          <div className="flex gap-5">
            <Link href={"/"}>
              <button className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                All Channels
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-6 max-w-4xl px-3 w-[100%]">
        <div className="flex justify-between">
          <h1 className="font-bold text-4xl mb-4">
            {displayName ? displayName : "Loading..."}
          </h1>
          <StartStreamButton />
        </div>
        <div className="flex gap-5">
          {
            <Stream
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="lofi hip hop radio 📚 - beats to relax/study to"
              isStreaming={isStreaming}
            />
          }
        </div>
      </main>
    </div>
  );
}