"use client";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

// Onboarding page
export default function Onboarding() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Handle the continue button click event
  const continueHandler = async (e: any) => {
    e.preventDefault();
    await updateDisplayName();
    await updateEmailNotifications();
    router.push("/mychannel");
  };
  // Update the user's display name
  const updateDisplayName = async () => {
    const response = await fetch("/api/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName }),
    });
  };
  // Update the user's email notification preferences
  const updateEmailNotifications = async () => {
    const response = await fetch("/api/update-email-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailNotifications }),
    });
  };

  return (
    <div className="flex flex-col flex-1 justify-center gap-2 px-8 w-full sm:max-w-md">
      <Link
        href="/"
        className="top-8 left-8 absolute flex items-center bg-btn-background hover:bg-btn-background-hover px-4 py-2 rounded-md text-foreground text-sm no-underline group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex flex-col flex-1 justify-center gap-5 w-full text-foreground">
        <label className="text-md">Display Name</label>
        <input
          className="bg-inherit mb-6 px-4 py-2 border rounded-md"
          placeholder="john_doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <div className="flex flex-col gap-4 mb-10">
          <label className="text-md" htmlFor="password">
            Notification Preferences
          </label>
          <label className="cursor-pointer label">
            <span className="label-text">Receive Email Notifications?</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </label>
        </div>
        <button className="btn btn-primary" onClick={continueHandler}>
          Continue
        </button>
      </form>
    </div>
  );
}
