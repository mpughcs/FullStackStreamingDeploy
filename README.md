# Stonks Takehome Full Stack Assignment
deployed [here](https://full-stack-streaming-deploy-o23f.vercel.app/)

## Features
- **Guest Users**:
  - View a list of channels (profiles).
  - Visit individual channel pages.
  - Follow channels (prompted to log in if not authenticated).

- **Authenticated Users**:
  - Log in using Google OAuth.
  - Complete profile setup, including username and notification preferences.
  - Start and stop live streams (embed YouTube video as a placeholder).
  - Follow other channels and receive notifications (email) when they go live.
  - Join live chats on streaming channels.

## Tech Stack
- **Frontend**:
  - [Next.js](https://nextjs.org/): React framework for server-side rendering and static site generation.
  - [React](https://reactjs.org/): Library for building user interfaces.
  - [TailwindCSS](https://tailwindcss.com/): Utility-first CSS framework for styling.

- **Backend**:
  - [Supabase](https://supabase.io/): Backend-as-a-service providing database, authentication, and real-time subscriptions, edge functions.
  - [PostgreSQL](https://www.postgresql.org/): Open-source relational database used with Supabase.

- **Websockets**:
  - [supabase-js](https://supabase.com/docs/reference/javascript): JavaScript library to interact with Supabase, including real-time features.

- **Notifications**:
  - [Resend](https://resend.com/): Libraries for handling email notifications.


- **Deployment**:
  - [Vercel](https://vercel.com/): Platform for deploying the frontend and backend with serverless functions.

## Challenges
**OAuth Redirects**: Handling OAuth redirects and ensuring the user is redirected back to the correct page after authentication took me the most time. Moving from development to production required updating the OAuth redirect URLs in the Supabase dashboard and Google Cloud Console.

**Resend Email Notifications**: Implementing email notifications for live streams was challenging due to my unfamiliarity with supabase edge functions. I created an edge function that was triggered by a postgreSQL trigger. The function listened for new rows in the `streams` table and sent an email to all followers of the channel. I had to ensure that the edge function was correctly deployed and that the Supabase project had the correct permissions to send emails. With more time, I would include a more detailed email body and allow users to unsubscribe from notifications.
