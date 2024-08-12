import { createClient } from "@/utils/supabase/server";

// Update the user's display name
// POST /api/update-username
// req.body: { displayName: string }
// res: { success: true }
// or { error: string }
export async function POST(req) {
  const { displayName } = await req.json();

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  

  const userId = user?.id;
  const { data: userChannel, error: channelError } = await supabase
    .from("Channels")
    .update({ display_name: displayName })
    .eq("id", userId);

  if (channelError) {
    return new Response(JSON.stringify({ error: channelError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
