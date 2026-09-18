import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { RequestCard } from "@/components/talab/RequestCard";
import { EmptyState } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, requests } from "@/lib/talab-data";
const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [
      { title: "My requests — Talab" },
      {
        name: "description",
        content:
          "Track your Talab requests, their offers, comments and deadlines in one dashboard.",
      },
      { property: "og:title", content: "My requests — Talab" },
      {
        property: "og:description",
        content: "Open, in progress and completed requests at a glance.",
      },
    ],
  }),
  component: MyRequests,
});
const mine = requests.filter((r) => r.author.id === currentUser.id);
const tabs = [
  { value: "all", label: "All" },
  { value: "open", label: "Open", status: "open" },
  { value: "in_progress", label: "In progress", status: "in_progress" },
  { value: "completed", label: "Completed", status: "completed" },
];
function MyRequests() {
  return (
    <AppShell>
      <PageHeader
        title="My Requests"
        description={`${mine.length} requests · ${mine.reduce((a, r) => a + r.offersCount, 0)} offers received`}
        action={
          <Button asChild>
            <Link to="/create">
              <Plus className="size-4" /> Post a Request
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => {
          const list = t.status ? mine.filter((r) => r.status === t.status) : mine;
          return (
            <TabsContent key={t.value} value={t.value} className="mt-4 space-y-4">
              {list.length === 0 ? (
                <EmptyState
                  emoji="📝"
                  title="Nothing here yet."
                  description="Be the first person to ask for help — describe what you need and the community answers."
                  actionLabel="Post a Request"
                />
              ) : (
                list.map((r) => <RequestCard key={r.id} request={r} manageOffers />)
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </AppShell>
  );
}
export { Route };
