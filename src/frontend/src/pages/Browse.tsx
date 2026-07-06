import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSearchBooks } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Browse() {
  const navigate = useNavigate({ from: "/browse" });
  const search = useSearch({ from: "/browse" }) as {
    q?: string;
    college?: string;
  };

  const [searchTerm, setSearchTerm] = useState(search.q ?? "");
  const [collegeFilter] = useState<string | null>(search.college ?? null);
  const { user } = useAuth();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (collegeFilter) params.college = collegeFilter;
    navigate({ search: params });
  }, [searchTerm, collegeFilter, navigate]);

  const { data: books = [], isLoading } = useSearchBooks(
    searchTerm || null,
    collegeFilter,
  );

  const availableBooks = books.filter((b) => b.status === "available");

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Browse Books
        </h1>
        {user?.collegeName && collegeFilter === user.collegeName && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold border border-primary/20">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            {user.collegeName}
          </span>
        )}
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-card"
          data-ocid="browse.search_input"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 animate-pulse"
            >
              <div className="aspect-[4/3] rounded-lg bg-muted mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : availableBooks.length === 0 ? (
        <div className="text-center py-20" data-ocid="browse.empty_state">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            No books found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBooks.map((book, idx) => (
            <Link
              key={book.id.toString()}
              to="/book/$id"
              params={{ id: book.id.toString() }}
              className="group rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 flex flex-col gap-3 shadow-subtle hover:shadow-elevated transition-smooth"
              data-ocid={`browse.item.${idx + 1}`}
            >
              <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center overflow-hidden">
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
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.subject}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-primary font-bold">
                  ₹{(book.price + 5n).toString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  by {book.author}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
