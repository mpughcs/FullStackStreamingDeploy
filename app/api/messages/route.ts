import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust this import path according to your setup


// POST /api/messages
// Required fields: channel_id, display_name, message
// Optional fields: none
// Returns: JSON object with message and data or error
export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();
  const { channel_id, display_name, message  } = body;

  if (!channel_id || !display_name || !message ) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  console.log('body', body);




  const { data, error } = await supabase.from('chat_messages').insert([
    {
      channel_id: channel_id,
      display_name: display_name,
      message: message,
    },
  ]);
  if (error) {
    return NextResponse.json({ message: 'Error saving message', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Message sent successfully', data }, { status: 200 });
}
