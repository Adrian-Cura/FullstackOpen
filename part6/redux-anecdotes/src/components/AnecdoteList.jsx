import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
import { createSelector } from "@reduxjs/toolkit";

// Define el selector memorizado FUERA del componente
const selectFilteredAnecdotes = createSelector(
  [(state) => state.anecdotes, (state) => state.filterNow.toLowerCase()],
  (anecdotes, filter) =>
    anecdotes.filter((a) => a.content.toLowerCase().includes(filter))
);
const AnecdoteList = () => {
  const dispatch = useDispatch();

  // Usa el selector memorizado con useSelector
  const anecdotes = useSelector(selectFilteredAnecdotes);

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(
      setNotificationWithTimeout(`you voted: '${anecdote.content}'`, 10)
    );
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
