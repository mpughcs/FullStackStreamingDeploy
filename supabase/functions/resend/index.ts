// @ts-ignore

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = "re_QQNdY1q6_7ryFYTZy6QJ3sUDwjzXuvgCU";

const handler = async (request: Request): Promise<Response> => {
    try {
        const { email, subject, html } = await request.json();

        // Validate that email, subject, and html are provided
        if (!email || !subject || !html) {
            return new Response(JSON.stringify({ error: "Missing required fields: email, subject, or html" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Max <mp@maxpugh.dev>',
                to: [email],
                subject: subject,
                html: html,
            }),
        });

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

serve(handler);