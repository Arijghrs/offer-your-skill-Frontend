import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, statusMeta } from "@/lib/talab-data";
import { Button } from "@/components/ui/button";
function Avatar({ user, size = "md", showOnline }) {
  const sizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-base",
    xl: "size-24 text-2xl",
  };
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-primary-soft font-semibold text-primary ring-1 ring-border",
          sizes[size],
        )}
        aria-hidden
      >
        {user.initials}
      </span>
      {showOnline && user.online && (
        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-success" />
      )}
    </span>
  );
}
function Rating({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
      <Star className="size-4 fill-warning text-warning" />
      {value.toFixed(1)}
      {count !== void 0 && <span className="text-muted-foreground">· {count} completed</span>}
    </span>
  );
}
function StatusBadge({ status }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className,
      )}
    >
      <span aria-hidden>{meta.dot}</span>
      {meta.label}
    </span>
  );
}
function CategoryTag({ slug }) {
  const cat = categories.find((c) => c.slug === slug) ?? categories[0];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
      <span aria-hidden>{cat.emoji}</span>
      {cat.name}
    </span>
  );
}
function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}
function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
function EmptyState({ emoji, title, description, actionLabel, onAction }) {
  return (
    <div className="surface flex flex-col items-center px-6 py-14 text-center">
      <div
        className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-3xl"
        aria-hidden
      >
        {emoji}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
function CardSkeleton() {
  return (
    <div className="surface animate-pulse space-y-4 p-5">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-muted" />
          <div className="h-2.5 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-5/6 rounded bg-muted" />
    </div>
  );
}
function StatTile({ label, value, hint }) {
  return (
    <div className="surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
export {
  Avatar,
  CardSkeleton,
  CategoryTag,
  EmptyState,
  Rating,
  SectionTitle,
  StatTile,
  StatusBadge,
  Tag,
};
