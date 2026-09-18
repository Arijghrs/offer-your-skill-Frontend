import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { categories } from "@/lib/talab-data";
const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Talab" },
      {
        name: "description",
        content:
          "Browse every Talab category: technology, design, education, PFE, services and more.",
      },
      { property: "og:title", content: "Categories — Talab" },
      {
        property: "og:description",
        content: "Twelve categories of things people need help with in Tunisia.",
      },
    ],
  }),
  component: Categories,
});
function Categories() {
  return (
    <AppShell wide>
      <PageHeader title="Categories" description="Every kind of help people ask for on Talab." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/explore"
            search={{ category: c.slug }}
            className="surface group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-start justify-between">
              <span
                className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-2xl"
                aria-hidden
              >
                {c.emoji}
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-bold">{c.name}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.description}</p>
            <p className="mt-4 text-sm font-semibold text-teal">{c.openRequests} open requests</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
export { Route };
