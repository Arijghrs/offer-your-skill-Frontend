import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, LogOut, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/talab/AppShell";
import { Avatar } from "@/components/talab/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { currentUser, defaultPrivacy, locations } from "@/lib/talab-data";
import { useAuth } from "@/lib/auth";
const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Talab" },
      {
        name: "description",
        content: "Manage your Talab account, profile, notifications and privacy preferences.",
      },
      { property: "og:title", content: "Settings — Talab" },
      {
        property: "og:description",
        content: "Account, profile, notifications, privacy and account deletion.",
      },
    ],
  }),
  component: SettingsPage,
});
function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const profile = user ?? currentUser;
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [bio, setBio] = useState(profile.about);
  const [location, setLocation] = useState(profile.location);
  const [skills, setSkills] = useState(profile.skills.join(", "));
  const [resume, setResume] = useState(currentUser.resume ?? null);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    comments: true,
    offers: true,
    decisions: true,
    messages: true,
    reviews: false,
  });
  const [privacy, setPrivacy] = useState(profile.privacy ?? defaultPrivacy);
  const fileRef = useRef(null);
  const avatarRef = useRef(null);
  function saveAccount() {
    if (name.trim().length < 3) {
      toast.error("Enter your full name");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    updateUser({ name, email, phone });
    toast.success("Account updated");
  }
  function saveProfile() {
    updateUser({
      about: bio,
      location,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    toast.success("Profile updated");
  }
  function changePassword() {
    if (passwords.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  }
  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account, profile and preferences." />

      <Tabs defaultValue="account">
        <TabsList className="flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-4">
          <section className="surface p-6">
            <h2 className="text-lg font-bold">Account information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="s-name">Full name</Label>
                <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-email">Email</Label>
                <Input
                  id="s-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-phone">Phone number</Label>
                <Input
                  id="s-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 ..."
                />
              </div>
            </div>
            <Button className="mt-5" onClick={saveAccount}>
              Save changes
            </Button>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-bold">Change password</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="p-cur">Current password</Label>
                <Input
                  id="p-cur"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="p-new">New password</Label>
                <Input
                  id="p-new"
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="p-conf">Confirm new password</Label>
                <Input
                  id="p-conf"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-5" variant="outline" onClick={changePassword}>
              Update password
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <section className="surface p-6">
            <h2 className="text-lg font-bold">Profile picture</h2>
            <div className="mt-4 flex items-center gap-4">
              <Avatar user={profile} size="lg" />
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={() => toast.success("Profile picture updated")}
              />
              <Button variant="outline" onClick={() => avatarRef.current?.click()}>
                Change picture
              </Button>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-bold">Profile details</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="s-bio">Bio</Label>
                <Textarea
                  id="s-bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="s-skills">Skills (comma separated)</Label>
                  <Input id="s-skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
              </div>
            </div>
            <Button className="mt-5" onClick={saveProfile}>
              Save profile
            </Button>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-bold">Resume / CV</h2>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => {
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
              }}
            />
            {resume ? (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <FileText className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{resume.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {resume.size} · {resume.uploadedAt}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Replace
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
                  Remove
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="mt-4" onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" /> Upload PDF resume
              </Button>
            )}
          </section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <section className="surface divide-y divide-border p-2">
            {[
              ["comments", "New comments", "Someone comments on one of your requests."],
              ["offers", "New offers", "Someone offers to help on your request."],
              ["decisions", "Offer accepted / rejected", "The author answers one of your offers."],
              ["messages", "Messages", "You receive a direct message."],
              ["reviews", "Reviews", "Someone leaves you a review."],
            ].map(([key, title, desc]) => (
              <div key={key} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={notifications[key]}
                  onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })}
                />
              </div>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <section className="surface divide-y divide-border p-2">
            {[
              ["profilePublic", "Public profile", "Anyone on Talab can open your profile."],
              ["showEmail", "Show my email", "Display your email address on your public profile."],
              [
                "showPhone",
                "Show my phone number",
                "Display your phone number on your public profile.",
              ],
              ["showResume", "Show my resume", "Let other members download your CV."],
            ].map(([key, title, desc]) => (
              <div key={key} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={privacy[key]}
                  onCheckedChange={(v) => {
                    const next = { ...privacy, [key]: v };
                    setPrivacy(next);
                    updateUser({ privacy: next });
                  }}
                />
              </div>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="danger" className="mt-4">
          <section className="surface border-destructive/30 p-6">
            <h2 className="text-lg font-bold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These actions affect your whole account.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                  navigate({ to: "/", replace: true });
                }}
              >
                <LogOut className="size-4" /> Log out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="size-4" /> Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your Talab account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes your requests, offers, messages and reviews. This
                      action can't be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        logout();
                        toast.success("Account deleted");
                        navigate({ to: "/", replace: true });
                      }}
                    >
                      Delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
export { Route };
