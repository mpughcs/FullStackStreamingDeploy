"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Stream from "@/components/Stream";

export default function ChannelPage({ params }: { params: { id: string } }) {
  const [channel, setChannel] = useState(null as any);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentUser, setCurrentUser] = useState(null as any);
  const [chatMessages, setChatMessages] = useState<{ [key: string]: any }[]>(
    []
  );
  const [isFollowingUi, setIsFollowingUi] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchChannelData = async () => {
      const { data: channelData, error } = await supabase
        .from("Channels")
        .select("*")
        .eq("id", params.id)
        .single();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in");
        return;
      }

      setCurrentUser(user);

      const { data: followData } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("followed_id", params.id)
        .single();

      setIsFollowing(!!followData); // Set to true if followData exists

      if (error) {
        console.error("Error loading channel:", error.message);
        return;
      }

      setChannel(channelData);
      setIsStreaming(channelData.is_streaming);
    };

    fetchChannelData();

    const handleChannelUpdate = (payload: {
      new: { is_streaming: boolean | ((prevState: boolean) => boolean) };
    }) => {
      console.log("Channel update received:", payload);
      setIsStreaming(payload.new.is_streaming);
    };

    const channelSubscription = supabase
      .channel(`channel-${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Channels",
          filter: `id=eq.${params.id}`,
        },
        handleChannelUpdate
      )
      .subscribe();

    const chatSubscription = supabase
      .channel(`chat-${params.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          console.log("New chat message received:", payload.new);

          setChatMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      channelSubscription.unsubscribe();
      chatSubscription.unsubscribe();
    };
  }, [params.id]);

  const sendMessage = async (message: any) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: channel.id,
        display_name: currentUser.display_name,
        message: message,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Message sent:", result.message);
    } else {
      console.error("Error sending message:", result.message);
    }
  };
  const followChannel = async () => {
    console.log(currentUser.id, channel.id);
    const response = await fetch("/api/follows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: currentUser.id,
        followed_id: channel.id,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Channel followed:", result.message);
    } else {
      console.error("Error following channel:", result.message);
    }
    setIsFollowingUi(true);
  };
  const unfollowChannel = async () => {
    console.log(currentUser.id, channel.id);
    const response = await fetch("/api/follows", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: currentUser.id,
        followed_id: channel.id,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Channel unfollowed:", result.message);
    } else {
      console.error("Error unfollowing channel:", result.message);
    }
    setIsFollowingUi(false);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <h1 className="font-bold text-xl">
            {currentUser ? currentUser.display_name : "Loading..."}
          </h1>
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
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl mb-4">
            {channel ? channel.display_name : "Loading..."}
          </h1>
          <h1 className="font-bold text-4xl text-left "> chat</h1>
        </div>

        <div className="flex gap-5 w-full ju">
          <Stream
            src="https://www.youtube.com/embed/jfKfPfyJRdk"
            // title={`${currentUser?.display_name}'s stream`}
            isStreaming={isStreaming}
          />
          <div className="flex-1 flex flex-col gap-2">
            {/* <h2 className="font-bold text-2xl">Chat</h2> */}
            <ul className=" overflow-y-auto bg-white p-4 rounded-lg shadow-md overflow-hidden h-[450px]">
              {chatMessages.map((msg, idx) => (
                <div className="text-primary-content flex gap-1 py-1" key={idx}>
                  <p >
                    <strong> {msg.display_name} </strong> {msg.message}{" "}
                  </p>
                </div>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Type a message..."
              className="border p-2 rounded-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <button
            className="py-2 px-3 flex rounded-md no-underline btn btn-primary"
            onClick={isFollowingUi ? unfollowChannel : followChannel}
          >
            {isFollowingUi ? "Unfollow" : "Follow"}
          </button>
        </div>
      </main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
