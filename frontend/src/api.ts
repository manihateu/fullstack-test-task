import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // адрес Nest.js API
});

export interface Idea {
  id: number;
  title: string;
  description: string;
  votesCount: number;
  voted: boolean;
}

export async function fetchIdeas(): Promise<Idea[]> {
  const { data } = await api.get('/ideas');
  return data;
}

export async function voteForIdea(id: number): Promise<void> {
  await api.post(`/ideas/${id}/vote`);
}
