import { useState } from 'react';
import { Comment } from '../types/Ticket';
import { commentService } from '../services/commentService';
import { formatDate } from '../utils/formatDate';

interface CommentSectionProps {
  ticketId: number;
  comments: Comment[];
  currentUserId: number;
  onCommentAdded: () => void;
}

export default function CommentSection({ ticketId, comments, currentUserId, onCommentAdded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentService.create({ content: newComment, ticketId, userId: currentUserId }, currentUserId);
      setNewComment('');
      onCommentAdded();
    } catch (err) {
      console.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Comments ({comments.length})</h4>
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 rounded p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{comment.userName}</span>
              <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="mt-1">{comment.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded border p-2"
          rows={2}
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50">
          Post
        </button>
      </form>
    </div>
  );
}