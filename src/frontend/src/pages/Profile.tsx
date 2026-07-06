import type { UserInput } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { BookOpen, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { isAuthenticated, user, isLoadingProfile, register, updateProfile } =
    useAuth();
  const router = useRouter();
  const [form, setForm] = useState<UserInput>({
    name: "",
    email: "",
    phone: "",
    collegeName: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        collegeName: user.collegeName,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.collegeName) {
      toast.error("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (user) {
        await updateProfile(form);
        toast.success("Profile updated successfully!");
      } else {
        await register(form);
        toast.success("Profile created successfully!");
      }
      router.navigate({ to: "/" });
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Please log in
        </h2>
        <p className="text-muted-foreground">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl relative">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-4 glow-primary">
          <BookOpen className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Ex Books
        </h1>
        <p className="text-muted-foreground mt-2">
          {user
            ? "Update your profile details below."
            : "Complete your profile to start using the app."}
        </p>
      </div>

      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        {user ? "Edit Your Profile" : "Complete Your Profile"}
      </h2>

      {!user && (
        <p className="text-muted-foreground mb-6">
          Please fill in your details to finish registration and start using the
          app.
        </p>
      )}

      <Card className="glass-card shadow-elevated">
        <CardHeader>
          <CardTitle className="font-display">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Your full name"
                required
                data-ocid="profile.name.input"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@example.com"
                required
                data-ocid="profile.email.input"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                required
                data-ocid="profile.phone.input"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College Name *</Label>
              <Input
                id="college"
                value={form.collegeName ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    collegeName: e.target.value || undefined,
                  }))
                }
                placeholder="e.g. IIT Delhi"
                required
                data-ocid="profile.college.input"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Adding your college enables college-wise filtering when browsing
                books.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 shadow-warm"
              data-ocid="profile.save_button"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {user ? "Save Changes" : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
