import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";

export function useProfileRedirect() {
  const { isAuthenticated, isRegistered, isLoadingProfile } = useAuth();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const navigate = router.navigate;

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoadingProfile) return;

    // Only redirect on first sign-in: authenticated, no profile yet, and we haven't already redirected this session
    if (
      isAuthenticated &&
      !isRegistered &&
      pathname !== "/profile" &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      navigate({ to: "/profile" });
    }

    // Once the user is registered, clear the flag so a future logout+login can redirect again if needed
    if (isRegistered) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, isRegistered, isLoadingProfile, pathname, navigate]);
}
