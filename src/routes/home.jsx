import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/talab/AppShell";
import { RequestCard } from "@/components/talab/RequestCard";
import { Avatar, CardSkeleton, Rating } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { categories, currentUser, requests, users } from "@/lib/talab-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your feed — Talab" },
      { name: "description", content: "See what people around you need help with today on Talab." },
      { property: "og:title", content: "Your feed — Talab" },
      {
        property: "og:description",
        content: "Requests from students, freelancers and professionals in Tunisia.",
      },
    ],
  }),
  component: HomeFeed,
});
const intents = [
  "Ask for help",
  "Find a freelancer",
  "Find a teammate",
  "Ask for a recommendation",
];
function HomeFeed() {
  const [intent, setIntent] = useState(intents[0]);
  const [loading] = useState(false);
  return (
    <AppShell wide>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="surface p-5">
            <div className="flex items-center gap-3">
              <Avatar user={currentUser} />
              <Link
                to="/create"
                className="flex-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                What do you need help with?
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {intents.map((i) => (
                <button
                  key={i}
                  onClick={() => setIntent(i)}
                  className={
                    intent === i
                      ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                      : "rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  }
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <Link to="/create">Post Request</Link>
              </Button>
            </div>
          </section>

          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Most recent</TabsTrigger>
              <TabsTrigger value="near">Near me</TabsTrigger>
              <TabsTrigger value="skills">Matches my skills</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {loading
              ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
              : requests.map((r) => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <div className="surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Categories
            </h2>
            <ul className="mt-3 space-y-1">
              {categories.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/explore"
                    search={{ category: c.slug }}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  >
                    <span>
                      <span aria-hidden className="mr-2">
                        {c.emoji}
                      </span>
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{c.openRequests}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to="/categories">See all categories</Link>
            </Button>
          </div>

          <div className="surface p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="size-4 text-teal" /> Trending
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {["#PFE2026", "#ReactTunisia", "#LogoDesign", "#EnglishTutor", "#VideoEditing"].map(
                (t) => (
                  <li key={t} className="flex items-center justify-between">
                    <span className="font-medium text-primary">{t}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="size-3.5 text-warning" />{" "}
                      {Math.floor(Math.random() * 80) + 20}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="surface p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <Users className="size-4 text-teal" /> Popular helpers
            </h2>
            <ul className="mt-3 space-y-3">
              {users.slice(1, 5).map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <Avatar user={u} size="sm" showOnline />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/profile/$userId"
                      params={{ userId: u.id }}
                      className="block truncate text-sm font-semibold hover:text-primary"
                    >
                      {u.name}
                    </Link>
                    <Rating value={u.rating} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
export { Route };
