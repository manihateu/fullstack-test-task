import { motion } from 'framer-motion';
import React from 'react';
import type { Idea } from '../api';

type Props = {
  idea: Idea;
  onVote: (id: number) => void;
  voting: boolean;
};

export const IdeaCard: React.FC<Props> = ({ idea, onVote, voting }) => {
  return (
    <motion.div
      layout
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
    >
      <div>
        <h3 className="font-semibold text-lg">{idea.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{idea.description}</p>
        <p className="text-xs text-gray-400 mt-1">Голосов: {idea.votesCount}</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={idea.voted || voting}
        onClick={() => onVote(idea.id)}
        className={`px-3 py-2 rounded-lg text-sm font-medium ${
          idea.voted
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {voting ? '...' : idea.voted ? 'Проголосовано' : 'Голосовать'}
      </motion.button>
    </motion.div>
  );
};
