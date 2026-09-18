import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { EmptyState } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as seed } from "@/lib/talab-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Talab" },
      {
        name: "description",
        content: "Offers, comments, replies and reviews on your Talab activity.",
      },
      { property: "og:title", content: "Notifications — Talab" },
      {
        property: "og:description",
        content: "Stay on top of what happens on your requests and offers.",
      },
    ],
  }),
  component: Notifications,
});
function Notifications() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((i) => !i.read);
  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        description={unread.length ? `${unread.length} unread` : "You're all caught up!"}
        action={
          <Button
            variant="outline"
            onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}
            disabled={unread.length === 0}
          >
            <CheckCheck className="size-4" /> Mark all as read
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <NotificationList items={items} />
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          {unread.length ? (
            <NotificationList items={unread} />
          ) : (
            <EmptyState
              emoji="✅"
              title="You're all caught up!"
              description="New offers, comments and reviews will show up here."
            />
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
function NotificationList({ items }) {
  return (
    <ul className="surface divide-y divide-border overflow-hidden">
      {items.map((n) => (
        <li key={n.id}>
          <Link
            to={n.href}
            className={cn(
              "flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted",
              !n.read && "bg-primary-soft/50",
            )}
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-lg ring-1 ring-border"
              aria-hidden
            >
              {n.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm", !n.read && "font-semibold")}>{n.text}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{n.time}</span>
            </span>
            {!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}
export { Route };
