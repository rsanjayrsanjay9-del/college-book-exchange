import { createActor } from "@/backend";
import type { User, UserInput } from "@/backend";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function deriveEmailFromIdentity(
  identity: ReturnType<typeof useInternetIdentity>["identity"],
): string {
  if (!identity) return "";
  const principal = identity.getPrincipal().toText();
  return `${principal}@internetcomputer.org`;
}

export function useAuth() {
  const ii = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const profileQuery = useQuery<User | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !actorFetching && ii.loginStatus === "success",
  });

  const registerMutation = useMutation({
    mutationFn: async (input: UserInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerUser(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (input: UserInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMyProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  const user = profileQuery.data;
  const isAdmin = user?.email === "rsanjayrsanjay9@gmail.com";
  const isAuthenticated = ii.loginStatus === "success";
  const isRegistered = !!profileQuery.data;

  const hasAutoSaved = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      !isRegistered &&
      !profileQuery.isLoading &&
      !registerMutation.isPending &&
      !hasAutoSaved.current &&
      actor
    ) {
      hasAutoSaved.current = true;
      const email = deriveEmailFromIdentity(ii.identity);
      const input: UserInput = {
        name: "New User",
        email,
        phone: "",
        collegeName: undefined,
      };
      registerMutation.mutate(input);
    }
  }, [
    isAuthenticated,
    isRegistered,
    profileQuery.isLoading,
    registerMutation.isPending,
    actor,
    ii.identity,
    registerMutation,
  ]);

  // Reset auto-save flag when user logs out so next login can trigger again
  useEffect(() => {
    if (!isAuthenticated) {
      hasAutoSaved.current = false;
    }
  }, [isAuthenticated]);

  return {
    identity: ii.identity,
    login: ii.login,
    logout: ii.clear,
    loginStatus: ii.loginStatus,
    isAuthenticated,
    isRegistered,
    isAdmin,
    user: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    register: registerMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  };
}
