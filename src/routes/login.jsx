
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/talab/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";

const Route = createFileRoute("/login")({
  validateSearch: (search) =>
    typeof search["redirect"] === "string"
      ? { redirect: search["redirect"] }
      : {},

  head: () => ({
    meta: [
      { title: "Log in — Talab" },
      {
        name: "description",
        content:
          "Log in to Talab to post requests, send offers and message people who can help.",
      },
      { property: "og:title", content: "Log in — Talab" },
      { property: "og:description", content: "Access your Talab account." },
    ],
  }),

  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({
        to: redirect ?? "/home",
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, redirect]);

  async function submit(e) {
    e.preventDefault();

    const next = {};

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      next.password = "Your password must be at least 8 characters.";
    }

    setErrors(next);

    if (Object.keys(next).length) {
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email,
        password,
      });

      toast.success("Welcome back to Talab");

      navigate({
        to: redirect ?? "/home",
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see requests and continue helping people."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
          />

          {errors.email && (
            <p className="text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
          />

          {errors.password && (
            <p className="text-xs font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={remember}
              onCheckedChange={(v) => setRemember(!!v)}
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() =>
              toast("Password reset is not available yet.")
            }
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-card px-3">or</span>
          <span className="absolute inset-x-0 top-1/2 border-t border-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => toast("Google sign-in is coming soon")}
        >
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="hero-gradient flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="surface p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold">{title}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </main>
    </div>
  );
}

export { AuthLayout, Route };

