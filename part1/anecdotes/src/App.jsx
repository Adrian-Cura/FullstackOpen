import { useState } from "react";

const WinnerAnecdote = ({ anecdotes, vote, displayWinner }) => {
  const higherVote = Math.max(...vote);
  const index = vote.indexOf(higherVote);

  if (displayWinner) {
    return (
      <div>
        <h2>Anecdote with most votes:</h2>
        <p>{anecdotes[index]}</p>
        <p>Has {higherVote} votes</p>
      </div>
    );
  }
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [displayWinner, setDisplayWinner] = useState(false);

  const instantNumber = () => {
    const result = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
    return result;
  };

  const handleVote = (selected) => {
    let copy = [...vote];
    copy[selected] += 1;
    setVote(copy);
    setDisplayWinner(true);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      Has {vote[selected]} votes
      <br />
      <button onClick={() => handleVote(selected)}>Vote</button>
      <button onClick={() => setSelected(instantNumber)}>Next</button>
      <WinnerAnecdote
        anecdotes={anecdotes}
        vote={vote}
        displayWinner={displayWinner}
      />
    </div>
  );
};

export default App;
