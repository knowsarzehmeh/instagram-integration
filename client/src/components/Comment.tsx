import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiServices } from "@/utils/api";

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: Comment[];
}

interface CommentProps {
  comment: Comment;
  mediaId: string;
  userId: string;
}

export function Comment({ comment, mediaId, userId }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setIsSubmitting(true);
      await apiServices.replyToComment(mediaId, comment.id, userId, replyText);
      setReplyText("");
      setShowReply(false);
      // TODO: Refresh comments after successful reply
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.username}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{comment.text}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setShowReply(!showReply)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Reply
          </Button>
        </div>
      </div>

      {showReply && (
        <div className="pl-10">
          <div className="flex gap-2">
            <Input
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleReply}
              disabled={isSubmitting || !replyText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-10 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              mediaId={mediaId}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
