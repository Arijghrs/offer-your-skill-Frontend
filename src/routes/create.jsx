import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, currentUser, locations } from "@/lib/talab-data";
import { Avatar, CategoryTag, StatusBadge, Tag } from "@/components/talab/primitives";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Post a request — Talab" },
      {
        name: "description",
        content: "Describe what you need in under two minutes and let the Talab community help.",
      },
      { property: "og:title", content: "Post a request — Talab" },
      {
        property: "og:description",
        content: "Category, description, budget, deadline — then publish.",
      },
    ],
  }),
  component: CreateRequest,
});
const steps = ["Category", "Describe", "Details", "More info", "Preview"];
function CreateRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("100");
  const [budgetMax, setBudgetMax] = useState("300");
  const [location, setLocation] = useState("Tunis");
  const [deadline, setDeadline] = useState("2026-09-05");
  const [skills, setSkills] = useState("");
  const [mode, setMode] = useState("remote");
  const [urgency, setUrgency] = useState("normal");
  const [error, setError] = useState("");
  function next() {
    if (step === 0 && !category)
      return setError("Pick a category so the right people see your request.");
    if (step === 1) {
      if (title.trim().length < 10)
        return setError("Give your request a clear title (10 characters minimum).");
      if (description.trim().length < 30)
        return setError("Add a few more details — at least 30 characters.");
    }
    if (step === 2 && Number(budgetMax) < Number(budgetMin))
      return setError("Maximum budget must be higher than the minimum.");
    setError("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  return (
    <AppShell>
      <PageHeader
        title="What do you need?"
        description="Most requests take less than 2 minutes to post."
      />

      <ol className="mb-6 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-success-soft text-success"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : <span>{i + 1}</span>}
              {s}
            </button>
            {i < steps.length - 1 && <ChevronRight className="size-3.5 text-muted-foreground" />}
          </li>
        ))}
      </ol>

      <div className="surface p-6">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold">Choose a category</h2>
            <p className="text-sm text-muted-foreground">
              This helps the right people find your request.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    category === c.slug
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span className="text-xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <span className="mt-2 block text-sm font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5">
            <h2 className="text-lg font-bold">Describe your need</h2>
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Need a React developer for a small project"
              />
              <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what you need..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <h2 className="text-lg font-bold">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="bmin">Minimum budget (TND)</Label>
                <Input
                  id="bmin"
                  inputMode="numeric"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="bmax">Maximum budget (TND)</Label>
                <Input
                  id="bmax"
                  inputMode="numeric"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <h2 className="text-lg font-bold">Additional information</h2>
            <p className="-mt-4 text-sm text-muted-foreground">
              All optional — but more detail means better offers.
            </p>
            <div className="grid gap-1.5">
              <Label>Attachments</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted px-4 py-8 text-sm text-muted-foreground hover:bg-accent">
                <Paperclip className="size-4" /> Drop files or click to upload
                <input type="file" className="sr-only" />
              </label>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="skills">Skills needed</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Tailwind, TypeScript"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Remote or on-site</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Either works</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Urgency</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Not urgent</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold">Preview</h2>
            <p className="text-sm text-muted-foreground">
              This is how people will see your request.
            </p>
            <article className="mt-5 rounded-xl border border-border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={currentUser} />
                  <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <StatusBadge status="open" />
              </div>
              <div className="mt-4">{category && <CategoryTag slug={category} />}</div>
              <h3 className="mt-3 text-lg font-bold">{title || "Your request title"}</h3>
              <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">
                {description || "Your description will appear here."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag>
                  💰 {budgetMin} – {budgetMax} TND
                </Tag>
                <Tag>📍 {location}</Tag>
                <Tag>📅 {deadline}</Tag>
                <Tag>
                  {mode === "remote"
                    ? "🌐 Remote"
                    : mode === "onsite"
                      ? "🏢 On-site"
                      : "🔁 Flexible"}
                </Tag>
              </div>
            </article>
          </div>
        )}

        {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="size-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next}>
              Continue <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                toast.success("Request published", {
                  description: "People can now comment and send you offers.",
                });
                navigate({ to: "/my-requests" });
              }}
            >
              Publish Request
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
export { Route };
