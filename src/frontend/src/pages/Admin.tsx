import type { Book, BookId, Notification, User as UserType } from "@/backend";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdminConfirmAvailability,
  useAdminDeleteBook,
  useAdminDeleteUser,
  useAdminGetSellerContact,
  useAdminListUsers,
  useAdminMarkBookSold,
  useAdminSetAdmin,
  useGetAdminNotifications,
  useGetUnreadAdminNotificationCount,
  useListBooks,
  useMarkAdminNotificationAsRead,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  CheckSquare,
  Eye,
  Heart,
  Loader2,
  Mail,
  Phone,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedBookId, setSelectedBookId] = useState<BookId | null>(null);

  // Redirect non-admin users (including unauthenticated) to home
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const { data: users = [], isLoading: usersLoading } = useAdminListUsers();
  const { data: notifications = [], isLoading: notifLoading } =
    useGetAdminNotifications();
  const { data: unreadCount = 0n, isLoading: unreadCountLoading } =
    useGetUnreadAdminNotificationCount();
  const { data: books = [], isLoading: booksLoading } = useListBooks();
  const { data: sellerContact } = useAdminGetSellerContact(selectedBookId);

  const deleteUser = useAdminDeleteUser();
  const setAdmin = useAdminSetAdmin();
  const markSold = useAdminMarkBookSold();
  const confirmAvail = useAdminConfirmAvailability();
  const deleteBook = useAdminDeleteBook();
  const markRead = useMarkAdminNotificationAsRead();

  // Show nothing while redirecting non-admin users
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleDeleteUser = async (id: UserType["id"]) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser.mutateAsync(id);
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleToggleAdmin = async (userItem: UserType) => {
    try {
      await setAdmin.mutateAsync({ id: userItem.id, admin: !userItem.isAdmin });
      toast.success(
        `Admin status ${!userItem.isAdmin ? "granted" : "revoked"}.`,
      );
    } catch {
      toast.error("Failed to update admin status.");
    }
  };

  const handleMarkSold = async (id: BookId) => {
    try {
      await markSold.mutateAsync(id);
      toast.success("Book marked as sold.");
    } catch {
      toast.error("Failed to mark book as sold.");
    }
  };

  const handleConfirmAvail = async (id: BookId) => {
    try {
      await confirmAvail.mutateAsync(id);
      toast.success("Availability confirmed.");
    } catch {
      toast.error("Failed to confirm availability.");
    }
  };

  const handleDeleteBook = async (id: BookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook.mutateAsync(id);
      toast.success("Book deleted.");
    } catch {
      toast.error("Failed to delete book.");
    }
  };

  const handleMarkRead = async (id: bigint) => {
    try {
      await markRead.mutateAsync(id);
      toast.success("Marked as read.");
    } catch {
      toast.error("Failed to mark as read.");
    }
  };

  const isLoading =
    usersLoading || notifLoading || booksLoading || unreadCountLoading;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-pattern-grid opacity-30 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList
          className="glass-card border border-border/50 shadow-warm"
          data-ocid="admin.tabs"
        >
          <TabsTrigger
            value="notifications"
            className="gap-1"
            data-ocid="admin.tab.notifications"
          >
            <Heart className="h-4 w-4" />
            Notifications
            {unreadCount > 0n && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {unreadCount.toString()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="books"
            className="gap-1"
            data-ocid="admin.tab.books"
          >
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-1"
            data-ocid="admin.tab.users"
          >
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="rounded-xl border border-border/50 glass-card overflow-hidden shadow-warm">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">
                New Interest Notifications
              </h2>
              {unreadCount > 0n && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                  {unreadCount.toString()} unread
                </span>
              )}
            </div>
            {notifications.length === 0 ? (
              <div
                className="px-6 py-12 text-center text-muted-foreground"
                data-ocid="admin.notifications.empty_state"
              >
                No new interests.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((n: Notification, idx: number) => (
                  <div
                    key={n.id.toString()}
                    className={cn(
                      "px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                      !n.isRead && "bg-primary/5",
                    )}
                    data-ocid={`admin.notification.item.${idx + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-destructive shrink-0" />
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">
                            {n.buyerName} is interested in{" "}
                            <span className="text-primary">{n.bookTitle}</span>
                          </p>
                          {n.isRead ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                              data-ocid={`admin.notification.read_badge.${idx + 1}`}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Read
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                              data-ocid={`admin.notification.unread_badge.${idx + 1}`}
                            >
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {n.buyerEmail} · {n.buyerPhone}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            Number(n.createdAt) / 1_000_000,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkRead(n.id)}
                          disabled={markRead.isPending}
                          data-ocid={`admin.notification.mark_read.${idx + 1}`}
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBookId(n.bookId)}
                        data-ocid={`admin.notification.seller_contact.${idx + 1}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Seller Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sellerContact && (
            <div
              className="mt-6 rounded-xl border border-border/50 glass-card p-6 shadow-warm"
              data-ocid="admin.seller_contact.panel"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">
                Seller Contact
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {sellerContact.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {sellerContact.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {sellerContact.phone}
                  </span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="books">
          <div className="rounded-xl border border-border/50 glass-card overflow-hidden shadow-warm">
            <div className="px-6 py-4 border-b border-border/50">
              <h2 className="font-display font-semibold text-foreground">
                All Books
              </h2>
            </div>
            {books.length === 0 ? (
              <div
                className="px-6 py-12 text-center text-muted-foreground"
                data-ocid="admin.books.empty_state"
              >
                No books listed yet.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {books.map((book, idx) => (
                  <div
                    key={book.id.toString()}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    data-ocid={`admin.book.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center border border-border/40">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {book.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {book.author} · ₹{(book.price + 5n).toString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {book.status === "available" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfirmAvail(book.id)}
                            disabled={confirmAvail.isPending}
                            data-ocid={`admin.book.confirm.${idx + 1}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkSold(book.id)}
                            disabled={markSold.isPending}
                            data-ocid={`admin.book.sold.${idx + 1}`}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Mark Sold
                          </Button>
                        </>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-muted/60 text-muted-foreground text-xs font-medium border border-border/40">
                          Sold
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                        disabled={deleteBook.isPending}
                        className="text-destructive hover:text-destructive"
                        data-ocid={`admin.book.delete.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-xl border border-border/50 glass-card overflow-hidden shadow-warm">
            <div className="px-6 py-4 border-b border-border/50">
              <h2 className="font-display font-semibold text-foreground">
                All Users
              </h2>
            </div>
            {users.length === 0 ? (
              <div
                className="px-6 py-12 text-center text-muted-foreground"
                data-ocid="admin.users.empty_state"
              >
                No users registered yet.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {users.map((userItem, idx) => (
                  <div
                    key={userItem.id.toString()}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    data-ocid={`admin.user.item.${idx + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {userItem.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userItem.email} · {userItem.phone}
                        {userItem.collegeName && ` · ${userItem.collegeName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={userItem.isAdmin ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleAdmin(userItem)}
                        disabled={setAdmin.isPending}
                        data-ocid={`admin.user.toggle_admin.${idx + 1}`}
                      >
                        {userItem.isAdmin ? "Revoke Admin" : "Make Admin"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(userItem.id)}
                        disabled={deleteUser.isPending}
                        className="text-destructive hover:text-destructive"
                        data-ocid={`admin.user.delete.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
