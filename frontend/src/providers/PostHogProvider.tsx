"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Only init if we have a key, acts as a feature flag
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

        if (key) {
            posthog.init(key, {
                api_host: host,
                person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
                capture_pageview: false, // We'll handle this manually if needed or let auto-capture do it
            });
        }
    }, []);

    return <PHProvider client={posthog}>{children}</PHProvider>;
}
