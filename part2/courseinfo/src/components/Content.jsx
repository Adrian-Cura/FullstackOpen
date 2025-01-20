import Part from "./Part";

const Content = ({ parts }) => {
  const total = parts.reduce((acc, part) => acc + part.exercises, 0);

  return (
    <div>
      {parts.map((element) => (
        <Part
          key={element.id}
          name={element.name}
          exercises={element.exercises}
        />
      ))}
      <p>
        <strong>Total of {total} exercises</strong>
      </p>
    </div>
  );
};

export default Content;
