import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useExpressInterest, useGetBook } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BookDetail() {
  const { id } = useParams({ from: "/book/$id" });
  const bookId = BigInt(id);
  const { isAuthenticated, user } = useAuth();
  const { data: book, isLoading } = useGetBook(bookId);
  const expressInterest = useExpressInterest();

  const handleInterest = async () => {
    if (!book) return;
    try {
      await expressInterest.mutateAsync(book.id);
      toast.success("Interest expressed! The seller will be notified.");
    } catch {
      toast.error("Failed to express interest. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Book not found
        </h2>
        <p className="text-muted-foreground">
          This listing may have been removed.
        </p>
      </div>
    );
  }

  const isMyBook = user?.id.toString() === book.sellerId.toString();

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Link
        to="/browse"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        data-ocid="book_detail.back.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 shadow-subtle">
          {book.photoUrl ? (
            <img
              src={book.photoUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {book.title}
            </h1>
            <p className="text-muted-foreground">{book.subject}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              ₹{(book.price + 5n).toString()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                book.status === "available"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {book.status === "available" ? "Available" : "Sold"}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Author</span>
              <span className="font-medium text-foreground">{book.author}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Subject</span>
              <span className="font-medium text-foreground">
                {book.subject}
              </span>
            </div>
          </div>

          {book.status === "available" && isAuthenticated && !isMyBook && (
            <Button
              onClick={handleInterest}
              disabled={expressInterest.isPending}
              className="gap-2 mt-2 shadow-warm"
              data-ocid="book_detail.interest.button"
            >
              {expressInterest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              I'm Interested
            </Button>
          )}

          {!isAuthenticated && book.status === "available" && (
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Log in
              </Link>{" "}
              to express interest in this book.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
