import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, voteAnecdote } from "./requests";
import { useContext } from "react";
import NotificationContext from "./context/notificationContext";
import { notifyWithTimeout } from "./utils/notificationHelper";

const App = () => {
  const queryClient = useQueryClient();
  const [notification, dispatchNotification] = useContext(NotificationContext);

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a
        )
      );
    },
  });

  /* const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  }); */

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>Error: Insert CD-ROM</div>;
  }

  const anecdotes = result.data;

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote);
    notifyWithTimeout(
      dispatchNotification,
      `anecdote '${anecdote.content}' voted`
    );
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
