import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateVote(state, action) {
      const id = action.payload.id;
      const anecdoteToChange = state.find((a) => a.id === id);
      if (anecdoteToChange) {
        anecdoteToChange.votes++;
      }
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdote(state, action) {
      return action.payload;
    },
  },
});

export const { updateVote, appendAnecdote, setAnecdote } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdote(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.updateVote(anecdote);
    dispatch(updateVote(updatedAnecdote));
  };
};
