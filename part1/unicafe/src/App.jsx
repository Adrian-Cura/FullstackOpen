import { useState } from "react";

const Button = ({ handleclick, text }) => {
  return (
    <>
      <button onClick={handleclick}>{text}</button>
    </>
  );
};

const StatisticLine = (props) => {
  return (
    <tbody>
      <tr>
        <th>{props.text}: </th>
        <td>{props.value}</td>
      </tr>
    </tbody>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, total, average, positive } = props.value;

  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <table>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={total} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={positive} />
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const [value, setValue] = useState({
    good,
    neutral,
    bad,
    total,
    average,
    positive,
  });

  const getAverage = (good, bad, total) => (good - bad) / total;
  const getPositivePercentage = (good, total) => (good / total) * 100;

  const handleClickGood = () => {
    const updateGood = good + 1;
    setGood(updateGood);
    const updateTotal = total + 1;
    setTotal(updateTotal);

    const averageScore = getAverage(updateGood, bad, updateTotal);
    setAverage(averageScore);
    const positivePercentage = getPositivePercentage(updateGood, updateTotal);
    setPositive(positivePercentage);

    setValue((prevState) => {
      return {
        ...prevState,
        good: updateGood,
        total: updateTotal,
        average: averageScore,
        positive: positivePercentage,
      };
    });
  };

  const handleClickBad = () => {
    const updateBad = bad + 1;
    setBad(updateBad);
    const updateTotal = total + 1;
    setTotal(updateTotal);

    const averageScore = getAverage(good, updateBad, updateTotal);
    setAverage(averageScore);
    const positivePercentage = getPositivePercentage(good, updateTotal);
    setPositive(positivePercentage);

    setValue((prevState) => {
      return {
        ...prevState,
        bad: updateBad,
        total: updateTotal,
        average: averageScore,
        positive: positivePercentage,
      };
    });
  };

  const handleClickNeutral = () => {
    const updateValue = neutral + 1;
    setNeutral(updateValue);
    const updateTotal = total + 1;
    setTotal(updateTotal);

    const positivePercentage = getPositivePercentage(good, updateTotal);
    setPositive(positivePercentage);

    setValue((prevState) => {
      return {
        ...prevState,
        neutral: updateValue,
        total: updateTotal,
        positive: positivePercentage,
      };
    });
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleclick={handleClickGood} text="Good" />
      <Button handleclick={handleClickNeutral} text="Neutral" />
      <Button handleclick={handleClickBad} text="Bad" />
      <h2>Satistics</h2>
      <Statistics value={value} />
    </div>
  );
};

export default App;
