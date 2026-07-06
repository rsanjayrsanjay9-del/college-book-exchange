import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetUnreadAdminNotificationCount } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/post", label: "Post Book" },
  { to: "/interests", label: "My Interests" },
];

export function Header() {
  const { isAuthenticated, isAdmin, isRegistered, user, login, logout } =
    useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: unreadCount } = useGetUnreadAdminNotificationCount();
  const hasUnread = isAdmin && unreadCount !== undefined && unreadCount > 0n;

  const collegeName = user?.collegeName;
  const searchParams = new URLSearchParams(router.state.location.search);
  const currentCollegeFilter = searchParams.get("college");
  const isMyCollegeActive =
    collegeName !== undefined && currentCollegeFilter === collegeName;
  const isAllCollegesActive = currentCollegeFilter === null;

  const setAllColleges = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("college");
    router.navigate({
      to: "/browse",
      search: Object.fromEntries(next),
    });
  };

  const setMyCollege = () => {
    if (!collegeName) return;
    const next = new URLSearchParams(searchParams);
    next.set("college", collegeName);
    router.navigate({
      to: "/browse",
      search: Object.fromEntries(next),
    });
  };

  return (
    <header className="sticky top-0 z-50 glass-hero border-b border-border/50 shadow-subtle">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary font-display text-xl font-bold"
          data-ocid="header.logo.link"
        >
          <BookOpen className="h-6 w-6" />
          <span className="hidden sm:inline">Ex Books</span>
          <span className="sm:hidden">Ex Books</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                router.state.location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              data-ocid={`header.nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1 relative",
                router.state.location.pathname === "/admin"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              data-ocid="header.nav.admin.link"
            >
              <Shield className="h-4 w-4" />
              Admin
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-card">
                  {Number(unreadCount) > 9
                    ? "9+"
                    : Number(unreadCount).toString()}
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* College filter buttons + Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && collegeName ? (
            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-0.5 shadow-subtle">
              <button
                type="button"
                onClick={setAllColleges}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-smooth",
                  isAllCollegesActive
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="header.college_filter.all_colleges.button"
                aria-pressed={isAllCollegesActive}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                All Colleges
              </button>
              <button
                type="button"
                onClick={setMyCollege}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-smooth",
                  isMyCollegeActive
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="header.college_filter.my_college.button"
                aria-pressed={isMyCollegeActive}
              >
                My College
                {isMyCollegeActive && (
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </button>
            </div>
          ) : isAuthenticated && !collegeName ? (
            <Link
              to="/profile"
              className="text-xs text-muted-foreground hover:text-primary transition-smooth underline underline-offset-2"
              data-ocid="header.college_filter.prompt"
            >
              Set your college
            </Link>
          ) : null}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                  router.state.location.pathname === "/profile"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                data-ocid="header.nav.profile.link"
              >
                <User className="h-4 w-4" />
                {isRegistered ? "Edit Profile" : (user?.name ?? "Profile")}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground"
                data-ocid="header.logout.button"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => login()}
              data-ocid="header.login.button"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="header.mobile_menu.button"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 glass-hero px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                router.state.location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              data-ocid={`header.mobile_nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1 relative",
                router.state.location.pathname === "/admin"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              data-ocid="header.mobile_nav.admin.link"
            >
              <Shield className="h-4 w-4" />
              Admin
              {hasUnread && (
                <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">
                  {Number(unreadCount) > 9
                    ? "9+"
                    : Number(unreadCount).toString()}
                </span>
              )}
            </Link>
          )}

          {/* Mobile college filter buttons */}
          {isAuthenticated && collegeName ? (
            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-0.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAllColleges();
                }}
                className={cn(
                  "flex-1 text-center px-3 py-2 rounded-full text-sm font-medium transition-smooth flex items-center justify-center gap-1.5",
                  isAllCollegesActive
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="header.mobile_college_filter.all_colleges.button"
                aria-pressed={isAllCollegesActive}
              >
                <GraduationCap className="h-4 w-4" />
                All Colleges
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setMyCollege();
                }}
                className={cn(
                  "flex-1 text-center px-3 py-2 rounded-full text-sm font-medium transition-smooth flex items-center justify-center gap-1.5",
                  isMyCollegeActive
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="header.mobile_college_filter.my_college.button"
                aria-pressed={isMyCollegeActive}
              >
                My College
                {isMyCollegeActive && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </button>
            </div>
          ) : isAuthenticated && !collegeName ? (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary transition-smooth"
              data-ocid="header.mobile_college_filter.prompt"
            >
              <GraduationCap className="h-4 w-4 inline mr-1.5" />
              Set your college to filter
            </Link>
          ) : null}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1",
                  router.state.location.pathname === "/profile"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                data-ocid="header.mobile_nav.profile.link"
              >
                <User className="h-4 w-4" />
                {isRegistered ? "Edit Profile" : (user?.name ?? "Profile")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth flex items-center gap-1"
                data-ocid="header.mobile_logout.button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                login();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10 transition-smooth flex items-center gap-1"
              data-ocid="header.mobile_login.button"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
