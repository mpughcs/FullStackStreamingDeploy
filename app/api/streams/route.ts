import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const body = await req.json();
    const { streamer_id } = body;

    if (!streamer_id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    console.log("body", body);

    const { data, error } = await supabase.from("streams").insert([
        {
            streamer_id: streamer_id
        },
    ]);
    if (error) {
        return NextResponse.json({ message: "Error saving message", error }, { status: 500 });
    }

    return NextResponse.json({ message: "Message sent successfully", data }, { status: 200 });
}


