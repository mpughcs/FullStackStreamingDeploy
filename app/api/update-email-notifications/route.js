import { createClient } from "@/utils/supabase/server";


// Update the user's email notifications preferences
// POST /api/update-email-notifications
// req.body: { emailNotifications: boolean }
// res: { success: true }
// or { error: string }

export async function POST(req) {
  const { emailNotifications } = await req.json();
  console.log("preferences", emailNotifications);

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  

  const userId = user?.id;
  console.log(userId);
  const { data: userChannel, error: channelError } = await supabase
    .from("Channels")
    .update({ receive_notifications: emailNotifications })
    .eq("id", userId);

  
  if (channelError) {
    return new Response(JSON.stringify({ error: channelError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
