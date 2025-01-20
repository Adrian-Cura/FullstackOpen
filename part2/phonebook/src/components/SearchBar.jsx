const SearchBar = ({ search, handleOnChangeSearch }) => {
  return (
    <div>
      Search:
      <input
        type="text"
        value={search}
        onChange={handleOnChangeSearch}
        placeholder="Search contacts..."
      />
    </div>
  );
};

export default SearchBar;
