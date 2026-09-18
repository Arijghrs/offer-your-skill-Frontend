import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Home,
  MessageSquare,
  Plus,
  Search,
  LayoutGrid,
  User as UserIcon,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "./primitives";
import { currentUser } from "@/lib/talab-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function Logo({ className }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
        T
      </span>
      <span className="text-lg font-extrabold tracking-tight">Talab</span>
    </Link>
  );
}
const navLinks = [
  { to: "/home", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/my-requests", label: "My Requests" },
  { to: "/my-offers", label: "My Offers" },
];
function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Notifications"
          >
            <Link to="/notifications" className="relative">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Messages"
          >
            <Link to="/messages">
              <MessageSquare className="size-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar user={currentUser} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">My profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-requests">My requests</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-offers">My offers</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="hidden shadow-[var(--shadow-soft)] md:inline-flex">
            <Link to="/create">
              <Plus className="size-4" /> Post a Request
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link to="/messages">Messages</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Search },
    { to: "/notifications", label: "Alerts", icon: Bell },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="relative mx-auto grid max-w-md grid-cols-5 items-end px-2 py-2">
        {items.slice(0, 2).map((i) => (
          <NavItem key={i.to} {...i} active={pathname === i.to} />
        ))}
        <div className="flex justify-center">
          <Link
            to="/create"
            className="-mt-7 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)]"
            aria-label="Post a request"
          >
            <Plus className="size-7" />
          </Link>
        </div>
        {items.slice(2).map((i) => (
          <NavItem key={i.to} {...i} active={pathname === i.to} />
        ))}
      </div>
    </nav>
  );
}
function NavItem({ to, label, icon: Icon, active }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
function AppShell({ children, wide }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className={cn("mx-auto px-4 pb-28 pt-6 sm:px-6 md:pb-14", wide ? "max-w-7xl" : "max-w-5xl")}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export { AppShell, BottomNav, LayoutGrid, Logo, Navbar, PageHeader };
