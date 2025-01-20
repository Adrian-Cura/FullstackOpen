const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <>
      {filteredPersons.map((element) => (
        <div key={element.name}>
          <p>
            {element.name + ": " + element.number}{" "}
            <button onClick={() => handleDelete(element)}>Delete</button>
          </p>
        </div>
      ))}
    </>
  );
};

export default Persons;
