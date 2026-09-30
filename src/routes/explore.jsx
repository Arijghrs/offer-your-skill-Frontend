import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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

import { api } from "@/lib/api";
import { categories, locations, statusMeta } from "@/lib/talab-data";
import { cn } from "@/lib/utils";

const Route = createFileRoute("/explore")({
  validateSearch: (search) =>
    typeof search["category"] === "string"
      ? { category: search["category"] }
      : {},

  head: () => ({
    meta: [
      { title: "Explore requests — Talab" },
      {
        name: "description",
        content:
          "Search and filter requests by category, location, budget and status across Tunisia.",
      },
      {
        property: "og:title",
        content: "Explore requests — Talab",
      },
      {
        property: "og:description",
        content: "Find people who need exactly what you're good at.",
      },
    ],
  }),

  component: Explore,
});

function Explore() {
  const { category: initialCategory } = Route.useSearch();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory ?? "all"
  );
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState([1000]);
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("list");

  /*
   * Load requests from the backend
   */
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api("/requests");

        const backendRequests = Array.isArray(data.requests)
          ? data.requests
          : [];

        /*
         * Convert backend request format
         * into the format expected by RequestCard.
         */
        const formattedRequests = backendRequests.map((request) => {
          let author = request.author;

          if (!author) {
            author = request.user;
          }

          if (!author) {
            author = {
              id: request.authorId,
              fullName: "Talab user",
              username: "",
              avatar: "",
            };
          }

          let createdAt = "";

          if (request.createdAt) {
            createdAt = new Date(
              request.createdAt
            ).toLocaleDateString();
          }

          let remote = false;

          if (
            request.workMode === "remote" ||
            request.workMode === "Remote" ||
            request.workMode === "REMOTE"
          ) {
            remote = true;
          }

          let skills = [];

          if (
            typeof request.skills === "string" &&
            request.skills.trim()
          ) {
            skills = request.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean);
          }

          let budgetMin = 0;

          if (request.minBudget !== null && request.minBudget !== undefined) {
            budgetMin = Number(request.minBudget);
          }

          let budgetMax = 0;

          if (request.maxBudget !== null && request.maxBudget !== undefined) {
            budgetMax = Number(request.maxBudget);
          } else if (
            request.minBudget !== null &&
            request.minBudget !== undefined
          ) {
            budgetMax = Number(request.minBudget);
          }

          return {
            ...request,

            budgetMin,
            budgetMax,

            remote,
            createdAt,

            commentsCount: request.commentsCount ?? 0,
            offersCount: request.offersCount ?? 0,

            skills,

            offers: request.offers ?? [],
            comments: request.comments ?? [],

            author,
          };
        });

        setRequests(formattedRequests);
      } catch (err) {
        console.error("Get requests error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load requests.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  /*
   * Filter and sort requests
   */
  const results = useMemo(() => {
    let list = requests.filter((request) => {
      const title = request.title ?? "";
      const description = request.description ?? "";

      /*
       * Search
       */
      if (
        query &&
        !`${title} ${description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }

      /*
       * Category
       */
      if (
        category !== "all" &&
        request.category !== category
      ) {
        return false;
      }

      /*
       * Location
       */
      if (
        location !== "all" &&
        request.location !== location
      ) {
        return false;
      }

      /*
       * Status
       */
      if (
        status !== "all" &&
        request.status !== status
      ) {
        return false;
      }

      /*
       * Remote only
       */
      if (remoteOnly && !request.remote) {
        return false;
      }

      /*
       * Maximum budget
       */
      const requestBudget = Number(
        request.budgetMin ?? 0
      );

      if (
        requestBudget >
        (maxBudget[0] ?? 1000)
      ) {
        return false;
      }

      return true;
    });

    /*
     * Highest budget
     */
    if (sort === "budget") {
      list = [...list].sort(
        (a, b) =>
          Number(b.budgetMax ?? 0) -
          Number(a.budgetMax ?? 0)
      );
    }

    /*
     * Most offers
     */
    if (sort === "offers") {
      list = [...list].sort(
        (a, b) =>
          Number(b.offersCount ?? 0) -
          Number(a.offersCount ?? 0)
      );
    }

    /*
     * Most recent
     */
    if (sort === "recent") {
      list = [...list].sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });
    }

    return list;
  }, [
    requests,
    query,
    category,
    location,
    status,
    remoteOnly,
    maxBudget,
    sort,
  ]);

  /*
   * Reset filters
   */
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setLocation("all");
    setStatus("all");
    setRemoteOnly(false);
    setMaxBudget([1000]);
  };

  return (
    <AppShell wide>
      <PageHeader
        title="Explore Requests"
        description="Find someone who needs what you can do."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* FILTERS */}
        <aside className="surface h-fit space-y-5 p-5">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            Filters
          </h2>

          {/* Category */}
          <div className="grid gap-1.5">
            <Label>Category</Label>

            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All categories
                </SelectItem>

                {categories.map((c) => (
                  <SelectItem
                    key={c.slug}
                    value={c.slug}
                  >
                    {c.emoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="grid gap-1.5">
            <Label>Location</Label>

            <Select
              value={location}
              onValueChange={setLocation}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Anywhere
                </SelectItem>

                {locations.map((l) => (
                  <SelectItem
                    key={l}
                    value={l}
                  >
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid gap-1.5">
            <Label>Status</Label>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Any status
                </SelectItem>

                {Object.keys(statusMeta).map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                  >
                    {statusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="grid gap-2">
            <Label>
              Budget up to {maxBudget[0]} TND
            </Label>

            <Slider
              value={maxBudget}
              onValueChange={setMaxBudget}
              min={0}
              max={1000}
              step={50}
            />
          </div>

          {/* Remote */}
          <div className="flex items-center justify-between">
            <Label htmlFor="remote">
              Remote only
            </Label>

            <Switch
              id="remote"
              checked={remoteOnly}
              onCheckedChange={setRemoteOnly}
            />
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            className="w-full"
            onClick={resetFilters}
          >
            Reset filters
          </Button>
        </aside>

        {/* RESULTS */}
        <div className="space-y-4">
          {/* Create request */}
          <div className="flex justify-end">
            <Link to="/create">
              <Button className="gap-2">
                <Plus className="size-4" />
                Post a Request
              </Button>
            </Link>
          </div>

          {/* Search / Sort / View */}
          <div className="surface flex flex-wrap items-center gap-3 p-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search for requests..."
                className="pl-9"
              />
            </div>

            <Select
              value={sort}
              onValueChange={setSort}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="recent">
                  Most recent
                </SelectItem>

                <SelectItem value="relevant">
                  Most relevant
                </SelectItem>

                <SelectItem value="budget">
                  Highest budget
                </SelectItem>

                <SelectItem value="offers">
                  Most offers
                </SelectItem>
              </SelectContent>
            </Select>

            {/* List / Grid */}
            <div className="hidden rounded-lg border border-border p-0.5 sm:flex">
              {["list", "grid"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-label={`${v} view`}
                  className={cn(
                    "rounded-md p-2",
                    view === v
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {v === "list" ? (
                    <List className="size-4" />
                  ) : (
                    <LayoutGrid className="size-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="surface flex min-h-[250px] items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                <p className="text-sm text-muted-foreground">
                  Loading requests...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="surface flex min-h-[250px] items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mb-3 text-4xl">
                  ⚠️
                </div>

                <h2 className="text-lg font-semibold">
                  Failed to load requests
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  className="mt-4"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try again
                </Button>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            results.length === 0 && (
              <EmptyState
                emoji="🔍"
                title="No requests match your filters"
                description="Try widening your budget, changing the location, or clearing the search."
                actionLabel="Reset filters"
                onAction={resetFilters}
              />
            )}

          {/* Requests */}
          {!loading &&
            !error &&
            results.length > 0 && (
              <div
                className={cn(
                  "grid gap-4",
                  view === "grid" &&
                    "xl:grid-cols-2"
                )}
              >
                {results.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
        </div>
      </div>
    </AppShell>
  );
}

export { Route };