import { useProfileRedirect } from "@/hooks/useProfileRedirect";
import { Outlet } from "@tanstack/react-router";
import { BookOpen, Heart } from "lucide-react";
import { Header } from "./Header";

export function Layout() {
  const currentYear = new Date().getFullYear();

  useProfileRedirect();

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-muted/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="bg-card/80 backdrop-blur-sm border-t border-border mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-5 w-5" />
                <span className="font-display font-semibold">Ex Books</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>&copy; {currentYear}. Built with</span>
                <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
                <span>using</span>
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  caffeine.ai
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
