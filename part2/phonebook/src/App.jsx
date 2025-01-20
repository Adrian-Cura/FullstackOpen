import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import Form from "./components/Form";
import Persons from "./components/Persons";
import contacts from "./services/contacts";
import Notifications from "./components/Notifications";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      contacts.getAll().then((fullResponse) => setPersons(fullResponse));
    };

    fetchData();
  }, []);

  const resetInputs = () => {
    setNewName("");
    setNewNumber("");
  };

  const postNumber = () => {
    contacts
      .create({ name: newName, number: newNumber })
      .then((response) => {
        setPersons((prevState) => [...prevState, response]);
        setMessage(`${newName} was sucessfully added to phonebook`);
        setError(false);
        setTimeout(() => {
          setMessage(null);
          setError(null);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        setMessage(
          `${newName} cannnot be added right now. Please refresh the website`
        );
        setError(true);
        setTimeout(() => {
          setMessage(null);
          setError(null);
        }, 5000);
      });
    resetInputs();
  };

  const updateNumber = (id, newNumber) => {
    contacts
      .update(id, newNumber)
      .then((response) => {
        setPersons((prevPersons) =>
          prevPersons.map((p) => (p.id === id ? response : p))
        );

        setMessage(`${newName} number has been updated to phonebook`);
        setError(false);
        setTimeout(() => {
          setMessage(null);
          setError(null);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        setMessage(
          `Information of ${newName} has already been removed from server. Please refresh the website`
        );
        setError(true);
        setTimeout(() => {
          setMessage(null);
          setError(null);
        }, 5000);
      });
    resetInputs();
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOnChangeName = (event) => setNewName(event);
  const handleOnChangeNumber = (event) => setNewNumber(event);
  const handleOnChangeSearch = (event) => setSearch(event.target.value);

  const handleDelete = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      contacts
        .deleteContact(person.id)
        .then((response) => {
          const newList = persons.filter(
            (contact) => contact.name !== response.name
          );
          setPersons(newList);
          setMessage(
            `${person.name} has been sucessfully deleted from phonebook`
          );
          setError(false);
          setTimeout(() => {
            setMessage(null);
            setError(null);
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
          setMessage(
            `information of ${person.name} was already removed from our server. Please refresh the website`
          );
          setError(true);
          setTimeout(() => {
            setMessage(null);
            setError(null);
          }, 5000);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const duplicated = persons.find((obj) => obj.name === newName);

    if (duplicated) {
      if (duplicated.number === newNumber) {
        alert(`${newName} is already added to phonebook`);
      } else {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          const id = persons.find((person) => person.name === newName)?.id;
          updateNumber(id, { name: newName, number: newNumber });
        }
      }
    } else {
      postNumber();
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notifications message={message} error={error} />
      <SearchBar search={search} handleOnChangeSearch={handleOnChangeSearch} />
      <h2>Add a new</h2>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleOnChangeName={handleOnChangeName}
        handleOnChangeNumber={handleOnChangeNumber}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
