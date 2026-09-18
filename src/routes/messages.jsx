import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Send, Check, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/talab/AppShell";
import { Avatar } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversations } from "@/lib/talab-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Talab" },
      {
        name: "description",
        content: "Talk directly with the people helping you or the people you're helping.",
      },
      { property: "og:title", content: "Messages — Talab" },
      { property: "og:description", content: "Your Talab conversations in one place." },
    ],
  }),
  component: Messages,
});
function Messages() {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  return (
    <AppShell wide>
      <h1 className="mb-4 text-2xl font-extrabold sm:text-3xl">Messages</h1>
      <div className="surface grid overflow-hidden md:grid-cols-[280px_minmax(0,1fr)] md:divide-x md:divide-border">
        <ul className={cn("divide-y divide-border", "hidden md:block")}>
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted",
                  c.id === active.id && "bg-accent",
                )}
              >
                <Avatar user={c.user} size="sm" showOnline />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{c.user.name}</span>
                    <span className="text-[11px] text-muted-foreground">{c.time}</span>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.lastMessage}
                  </span>
                </span>
                {c.unread > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {c.unread}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex min-h-[60vh] flex-col">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Avatar user={active.user} size="sm" showOnline />
            <div>
              <p className="text-sm font-semibold">{active.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {active.user.online ? "Online now" : "Last seen recently"}
              </p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
            {active.messages.map((m) => (
              <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-[var(--shadow-soft)]",
                    m.fromMe
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card",
                  )}
                >
                  <p>{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[10px]",
                      m.fromMe ? "opacity-80" : "text-muted-foreground",
                    )}
                  >
                    {m.time}
                    {m.fromMe &&
                      (m.read ? <CheckCheck className="size-3" /> : <Check className="size-3" />)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft("");
            }}
          >
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a file">
              <Paperclip className="size-5" />
            </Button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
export { Route };
