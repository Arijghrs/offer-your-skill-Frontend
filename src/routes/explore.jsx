import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { RequestCard } from "@/components/talab/RequestCard";
import { EmptyState } from "@/components/talab/primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, locations, requests, statusMeta } from "@/lib/talab-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/explore")({
  validateSearch: (search) =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Explore requests — Talab" },
      {
        name: "description",
        content:
          "Search and filter requests by category, location, budget and status across Tunisia.",
      },
      { property: "og:title", content: "Explore requests — Talab" },
      { property: "og:description", content: "Find people who need exactly what you're good at." },
    ],
  }),
  component: Explore,
});
function Explore() {
  const { category: initialCategory } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState([1e3]);
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("list");
  const results = useMemo(() => {
    let list = requests.filter((r) => {
      if (query && !`${r.title} ${r.description}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (category !== "all" && r.category !== category) return false;
      if (location !== "all" && r.location !== location) return false;
      if (status !== "all" && r.status !== status) return false;
      if (remoteOnly && !r.remote) return false;
      if (r.budgetMin > (maxBudget[0] ?? 1e3)) return false;
      return true;
    });
    if (sort === "budget") list = [...list].sort((a, b) => b.budgetMax - a.budgetMax);
    if (sort === "offers") list = [...list].sort((a, b) => b.offersCount - a.offersCount);
    return list;
  }, [query, category, location, status, remoteOnly, maxBudget, sort]);
  return (
    <AppShell wide>
      <PageHeader title="Explore Requests" description="Find someone who needs what you can do." />


      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface h-fit space-y-5 p-5">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="size-4" /> Filters
          </h2>

          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.emoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Anywhere</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                {Object.keys(statusMeta).map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Budget up to {maxBudget[0]} TND</Label>
            <Slider value={maxBudget} onValueChange={setMaxBudget} min={0} max={1e3} step={50} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="remote">Remote only</Label>
            <Switch id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setLocation("all");
              setStatus("all");
              setRemoteOnly(false);
              setMaxBudget([1e3]);
            }}
          >
            Reset filters
          </Button>
        </aside>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Link to="/create">
              <Button className="gap-2">
                <Plus className="size-4" />
                Post a Request
              </Button>
            </Link>
          </div>

          <div className="surface flex flex-wrap items-center gap-3 p-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for requests..."
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="relevant">Most relevant</SelectItem>
                <SelectItem value="budget">Highest budget</SelectItem>
                <SelectItem value="offers">Most offers</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden rounded-lg border border-border p-0.5 sm:flex">
              {["list", "grid"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-label={`${v} view`}
                  className={cn(
                    "rounded-md p-2",
                    view === v ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  {v === "list" ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
                </button>
              ))}
            </div>
          </div>



          {results.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="No requests match your filters"
              description="Try widening your budget, changing the location, or clearing the search."
              actionLabel="Reset filters"
              onAction={() => {
                setQuery("");
                setCategory("all");
                setLocation("all");
                setStatus("all");
                setRemoteOnly(false);
                setMaxBudget([1e3]);
              }}
            />
          ) : (
            <div className={cn("grid gap-4", view === "grid" && "xl:grid-cols-2")}>
              {results.map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
export { Route };
