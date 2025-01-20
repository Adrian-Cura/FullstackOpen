const Form = ({
  newName,
  newNumber,
  handleSubmit,
  handleOnChangeName,
  handleOnChangeNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Name:
        <input
          onChange={(event) => handleOnChangeName(event.target.value)}
          value={newName}
        />
        <br />
        Number:
        <input
          required
          onChange={(event) => handleOnChangeNumber(event.target.value)}
          value={newNumber}
        />
      </div>
      <div>
        <button disabled={!newName} type="submit">
          add
        </button>
      </div>
    </form>
  );
};

export default Form;
