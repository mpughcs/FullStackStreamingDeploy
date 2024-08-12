import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import classNames from "classnames"; 
import { Key, ReactElement, JSXElementConstructor, ReactNode, PromiseLikeOfReactNode } from "react";

export default async function Channels() {
  const supabase = createClient();

  // Fetch the logged-in user's ID
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  // if (userError) throw userError;

  // Fetch all channels
  const { data: channels, error } = await supabase.from("Channels").select("*");
  // if (error) throw error;

  // Filter out the logged-in user's own channel
  const filteredChannels = channels?.filter((channel: { id: any; }) => channel.id !== user?.id);

  return (
    <div className="channel-list">
      {filteredChannels?.map((channel: { id: Key | null | undefined; display_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; is_streaming: any; }) => (
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
      ))}
    </div>
  );
}
