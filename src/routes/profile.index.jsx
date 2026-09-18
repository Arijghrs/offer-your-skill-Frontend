import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  FileText,
  Mail,
  MapPin,
  Phone,
  Settings as SettingsIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/talab/AppShell";
import { Avatar, EmptyState, Rating, StatTile, Tag } from "@/components/talab/primitives";
import { RequestCard } from "@/components/talab/RequestCard";
import { ReviewList } from "@/components/talab/ReviewList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, myOffers, offerStatusMeta, requests } from "@/lib/talab-data";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "My profile — Talab" },
      {
        name: "description",
        content:
          "Your Talab profile: bio, skills, resume, education, experience, requests, offers and reviews.",
      },
      { property: "og:title", content: "My profile — Talab" },
      { property: "og:description", content: "Manage how the Talab community sees you." },
    ],
  }),
  component: MyProfile,
});
function MyProfile() {
  const { user } = useAuth();
  const profile = user ?? currentUser;
  const [resume, setResume] = useState(currentUser.resume ?? null);
  const fileRef = useRef(null);
  const myRequests = requests.filter((r) => r.author.id === currentUser.id);
  const completed = myRequests.filter((r) => r.status === "completed");
  const reviews = currentUser.reviews ?? [];
  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }
    setResume({
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: "Just now",
    });
    toast.success("Resume uploaded");
  }
  return (
    <AppShell wide>
      <section className="surface overflow-hidden">
        <div className="hero-gradient h-24" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12">
            <Avatar user={profile} size="xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{profile.name}</h1>
            {profile.username && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
            <p className="mt-2 max-w-2xl text-sm">{profile.about || profile.headline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Rating value={profile.rating} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {profile.location}
              </span>
              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4" /> {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" /> {profile.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/settings">Edit Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Settings">
              <Link to="/settings">
                <SettingsIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Rating"
          value={profile.rating.toFixed(1)}
          hint={`${reviews.length} reviews`}
        />
        <StatTile
          label="Completed"
          value={String(currentUser.completed)}
          hint="requests & offers"
        />
        <StatTile label="Response rate" value={`${currentUser.responseRate}%`} />
        <StatTile label="Avg. response" value={currentUser.avgResponse} />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-4">
            <section className="surface p-5">
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-2 text-sm text-muted-foreground">{currentUser.about}</p>
            </section>

            <section className="surface p-5">
              <h2 className="text-lg font-bold">Experience</h2>
              <ul className="mt-3 space-y-4">
                {(currentUser.experience ?? []).map((x) => (
                  <li key={x.id} className="border-l-2 border-primary-soft pl-4">
                    <p className="font-semibold">{x.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {x.company} · {x.period}
                    </p>
                    <p className="mt-1 text-sm">{x.summary}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface p-5">
              <h2 className="text-lg font-bold">Education</h2>
              <ul className="mt-3 space-y-4">
                {(currentUser.education ?? []).map((e) => (
                  <li key={e.id} className="border-l-2 border-teal-soft pl-4">
                    <p className="font-semibold">{e.school}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.degree} · {e.period}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface p-5">
              <h2 className="text-lg font-bold">Completed work</h2>
              <div className="mt-3 space-y-4">
                {completed.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing completed yet — finished requests will be listed here.
                  </p>
                ) : (
                  completed.map((r) => <RequestCard key={r.id} request={r} />)
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Resume / CV</h2>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={onFile}
              />
              {resume ? (
                <div className="mt-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <FileText className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{resume.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {resume.size} · {resume.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="size-4" /> Replace
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setResume(null);
                        toast.success("Resume removed");
                      }}
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted px-4 py-8 text-sm text-muted-foreground hover:bg-accent"
                >
                  <Upload className="size-5" />
                  Upload your resume (PDF)
                </button>
              )}
            </section>

            <section className="surface p-5">
              <h2 className="text-lg font-bold">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentUser.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
                <Link to="/settings">Edit skills</Link>
              </Button>
            </section>
          </aside>
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-4">
          {myRequests.length === 0 ? (
            <EmptyState
              emoji="📝"
              title="No requests yet"
              description="Post your first request and the community will answer."
            />
          ) : (
            myRequests.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-4 grid gap-4 sm:grid-cols-2">
          {myOffers.map((o) => {
            const meta = offerStatusMeta[o.status];
            return (
              <article key={o.id} className="surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">{o.requestTitle}</h3>
                  <span
                    className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", meta.className)}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{o.message}</p>
                <p className="mt-3 text-sm">
                  {o.price} TND · {o.days} days
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <Link to="/request/$requestId" params={{ requestId: o.requestId }}>
                    View Request
                  </Link>
                </Button>
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <ReviewList reviews={reviews} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
export { Route };
