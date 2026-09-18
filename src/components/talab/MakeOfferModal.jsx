import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function MakeOfferModal({ open, onOpenChange, requestTitle }) {
  const [price, setPrice] = useState("150");
  const [days, setDays] = useState("3");
  const [message, setMessage] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  function validate() {
    const e = {};
    const p = Number(price);
    if (!price.trim()) e.price = "Enter the price you're asking for.";
    else if (Number.isNaN(p) || p <= 0) e.price = "Price must be a positive number in TND.";
    const d = Number(days);
    if (!days.trim()) e.days = "Tell the author how long you need.";
    else if (Number.isNaN(d) || d <= 0) e.days = "Delivery must be at least 1 day.";
    if (message.trim().length < 20)
      e.message = "Explain how you can help — at least 20 characters.";
    if (portfolio && !/^https?:\/\/.+\..+/.test(portfolio))
      e.portfolio = "Use a full link starting with https://";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function submit() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      setMessage("");
      toast.success("Offer sent", {
        description: `Your offer of ${price} TND was sent to the request author.`,
      });
    }, 700);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            You're offering help on “{requestTitle}”. Be specific — clear offers get accepted
            faster.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your price" error={errors.price} htmlFor="offer-price">
              <div className="relative">
                <Input
                  id="offer-price"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  aria-invalid={!!errors.price}
                  className="pr-14"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  TND
                </span>
              </div>
            </Field>
            <Field label="Estimated delivery" error={errors.days} htmlFor="offer-days">
              <div className="relative">
                <Input
                  id="offer-days"
                  inputMode="numeric"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  aria-invalid={!!errors.days}
                  className="pr-16"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  days
                </span>
              </div>
            </Field>
          </div>

          <Field label="Message" error={errors.message} htmlFor="offer-message">
            <Textarea
              id="offer-message"
              rows={4}
              placeholder="Explain how you can help..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
            />
          </Field>

          <Field
            label="Portfolio link (optional)"
            error={errors.portfolio}
            htmlFor="offer-portfolio"
          >
            <Input
              id="offer-portfolio"
              placeholder="https://..."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              aria-invalid={!!errors.portfolio}
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Sending..." : "Submit Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, error, htmlFor, children }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
export { MakeOfferModal };
