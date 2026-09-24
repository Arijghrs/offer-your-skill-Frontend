import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  Coins,
  MapPin,
  MessageSquare,
  Handshake,
  ChevronDown,
  Check,
  X,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, CategoryTag, StatusBadge, Rating } from "./primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function CommentThread({ comments }) {
  const [body, setBody] = useState("");
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to point this person in the right direction.
        </p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="flex gap-3">
              <Avatar user={c.user} size="sm" />
              <div className="min-w-0 flex-1 rounded-xl bg-muted px-3 py-2">
                <p className="text-sm font-semibold">
                  {c.user.name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {c.createdAt}
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-line text-sm">{c.body}</p>
              </div>
            </div>
            {c.replies?.map((r) => (
              <div key={r.id} className="ml-8 flex gap-3 sm:ml-11">
                <Avatar user={r.user} size="sm" />
                <div className="min-w-0 flex-1 rounded-xl bg-muted px-3 py-2">
                  <p className="text-sm font-semibold">
                    {r.user.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {r.createdAt}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <div className="space-y-2">
        <Textarea
          rows={2}
          placeholder="Write a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={body.trim().length < 3}
            onClick={() => {
              setBody("");
              toast.success("Comment posted");
            }}
          >
            Post comment
          </Button>
        </div>
      </div>
    </div>
  );
}

function OfferReviewList({ offers }) {
  const [decisions, setDecisions] = useState({});
  if (!offers?.length) {
    return (
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">No offers received yet.</p>
      </div>
    );
  }
  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      {offers.map((o) => {
        const decision = decisions[o.id];
        return (
          <article
            key={o.id}
            className={cn(
              "rounded-xl border border-border p-4",
              decision === "accepted" && "border-success/40 bg-success-soft/40",
              decision === "declined" && "opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar user={o.user} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{o.user.name}</p>
                <Rating value={o.user.rating} count={o.user.completed} />
              </div>
              {decision && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    decision === "accepted"
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {decision === "accepted" ? "Accepted" : "Declined"}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm">{o.message}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Coins className="size-4 text-teal" /> {o.price} TND
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4 text-teal" /> {o.days} days
              </span>
            </div>
            {!decision && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setDecisions((d) => ({ ...d, [o.id]: "accepted" }));
                    toast.success(`Offer from ${o.user.name} accepted`);
                  }}
                >
                  <Check className="size-4" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDecisions((d) => ({ ...d, [o.id]: "declined" }));
                    toast.success("Offer declined");
                  }}
                >
                  <X className="size-4" /> Decline
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function RequestCard({ request, manageOffers = false }) {
  const [open, setOpen] = useState(false);
  const budget =
    request.budgetMax === 0
      ? "Volunteer / no budget"
      : `${request.budgetMin} – ${request.budgetMax} TND`;
  return (
    <article className="surface p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <header className="flex items-start justify-between gap-3">
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
            <p className="text-xs text-muted-foreground">{request.createdAt}</p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CategoryTag slug={request.category} />
        {request.urgency === "urgent" && (
          <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
            Urgent
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link
          to="/request/$requestId"
          params={{ requestId: request.id }}
          className="hover:text-primary"
        >
          {request.title}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{request.description}</p>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-1.5">
          <Coins className="size-4 text-teal" />
          <span className="font-medium text-foreground">{budget}</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <MapPin className="size-4 text-teal" />
          {request.location}
        </div>
        <div className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 text-teal" />
          Deadline: {request.deadline}
        </div>
      </dl>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-muted"
          >
            {manageOffers ? (
              <>
                <Handshake className="size-4 text-success" /> {request.offersCount} offers
              </>
            ) : (
              <>
                <MessageSquare className="size-4" /> {request.commentsCount} comments
              </>
            )}
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
          </button>
          <span className="inline-flex items-center gap-1.5 px-1">
            {manageOffers ? (
              <>
                <MessageSquare className="size-4" /> {request.commentsCount}
              </>
            ) : (
              <>
                <Handshake className="size-4 text-success" /> {request.offersCount} offers
              </>
            )}
          </span>
        </div>
        
      </footer>

      {open &&
        (manageOffers ? (
          <OfferReviewList offers={request.offers ?? []} />
        ) : (
          <CommentThread comments={request.comments ?? []} />
        ))}
    </article>
  );
}
export { RequestCard };
