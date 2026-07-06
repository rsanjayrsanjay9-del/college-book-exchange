import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteInterest,
  useGetMyInterests,
  useListBooks,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { BookOpen, Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Interests() {
  const { isAuthenticated } = useAuth();
  const { data: interests = [], isLoading: interestsLoading } =
    useGetMyInterests();
  const { data: books = [], isLoading: booksLoading } = useListBooks();
  const deleteInterest = useDeleteInterest();

  const isLoading = interestsLoading || booksLoading;

  const getBook = (bookId: bigint) => books.find((b) => b.id === bookId);

  const handleRemove = async (id: bigint) => {
    try {
      await deleteInterest.mutateAsync(id);
      toast.success("Interest removed.");
    } catch {
      toast.error("Failed to remove interest.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Please log in
        </h2>
        <p className="text-muted-foreground">
          Log in to view your expressed interests.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="interests.empty_state"
      >
        <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground">
          No interests yet
        </h2>
        <p className="text-muted-foreground mb-6">
          You haven't expressed interest in any books yet.
        </p>
        <Link to="/browse">
          <Button>Browse Books</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-pattern-dots opacity-40 pointer-events-none" />

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        My Interests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interests.map((interest, idx) => {
          const book = getBook(interest.bookId);
          if (!book) return null;
          return (
            <div
              key={interest.id.toString()}
              className="rounded-xl border border-border/50 glass-card p-4 flex flex-col gap-3 shadow-warm hover:shadow-elevated transition-smooth"
              data-ocid={`interests.item.${idx + 1}`}
            >
              <div className="aspect-[4/3] rounded-lg bg-muted/60 flex items-center justify-center overflow-hidden border border-border/40">
                {book.photoUrl ? (
                  <img
                    src={book.photoUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-primary font-bold text-sm">
                  ₹{(book.price + 5n).toString()}
                </span>
                <Link
                  to="/book/$id"
                  params={{ id: book.id.toString() }}
                  className="text-primary text-sm font-medium hover:underline"
                  data-ocid={`interests.view_link.${idx + 1}`}
                >
                  View Book
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(interest.id)}
                  disabled={deleteInterest.isPending}
                  className="text-destructive hover:text-destructive"
                  aria-label="Remove interest"
                  data-ocid={`interests.remove_button.${idx + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
