import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "./login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/lib/talab-data";
import { useAuth } from "@/lib/auth";
const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Talab" },
      {
        name: "description",
        content:
          "Join Talab to ask for help, offer your skills and connect with people across Tunisia.",
      },
      { property: "og:title", content: "Create your account — Talab" },
      { property: "og:description", content: "Sign up in under a minute and start asking." },
    ],
  }),
  component: RegisterPage,
});
function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [location, setLocation] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/home", replace: true });
  }, [isAuthenticated, navigate]);
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (name.trim().length < 3) next.name = "Enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    if (!location) next.location = "Choose your location.";
    if (!terms) next.terms = "You must accept the Terms and Conditions.";
    setErrors(next);
    if (Object.keys(next).length) return;
    register({ name: name.trim(), email, location });
    toast.success("Account created", { description: "Welcome to Talab!" });
    navigate({ to: "/home", replace: true });
  }
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Ask for what you need. Help with what you know."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Ben Ali"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
        </div>

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
          {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && (
              <p className="text-xs font-medium text-destructive">{errors.confirm}</p>
            )}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger aria-invalid={!!errors.location}>
              <SelectValue placeholder="Where are you based?" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && (
            <p className="text-xs font-medium text-destructive">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="inline-flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-0.5" />
            <span>I agree to the Terms and Conditions</span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.terms}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => toast("Google sign-up is coming soon")}
        >
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
export { Route };
