import type { BookInput } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBook } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PostBook() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createBook = useCreateBook();

  const [form, setForm] = useState<BookInput>({
    title: "",
    author: "",
    subject: "",
    price: 0n,
    photoUrl: undefined,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.subject || form.price <= 0n) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let photoUrl = form.photoUrl;
    if (photoFile) {
      // In a real app, upload to object storage here.
      // For now, we use a data URL as a placeholder.
      const reader = new FileReader();
      reader.readAsDataURL(photoFile);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          photoUrl = reader.result as string;
          resolve();
        };
      });
    }

    try {
      await createBook.mutateAsync({ ...form, photoUrl });
      toast.success("Book listed successfully!");
      navigate({ to: "/browse" });
    } catch {
      toast.error("Failed to list book. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Please log in
        </h2>
        <p className="text-muted-foreground">
          You need to be logged in to post a book.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-pattern-subtle opacity-50 pointer-events-none" />

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Post a Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 glass-card rounded-2xl p-6 shadow-warm"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Book Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Introduction to Algorithms"
            required
            className="bg-background/60 border-border/60"
            data-ocid="post_book.title.input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author Name</Label>
          <Input
            id="author"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            placeholder="e.g. Thomas H. Cormen"
            required
            className="bg-background/60 border-border/60"
            data-ocid="post_book.author.input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={form.subject}
            onChange={(e) =>
              setForm((f) => ({ ...f, subject: e.target.value }))
            }
            placeholder="e.g. Computer Science"
            required
            className="bg-background/60 border-border/60"
            data-ocid="post_book.subject.input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            value={Number(form.price)}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: BigInt(e.target.value || 0) }))
            }
            placeholder="e.g. 450"
            required
            className="bg-background/60 border-border/60"
            data-ocid="post_book.price.input"
          />
          <p className="text-xs text-muted-foreground">Platform charge: ₹5</p>
          <p className="text-sm font-medium text-foreground">
            Total price buyers will see: ₹{(Number(form.price) + 5).toString()}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Book Photo</Label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="photo"
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border/60 bg-background/60 cursor-pointer hover:bg-muted/80 transition-smooth"
              data-ocid="post_book.photo.upload_button"
            >
              <Upload className="h-4 w-4" />
              <span className="text-sm">Upload Photo</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoFile && (
              <span className="text-sm text-muted-foreground">
                {photoFile.name}
              </span>
            )}
          </div>
          {previewUrl && (
            <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-border/60 max-w-sm glass-card">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={createBook.isPending}
          className="w-full gap-2 shadow-warm"
          data-ocid="post_book.submit_button"
        >
          {createBook.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4" />
          )}
          List Book
        </Button>
      </form>
    </div>
  );
}
