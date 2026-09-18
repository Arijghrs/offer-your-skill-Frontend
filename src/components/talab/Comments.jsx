import { useState } from "react";
import { Flag, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { currentUser } from "@/lib/talab-data";
import { Avatar } from "./primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
function CommentItem({ comment, depth = 0 }) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const mine = comment.user.id === currentUser.id;
  return (
    <div className={depth ? "ml-6 border-l border-border pl-4 sm:ml-11" : ""}>
      <div className="flex gap-3 py-4">
        <Avatar user={comment.user} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {comment.user.name}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {comment.createdAt}
            </span>
          </p>
          <p className="mt-1 whitespace-pre-line text-sm text-foreground">{comment.body}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={liked ? "text-primary" : "text-muted-foreground"}
              onClick={() => {
                setLiked(!liked);
                setLikes(likes + (liked ? -1 : 1));
              }}
            >
              <ThumbsUp className="size-4" /> {likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setReplying((v) => !v)}
            >
              Reply
            </Button>
            {mine ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => toast.success("Comment deleted")}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() =>
                  toast.success("Reported", { description: "Our team will review it." })
                }
              >
                <Flag className="size-4" /> Report
              </Button>
            )}
          </div>

          {replying && (
            <div className="mt-3 space-y-2">
              <Textarea rows={2} placeholder={`Reply to ${comment.user.name}...`} />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setReplying(false);
                    toast.success("Reply posted");
                  }}
                >
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((r) => (
        <CommentItem key={r.id} comment={r} depth={depth + 1} />
      ))}
    </div>
  );
}
function Comments({ comments }) {
  const [body, setBody] = useState("");
  return (
    <section className="surface p-5" id="comments">
      <h2 className="text-lg font-bold">Comments ({comments.length})</h2>

      <div className="mt-4 flex gap-3">
        <Avatar user={currentUser} size="sm" />
        <div className="flex-1 space-y-2">
          <Textarea
            rows={3}
            placeholder="Know someone who can help? Share a tip or a contact..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={body.trim().length < 3}
              onClick={() => {
                setBody("");
                toast.success("Comment posted");
              }}
            >
              Post comment
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-border border-t border-border">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to point this person in the right direction.
          </p>
        ) : (
          comments.map((c) => <CommentItem key={c.id} comment={c} />)
        )}
      </div>
    </section>
  );
}
export { Comments };
