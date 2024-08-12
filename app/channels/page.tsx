"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import classNames from "classnames";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  PromiseLikeOfReactNode,
} from "react";

import { useEffect, useState } from "react";
// this is the default Channels component that will be rendered when a user navigates to the /channels page in the app
export default function Channels() {
  const supabase = createClient();

  const [channels, setChannels] = useState<any[] | undefined>([]);

  useEffect(() => {
    // fetch channels
    async function fetchChannels() {
      // Fetch the logged-in user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const { data: channels, error } = await supabase
        .from("Channels")
        .select("*");

      // filter out the logged-in user's own channel
      const filteredChannels = channels?.filter(
        (channel: { id: any }) => channel.id !== user?.id
      );
      setChannels(filteredChannels);
    }

    fetchChannels();
    // Subscribe to channel updates
    const handleChannelUpdate = (payload: { new: { is_streaming: boolean | ((prevState: boolean) => boolean); }; }) => {
      console.log("Channel update received:", payload);
      fetchChannels();
    };
    
    // Subscribe to channel updates
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
    }
  }, [supabase]);



  return (
    // display channels
    <div className="channel-list">
      {/* map through channels */}
      {channels?.map(
        (channel: {
          id: Key | null | undefined;
          display_name:
            | string
            | number
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | PromiseLikeOfReactNode
            | null
            | undefined;
          is_streaming: any;
        }) => (
          <Link href={`/channels/${channel.id}`} key={channel.id} passHref>
            <div
              className={classNames(
                "flex p-2 gap-5 justify-start rounded-md mx-10 my-5 h-[70px] cursor-pointer btn bg-primary text-white"
              )}
            >
              {/* rounded image */}
              <img
                src={
                  "https://img.freepik.com/free-photo/funny-monkey-with-glasses-studio_23-2150844100.jpg"
                }
                alt={channel?.display_name?.toString() ?? ""}
                className="rounded-full w-14 h-14 object-cover"
              />
              <div className="flex self-end pb-1 justify-between w-[300px]">
                <h1 className="text-3xl">{channel.display_name}</h1>
                <h1 className="text-3xl">
                  {channel.is_streaming ? "online" : "offline"}
                </h1>
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
}
