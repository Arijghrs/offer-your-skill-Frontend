import { Star } from "lucide-react";
import { EmptyState } from "./primitives";
function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        emoji="⭐"
        title="No reviews yet"
        description="Reviews appear after a completed request or an accepted offer."
      />
    );
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="surface p-5">
          <div className="flex items-start gap-3">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-teal-soft text-sm font-semibold text-teal"
              aria-hidden
            >
              {r.authorInitials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{r.author}</p>
                <span
                  className="inline-flex items-center gap-0.5"
                  aria-label={`${r.rating} out of 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < r.rating ? "size-4 fill-warning text-warning" : "size-4 text-border"
                      }
                    />
                  ))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.requestTitle} · {r.createdAt}
              </p>
              <p className="mt-2 text-sm">{r.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
export { ReviewList };
