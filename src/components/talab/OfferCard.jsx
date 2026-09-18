import { Link } from "@tanstack/react-router";
import { Clock, Coins, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Rating } from "./primitives";
import { Button } from "@/components/ui/button";
function OfferCard({ offer, isOwner, accepted, onAccept }) {
  return (
    <article
      className={cn(
        "surface p-5",
        accepted && "border-success/40 bg-success-soft/40 ring-1 ring-success/30",
      )}
    >
      {accepted && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">
          <CheckCircle2 className="size-3.5" /> Accepted offer
        </p>
      )}
      <div className="flex items-start gap-3">
        <Avatar user={offer.user} />
        <div className="min-w-0">
          <p className="font-semibold">{offer.user.name}</p>
          <Rating value={offer.user.rating} count={offer.user.completed} />
        </div>
      </div>

      <p className="mt-4 text-sm text-foreground">{offer.message}</p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Coins className="size-4 text-teal" /> {offer.price} TND
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-4 text-teal" /> {offer.days} days
        </span>
        {offer.portfolio && (
          <a
            href={offer.portfolio}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            <ExternalLink className="size-4" /> Portfolio
          </a>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/profile/$userId" params={{ userId: offer.user.id }}>
            View Profile
          </Link>
        </Button>
        {isOwner && !accepted && (
          <Button size="sm" onClick={() => onAccept?.(offer)}>
            Accept Offer
          </Button>
        )}
      </div>
    </article>
  );
}
export { OfferCard };
