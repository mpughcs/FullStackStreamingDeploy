"use client";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function StartStreamButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userChannel, setUserChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null); // Store the ID of the active stream

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(userData.user);

        if (userData?.user) {
          const { data: channelData, error: channelError } = await supabase
            .from("Channels")
            .select("*")
            .eq("id", userData.user.id)
            .single();
          if (channelError) throw channelError;
          setUserChannel(channelData);
          setIsStreaming(channelData.is_streaming);

          // Check if there's an active stream and store its ID
          const { data: activeStream, error: activeStreamError } = await supabase
            .from("streams")
            .select("id")
            .eq("streamer_id", userData.user.id)
            .single();

          if (activeStreamError && activeStreamError.code !== 'PGRST116') throw activeStreamError;
          if (activeStream) setStreamId(activeStream.id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const startStreamHandler = async () => {
    console.log("startStreamHandler");
    console.log("user", user);
    try {
      if (user) {
        if (isStreaming) {
          // Stop streaming: delete the active stream
          const { error: deleteError } = await supabase
            .from("streams")
            .delete()
            .eq("id", streamId);

          if (deleteError) throw deleteError;

          setStreamId(null); // Clear the stored stream ID
        } else {
          // Start streaming: create a new stream
          const { data, error } = await supabase.from("streams").insert([
            {
              streamer_id: user.id,
            },
          ]).select();

          if (error) throw error;
          setStreamId(data[0].id); // Store the ID of the new stream
        }

        const newStreamingStatus = !isStreaming; // Toggle the streaming status
        const { error: updateError } = await supabase
          .from("Channels")
          .update({ is_streaming: newStreamingStatus })
          .eq("id", user.id);
        if (updateError) throw updateError;

        setIsStreaming(newStreamingStatus); // Update the local state to reflect the change
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={(e) => {e.preventDefault(); startStreamHandler();}}>
      <button
        type="submit"
        className="py-2 px-4 rounded-md no-underline btn bg-btn-background hover:bg-btn-background-hover"
        disabled={!userChannel}
      >
        {loading ? "Loading..." : isStreaming ? "Stop Stream" : "Start Stream"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
