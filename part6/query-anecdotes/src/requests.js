import axios from "axios";
const baseURL = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

export const getAnecdotes = () => axios.get(baseURL).then((res) => res.data);

export const createAnecdote = async (anecdote) => {
  const newAnecdote = { content: anecdote, votes: 0, id: getId() };
  const result = await axios.post(baseURL, newAnecdote);
  return result.data;
};

export const voteAnecdote = async (anecdote) => {
  const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
  const result = await axios.put(`${baseURL}/${anecdote.id}`, newAnecdote);
  return result.data;
};
