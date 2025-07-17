import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { notifyWithTimeout } from "../utils/notificationHelper";
import NotificationContext from "../context/notificationContext";
import { useContext } from "react";

const AnecdoteForm = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);

  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
    onError: () => {
      notifyWithTimeout(
        dispatchNotification,
        "too short anecdote, must have length 5 or more"
      );
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdoteMutation.mutate(content);
    notifyWithTimeout(dispatchNotification, `anecdote '${content}' created`);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
