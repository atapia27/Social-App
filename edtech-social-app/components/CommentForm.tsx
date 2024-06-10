import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../redux/slices/videoSlice';

interface CommentFormProps {
  videoId: string;
}

const CommentForm = ({ videoId }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addComment({ videoId, comment }));
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Add a comment"
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default CommentForm;
