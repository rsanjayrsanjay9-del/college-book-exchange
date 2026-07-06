import { createActor } from "@/backend";
import type {
  Book,
  BookId,
  BookInput,
  Interest,
  InterestId,
  User,
  UserId,
  UserInput,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, ready: !!actor && !isFetching };
}

// Books
export function useListBooks() {
  const { actor, ready } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBooks();
    },
    enabled: ready,
  });
}

export function useSearchBooks(
  searchTerm: string | null,
  collegeFilter: string | null,
) {
  const { actor, ready } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["books", "search", searchTerm, collegeFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchBooks(searchTerm, collegeFilter);
    },
    enabled: ready,
  });
}

export function useGetBook(id: BookId | null) {
  const { actor, ready } = useBackendActor();
  return useQuery<Book | null>({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBook(id);
    },
    enabled: ready && id !== null,
  });
}

export function useGetMyBooks() {
  const { actor, ready } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["myBooks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBooks();
    },
    enabled: ready,
  });
}

export function useCreateBook() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBook(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
    },
  });
}

export function useUpdateBook() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: BookId; input: BookInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateBook(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
    },
  });
}

export function useDeleteBook() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BookId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBook(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
    },
  });
}

// Interests
export function useExpressInterest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: BookId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.expressInterest(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInterests"] });
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "notifications", "unreadCount"],
      });
    },
  });
}

export function useGetMyInterests() {
  const { actor, ready } = useBackendActor();
  return useQuery<Interest[]>({
    queryKey: ["myInterests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInterests();
    },
    enabled: ready,
  });
}

export function useGetInterestsForMyBooks() {
  const { actor, ready } = useBackendActor();
  return useQuery<Interest[]>({
    queryKey: ["interestsForMyBooks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInterestsForMyBooks();
    },
    enabled: ready,
  });
}

export function useListInterestsWithDetails() {
  const { actor, ready } = useBackendActor();
  return useQuery({
    queryKey: ["interestsWithDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInterestsWithDetails();
    },
    enabled: ready,
  });
}

export function useDeleteInterest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: InterestId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteInterest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInterests"] });
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      queryClient.invalidateQueries({ queryKey: ["interestsWithDetails"] });
    },
  });
}

// Admin
export function useAdminListUsers() {
  const { actor, ready } = useBackendActor();
  return useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: ready,
  });
}

export function useAdminDeleteUser() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: UserId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminUpdateUser() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: UserId; input: UserInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateUser(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminSetAdmin() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, admin }: { id: UserId; admin: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setAdmin(id, admin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useAdminGetNotifications() {
  const { actor, ready } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetNewInterestNotifications();
    },
    enabled: ready,
  });
}

export function useGetAdminNotifications() {
  const { actor, ready } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "notifications", "v2"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminNotifications();
    },
    enabled: ready,
  });
}

export function useGetUnreadAdminNotificationCount() {
  const { actor, ready } = useBackendActor();
  return useQuery<bigint>({
    queryKey: ["admin", "notifications", "unreadCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadAdminNotificationCount();
    },
    enabled: ready,
  });
}

export function useMarkAdminNotificationAsRead() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markAdminNotificationAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useAdminMarkBookSold() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BookId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminMarkBookSold(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useAdminConfirmAvailability() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BookId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminConfirmAvailability(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useAdminDeleteBook() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BookId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminDeleteBook(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useAdminUpdateBook() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: BookId; input: BookInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminUpdateBook(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useAdminGetSellerContact(bookId: BookId | null) {
  const { actor, ready } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "sellerContact", bookId],
    queryFn: async () => {
      if (!actor || bookId === null) return null;
      return actor.adminGetSellerContact(bookId);
    },
    enabled: ready && bookId !== null,
  });
}
