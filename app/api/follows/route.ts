import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server'; // Adjust this import path according to your setup

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();
  const { follower_id, followed_id } = body;

  if (!follower_id || !followed_id ) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const { data: followerData, error: followerError } = await supabase.from('Channels').select('email').eq('id', follower_id).single();

  const { data, error } = await supabase.from('follows').insert([
    {
      email: followerData?.email,
      follower_id: follower_id,
      followed_id: followed_id,
    },
  ]);
  if (error) {
    return NextResponse.json({ message: 'Error saving follower', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Follower added successfully', data }, { status: 200 });
}

export async function DELETE(req: Request) {
  const supabase = createClient();
  const body = await req.json();
  const { follower_id, followed_id } = body;

  if (!follower_id || !followed_id ) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  // console.log('body', body);

  const { data, error } = await supabase.from('follows').delete().eq('follower_id', follower_id).eq('followed_id', followed_id);
  if (error) {
    return NextResponse.json({ message: 'Error deleting follower', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Follower deleted successfully', data }, { status: 200 });
}