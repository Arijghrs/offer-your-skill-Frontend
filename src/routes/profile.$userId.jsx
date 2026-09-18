import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { AppShell } from "@/components/talab/AppShell";
import { Avatar, EmptyState, Rating, StatTile, Tag } from "@/components/talab/primitives";
import { RequestCard } from "@/components/talab/RequestCard";
import { ReviewList } from "@/components/talab/ReviewList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  defaultPrivacy,
  genericEducation,
  genericReviews,
  requests,
  userById,
} from "@/lib/talab-data";
const Route = createFileRoute("/profile/$userId")({
  loader: ({ params }) => {
    const user = userById(params.userId);
    if (!user) throw notFound();
    return { user };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Profile unavailable — Talab" }, { name: "robots", content: "noindex" }],
      };
    }
    const u = loaderData.user;
    return {
      meta: [
        { title: `${u.name} — Talab profile` },
        {
          name: "description",
          content: `${u.headline} in ${u.location}. ${u.completed} completed requests on Talab.`,
        },
        { property: "og:title", content: `${u.name} — Talab profile` },
        { property: "og:description", content: `${u.headline} · ⭐ ${u.rating} · ${u.location}` },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <EmptyState
        emoji="👤"
        title="This profile doesn't exist"
        description="The member may have deleted their account."
      />
    </AppShell>
  ),
  component: PublicProfile,
});
function PublicProfile() {
  const { user } = Route.useLoaderData();
  const privacy = user.privacy ?? defaultPrivacy;
  const theirRequests = requests.filter((r) => r.author.id === user.id);
  const reviews = user.reviews ?? genericReviews;
  const education = user.education ?? genericEducation;
  return (
    <AppShell wide>
      <section className="surface overflow-hidden">
        <div className="hero-gradient h-24" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12">
            <Avatar user={user} size="xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.headline}</p>
            <p className="mt-2 max-w-2xl text-sm">
              {user.about || "This member hasn't written a bio yet."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Rating value={user.rating} count={user.completed} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {user.location}
              </span>
              {privacy.showEmail && user.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4" /> {user.email}
                </span>
              )}
              {privacy.showPhone && user.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" /> {user.phone}
                </span>
              )}
            </div>
          </div>
          <Button asChild>
            <Link to="/messages">Message</Link>
          </Button>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Rating"
          value={user.rating.toFixed(1)}
          hint={`${reviews.length} reviews`}
        />
        <StatTile label="Completed" value={String(user.completed)} hint="requests" />
        <StatTile label="Response rate" value={`${user.responseRate}%`} />
        <StatTile label="Avg. response" value={user.avgResponse} />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-4">
            <section className="surface p-5">
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {user.about || "This member hasn't written a bio yet."}
              </p>
            </section>
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Education</h2>
              <ul className="mt-3 space-y-4">
                {education.map((e) => (
                  <li key={e.id} className="border-l-2 border-teal-soft pl-4">
                    <p className="font-semibold">{e.school}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.degree} · {e.period}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.skills.length ? (
                  user.skills.map((s) => <Tag key={s}>{s}</Tag>)
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed.</p>
                )}
              </div>
            </section>

            {privacy.showResume && user.resume && (
              <section className="surface p-5">
                <h2 className="text-lg font-bold">Resume</h2>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.resume.name}</p>
                    <p className="text-xs text-muted-foreground">{user.resume.size}</p>
                  </div>
                </div>
              </section>
            )}
          </aside>
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-4">
          {theirRequests.length === 0 ? (
            <EmptyState
              emoji="📭"
              title="No public requests"
              description="This member hasn't posted any request yet."
            />
          ) : (
            theirRequests.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <ReviewList reviews={reviews} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
export { Route };
