import React, { useEffect, useState } from 'react';
import { type Idea, fetchIdeas, voteForIdea } from '../api';
import { IdeaCard } from '../components/IdeaCard';
import { Loading } from '../components/Loading';

export const IdeasList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingIds, setVotingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await fetchIdeas();
      setIdeas(data);
    } catch {
      setError('Не удалось загрузить идеи');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: number) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? { ...idea, voted: true, votesCount: idea.votesCount + 1 }
          : idea
      )
    );
    setVotingIds((ids) => [...ids, id]);
    try {
      await voteForIdea(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при голосовании');
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id
            ? { ...idea, voted: false, votesCount: Math.max(idea.votesCount - 1, 0) }
            : idea
        )
      );
    } finally {
      setVotingIds((ids) => ids.filter((x) => x !== id));
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Идеи для развития продукта</h1>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="space-y-3">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};
