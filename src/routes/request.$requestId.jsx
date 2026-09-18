import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Coins, Flag, MapPin, Paperclip, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/talab/AppShell";
import {
  Avatar,
  CategoryTag,
  EmptyState,
  Rating,
  StatusBadge,
  Tag,
} from "@/components/talab/primitives";
import { OfferCard } from "@/components/talab/OfferCard";
import { Comments } from "@/components/talab/Comments";
import { MakeOfferModal } from "@/components/talab/MakeOfferModal";
import { Button } from "@/components/ui/button";
import { currentUser, requestById } from "@/lib/talab-data";
const Route = createFileRoute("/request/$requestId")({
  loader: ({ params }) => {
    const request = requestById(params.requestId);
    if (!request) throw notFound();
    return { request };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Request unavailable — Talab" }, { name: "robots", content: "noindex" }],
      };
    }
    const r = loaderData.request;
    return {
      meta: [
        { title: `${r.title} — Talab` },
        { name: "description", content: r.description.slice(0, 155) },
        { property: "og:title", content: `${r.title} — Talab` },
        { property: "og:description", content: r.description.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: RequestNotFound,
  component: RequestDetail,
});
function RequestNotFound() {
  return (
    <AppShell>
      <EmptyState
        emoji="🗑️"
        title="This request no longer exists"
        description="It may have been completed by its author or removed by moderation."
      />
      <div className="mt-4 text-center">
        <Button asChild variant="outline">
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    </AppShell>
  );
}
function RequestDetail() {
  const { request } = Route.useLoaderData();
  const [offerOpen, setOfferOpen] = useState(false);
  const [acceptedId, setAcceptedId] = useState(null);
  const isOwner = request.author.id === currentUser.id;
  return (
    <AppShell wide>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <article className="surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryTag slug={request.category} />
              <StatusBadge status={request.status} />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">{request.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar user={request.author} />
                <div>
                  <Link
                    to="/profile/$userId"
                    params={{ userId: request.author.id }}
                    className="text-sm font-semibold hover:text-primary"
                  >
                    {request.author.name}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Rating value={request.author.rating} />
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {request.location}
                    </span>
                    <span>{request.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toast.success("Link copied")}>
                  <Share2 className="size-4" /> Share
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toast.success("Reported")}>
                  <Flag className="size-4" /> Report
                </Button>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed">
              {request.description}
            </p>

            {request.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {request.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              <Paperclip className="size-4" /> brief.pdf · 240 KB
            </div>
          </article>

          <section className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Offers ({request.offers.length})</h2>
              {!isOwner && <Button onClick={() => setOfferOpen(true)}>Make an Offer</Button>}
            </div>
            <div className="mt-4 space-y-4">
              {request.offers.length === 0 ? (
                <EmptyState
                  emoji="🤝"
                  title="No offers yet"
                  description="This request is waiting for someone who can help."
                  {...(isOwner
                    ? {}
                    : { actionLabel: "Make an Offer", onAction: () => setOfferOpen(true) })}
                />
              ) : (
                request.offers.map((o) => (
                  <OfferCard
                    key={o.id}
                    offer={o}
                    isOwner={isOwner}
                    accepted={acceptedId === o.id}
                    onAccept={(offer) => {
                      setAcceptedId(offer.id);
                      toast.success("Offer accepted", {
                        description: `${offer.user.name} has been notified. The request is now in progress.`,
                      });
                    }}
                  />
                ))
              )}
            </div>
          </section>

          <Comments comments={request.comments} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Request information
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row
                icon={<Coins className="size-4 text-teal" />}
                label="Budget"
                value={
                  request.budgetMax === 0
                    ? "No budget"
                    : `${request.budgetMin} – ${request.budgetMax} TND`
                }
              />
              <Row
                icon={<MapPin className="size-4 text-teal" />}
                label="Location"
                value={request.location}
              />
              <Row
                icon={<CalendarDays className="size-4 text-teal" />}
                label="Deadline"
                value={request.deadline}
              />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={request.status} />
                </dd>
              </div>
            </dl>
            {!isOwner ? (
              <Button className="mt-5 w-full" onClick={() => setOfferOpen(true)}>
                Make an Offer
              </Button>
            ) : (
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link to="/my-requests">Manage this request</Link>
              </Button>
            )}
          </div>

          <div className="surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              About the author
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar user={request.author} size="lg" />
              <div>
                <p className="font-semibold">{request.author.name}</p>
                <p className="text-xs text-muted-foreground">{request.author.headline}</p>
                <Rating value={request.author.rating} count={request.author.completed} />
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Response rate" value={`${request.author.responseRate}%`} />
              <Metric label="Avg. response" value={request.author.avgResponse} />
            </dl>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/profile/$userId" params={{ userId: request.author.id }}>
                  Profile
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/messages">Message</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <MakeOfferModal open={offerOpen} onOpenChange={setOfferOpen} requestTitle={request.title} />
    </AppShell>
  );
}
function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-base font-bold">{value}</dd>
    </div>
  );
}
export { Route };
