import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Handshake, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/talab/AppShell";
import { categories, requests } from "@/lib/talab-data";
import { RequestCard } from "@/components/talab/RequestCard";
const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Talab — Need something? Ask Talab." },
      {
        name: "description",
        content:
          "Talab is Tunisia's community platform for asking help. Post what you need, get offers, recommendations and people who can help.",
      },
      { property: "og:title", content: "Talab — Need something? Ask Talab." },
      {
        property: "og:description",
        content:
          "Post a request, receive offers from students, freelancers and professionals across Tunisia.",
      },
    ],
  }),
  component: Landing,
});
function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            <Link
              to="/explore"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Categories
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Join Talab</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="hero-gradient">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Sparkles className="size-3.5 text-teal" /> Tunisia's community of people who help
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Need something? <span className="text-gradient">Ask Talab.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Connect with people who can help you, recommend someone, or offer their skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/create">
                  Post a Request <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/explore">Explore Requests</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["12,400+", "requests posted"],
                ["8,900", "people helping"],
                ["96%", "get a reply in a day"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xl font-extrabold sm:text-2xl">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Students, designers, photographers and technicians helping each other through Talab"
              width={1280}
              height={1024}
              className="w-full rounded-3xl border border-border shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: MessagesSquare,
              title: "Ask in 2 minutes",
              text: "Describe what you need, add a budget and a deadline. That's it.",
            },
            {
              icon: Handshake,
              title: "Get real offers",
              text: "People offer their help with a price and a delivery time you can compare.",
            },
            {
              icon: ShieldCheck,
              title: "Trust you can see",
              text: "Ratings, completed work and response rates are on every profile.",
            },
          ].map((f) => (
            <div key={f.title} className="surface p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-teal-soft text-teal">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Popular categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Find the people who do what you need.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/explore"
              search={{ category: c.slug }}
              className="surface flex flex-col gap-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.openRequests} open requests</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Live requests right now</h2>
          <Button asChild variant="ghost">
            <Link to="/explore">See all</Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.slice(0, 4).map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="surface hero-gradient flex flex-col items-center px-6 py-14 text-center">
          <h2 className="max-w-2xl text-3xl font-extrabold">
            People have needs. People have skills. Talab connects them.
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/register">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore">Browse requests first</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:px-6">
          <Logo />
          <p>© 2026 Talab · Made in Tunisia</p>
        </div>
      </footer>
    </div>
  );
}
export { Route };
