import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { EmptyState } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { myOffers, offerStatusMeta } from "@/lib/talab-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/my-offers")({
  head: () => ({
    meta: [
      { title: "My offers — Talab" },
      {
        name: "description",
        content: "Follow every offer you sent on Talab: pending, accepted, rejected and completed.",
      },
      { property: "og:title", content: "My offers — Talab" },
      { property: "og:description", content: "See where your offers stand and what to do next." },
    ],
  }),
  component: MyOffers,
});
const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", status: "pending" },
  { value: "accepted", label: "Accepted", status: "accepted" },
  { value: "rejected", label: "Rejected", status: "rejected" },
  { value: "completed", label: "Completed", status: "completed" },
];
function MyOffers() {
  return (
    <AppShell>
      <PageHeader title="My Offers" description="Everything you offered to help with." />

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => {
          const list = t.status ? myOffers.filter((o) => o.status === t.status) : myOffers;
          return (
            <TabsContent key={t.value} value={t.value} className="mt-4 grid gap-4 sm:grid-cols-2">
              {list.length === 0 ? (
                <div className="sm:col-span-2">
                  <EmptyState
                    emoji="🤝"
                    title="No offers here yet"
                    description="Browse open requests and offer your help — it only takes a minute."
                    actionLabel="Explore requests"
                  />
                </div>
              ) : (
                list.map((o) => {
                  const meta = offerStatusMeta[o.status];
                  return (
                    <article key={o.id} className="surface p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-bold">{o.requestTitle}</h2>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            meta.className,
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{o.message}</p>
                      <p className="mt-3 text-sm">
                        Your offer: <span className="font-semibold">{o.price} TND</span> · {o.days}{" "}
                        days
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Sent {o.createdAt}</p>
                      <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link to="/request/$requestId" params={{ requestId: o.requestId }}>
                          View Request
                        </Link>
                      </Button>
                    </article>
                  );
                })
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </AppShell>
  );
}
export { Route };
