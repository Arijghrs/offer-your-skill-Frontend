import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
import {
  Avatar,
  EmptyState,
  Rating,
  Tag,
} from "@/components/talab/primitives";
import { RequestCard } from "@/components/talab/RequestCard";
import { ReviewList } from "@/components/talab/ReviewList";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  myOffers,
  offerStatusMeta,
  requests,
} from "@/lib/talab-data";

import { api } from "@/lib/api";
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
      {
        property: "og:description",
        content: "Manage how the Talab community sees you.",
      },
    ],
  }),
  component: MyProfile,
});

function MyProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resume, setResume] = useState(null);

  const fileRef = useRef(null);

  // Temporary mock data for features that don't have backend APIs yet.
  const myRequests = requests.filter(
    (request) => String(request.author?.id) === String(user?.id)
  );

  const completed = myRequests.filter(
    (request) => request.status === "completed"
  );

  const reviews = [];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await api("/profile");

        setProfile(data.profile);

        // Resume will be handled by the upload API later.
        if (data.profile.resumeUrl) {
          setResume({
            name: "Resume / CV",
            size: "",
            uploadedAt: "",
            url: data.profile.resumeUrl,
          });
        } else {
          setResume(null);
        }
      } catch (error) {
        console.error("Load profile error:", error);
        toast.error(error.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  function onFile(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }

    setResume({
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: "Just now",
      url: null,
    });

    toast.success(
      "Resume selected. Upload API will be connected next."
    );
  }

  if (loading) {
    return (
      <AppShell wide>
        <section className="surface p-8">
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </section>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell wide>
        <EmptyState
          emoji="👤"
          title="Profile not found"
          description="We couldn't load your profile. Please try again."
        />
      </AppShell>
    );
  }

  const displayProfile = {
    ...profile,

    // Adapt backend field names to the Avatar component.
    id: profile.id,
    name: profile.fullName,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    about: profile.bio,

    // These will come from the review/stat APIs later.
    rating: 0,

    // Avatar component can use avatarUrl when available.
    avatar: profile.avatarUrl,
    avatarUrl: profile.avatarUrl,
  };

  return (
    <AppShell wide>
      <section className="surface overflow-hidden">
        <div className="hero-gradient h-24" />

        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12">
            <Avatar user={displayProfile} size="xl" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">
              {profile.fullName}
            </h1>

            {profile.username && (
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
            )}

            {profile.bio && (
              <p className="mt-2 max-w-2xl text-sm">
                {profile.bio}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {displayProfile.rating > 0 && (
                <Rating value={displayProfile.rating} />
              )}

              {profile.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {profile.location}
                </span>
              )}

              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4" />
                  {profile.email}
                </span>
              )}

              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/settings">Edit Profile</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Settings"
            >
              <Link to="/settings">
                <SettingsIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-4">
            {/* About */}
            <section className="surface p-5">
              <h2 className="text-lg font-bold">About</h2>

              {profile.bio ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No bio added yet.
                </p>
              )}
            </section>

            {/* Experience */}
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Experience</h2>

              {profile.experiences?.length > 0 ? (
                <ul className="mt-3 space-y-4">
                  {profile.experiences.map((experience) => (
                    <li
                      key={experience.id}
                      className="border-l-2 border-primary-soft pl-4"
                    >
                      <p className="font-semibold">
                        {experience.role}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {experience.company}
                        {experience.period
                          ? ` · ${experience.period}`
                          : ""}
                      </p>

                      {experience.summary && (
                        <p className="mt-1 text-sm">
                          {experience.summary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No experience added yet.
                </p>
              )}
            </section>

            {/* Education */}
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Education</h2>

              {profile.education?.length > 0 ? (
                <ul className="mt-3 space-y-4">
                  {profile.education.map((education) => (
                    <li
                      key={education.id}
                      className="border-l-2 border-teal-soft pl-4"
                    >
                      <p className="font-semibold">
                        {education.school}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {education.degree || ""}
                        {education.period
                          ? ` · ${education.period}`
                          : ""}
                      </p>

                      {education.description && (
                        <p className="mt-1 text-sm">
                          {education.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No education added yet.
                </p>
              )}
            </section>

            {/* Completed work */}
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Completed work</h2>

              <div className="mt-3 space-y-4">
                {completed.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing completed yet — finished requests will be
                    listed here.
                  </p>
                ) : (
                  completed.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            {/* Resume */}
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
                      <p className="truncate text-sm font-semibold">
                        {resume.name}
                      </p>

                      {(resume.size || resume.uploadedAt) && (
                        <p className="text-xs text-muted-foreground">
                          {resume.size}
                          {resume.size && resume.uploadedAt
                            ? " · "
                            : ""}
                          {resume.uploadedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="size-4" />
                      Replace
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setResume(null);
                        toast.success("Resume removed locally.");
                      }}
                    >
                      <Trash2 className="size-4" />
                      Remove
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

            {/* Skills */}
            <section className="surface p-5">
              <h2 className="text-lg font-bold">Skills</h2>

              {profile.skills?.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Tag key={skill.id}>
                      {skill.name}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No skills added yet.
                </p>
              )}

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
              >
                <Link to="/settings">Edit skills</Link>
              </Button>
            </section>
          </aside>
        </TabsContent>

        {/* Temporary mock data until Requests API is connected */}
        <TabsContent value="requests" className="mt-4 space-y-4">
          {myRequests.length === 0 ? (
            <EmptyState
              emoji="📝"
              title="No requests yet"
              description="Post your first request and the community will answer."
            />
          ) : (
            myRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
              />
            ))
          )}
        </TabsContent>

        {/* Temporary mock data until Offers API is connected */}
        <TabsContent
          value="offers"
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          {myOffers.map((offer) => {
            const meta = offerStatusMeta[offer.status];

            return (
              <article
                key={offer.id}
                className="surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">
                    {offer.requestTitle}
                  </h3>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      meta.className
                    )}
                  >
                    {meta.label}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {offer.message}
                </p>

                <p className="mt-3 text-sm">
                  {offer.price} TND · {offer.days} days
                </p>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-4"
                >
                  <Link
                    to="/request/$requestId"
                    params={{
                      requestId: offer.requestId,
                    }}
                  >
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