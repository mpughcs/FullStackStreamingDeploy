"use client";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { kMaxLength } from "buffer";

export default function Onboarding() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");

  function continueHandler() {
    event?.preventDefault(); // Prevent default form submission
    // update-username()
    updateDisplayName();
    router.push("/mychannel");
  }
  const updateDisplayName = async () => {
    const response = await fetch("/api/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName }),
    });
    if (response.ok) {
      router.push("/mychannel");
    }
  };

  useEffect(() => {
    console.log("displayName", displayName);
  }, [displayName]);

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-5 text-foreground">
        <label className="text-md">Display Name</label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          placeholder="john_doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <div className="flex flex-col gap-4 mb-10">
          <label className="text-md" htmlFor="password">
            Notification Preferences
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Remember me</span>
            <input type="checkbox" defaultChecked className="checkbox" />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Remember me</span>
            <input type="checkbox" defaultChecked className="checkbox" />
          </label>
        </div>
        <button className="btn btn-primary" onClick={continueHandler}>
          Continue
        </button>
      </form>
    </div>
  );
}
