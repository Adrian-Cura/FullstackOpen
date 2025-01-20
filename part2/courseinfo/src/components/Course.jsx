import Content from "./Content";
import Header from "./Header";

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((element) => (
        <div key={element.id}>
          <Header name={element.name} />
          <Content parts={element.parts} />
        </div>
      ))}
    </div>
  );
};

export default Course;
