import { Button } from "@/components/ui/button";
import { useListBooks } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MessageCircle, Search } from "lucide-react";

export default function Home() {
  const { data: books = [], isLoading } = useListBooks();
  const availableBooks = books.filter((b) => b.status === "available");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-hero-gradient border-b border-border/50 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-muted/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 glass-card">
            <BookOpen className="h-4 w-4" />
            Campus Book Marketplace
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground max-w-3xl leading-tight mb-6">
            Buy & Sell{" "}
            <span className="text-gradient-primary">Second-Hand</span> College
            Books
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-10">
            List your old textbooks, browse listings from students on your
            campus, and connect with sellers — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/browse" data-ocid="home.browse_button">
              <Button size="lg" className="gap-2 shadow-warm">
                <Search className="h-5 w-5" />
                Browse Books
              </Button>
            </Link>
            <Link to="/post" data-ocid="home.post_button">
              <Button size="lg" variant="outline" className="gap-2 glass-card">
                <BookOpen className="h-5 w-5" />
                Post a Book
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="bg-background py-16 relative">
        <div className="absolute inset-0 bg-pattern-dots opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Featured Books
            </h2>
            <Link
              to="/browse"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              data-ocid="home.see_all.link"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
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
            <div className="text-center py-16" data-ocid="home.empty_state">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No books posted yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to post a book!
              </p>
              <Link to="/post" data-ocid="home.empty_state.post_link">
                <Button className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Post a Book
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBooks.map((book, idx) => (
                <Link
                  key={book.id.toString()}
                  to="/book/$id"
                  params={{ id: book.id.toString() }}
                  className="group rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 flex flex-col gap-3 shadow-subtle hover:shadow-elevated transition-smooth"
                  data-ocid={`home.featured.item.${idx + 1}`}
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
                    <p className="text-sm text-muted-foreground">
                      {book.subject}
                    </p>
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
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-16 relative">
        <div className="absolute inset-0 bg-pattern-subtle opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "List Your Book",
                desc: "Snap a photo, add details, and set a price. Your listing goes live instantly.",
              },
              {
                icon: Search,
                title: "Browse & Search",
                desc: "Find books by title, author, or subject. Filter by your college to see nearby listings.",
              },
              {
                icon: MessageCircle,
                title: "Express Interest",
                desc: "Click 'I'm Interested' to let the seller know. Connect and complete the exchange.",
              },
            ].map((step, _i) => (
              <div
                key={step.title.replace(/\s+/g, "_").toLowerCase()}
                className="group"
                data-ocid={`home.how_it_works.item.${step.title.replace(/\s+/g, "_").toLowerCase()}`}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
