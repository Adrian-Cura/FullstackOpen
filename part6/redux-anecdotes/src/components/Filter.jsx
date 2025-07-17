import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input name="filter" onChange={(e) => handleChange(e)} />
    </div>
  );
};

export default Filter;
