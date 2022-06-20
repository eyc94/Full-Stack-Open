import React, { useState, useEffect } from "react";

import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

import personService from "./services/persons";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newFilter, setNewFilter] = useState("");

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons);
            });
    }, []);

    const addPerson = (event) => {
        event.preventDefault();

        const personObject = {
            name: newName,
            number: newNumber
        };

        if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
            const updateMessage = `${newName} is already added to the phonebook! Replace the old number with a new one?`;
            if (window.confirm(updateMessage)) {
                const personToChange = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());
                const changedPerson = { ...personToChange, number: newNumber };
                personService
                    .update(personToChange.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(persons => person.name.toLowerCase() !== newName.toLowerCase() ? person : returnedPerson));
                    });
            }
        } else {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                });
        }

        setNewName("");
        setNewNumber("");
    };

    const deleteHandler = (id, name) => {
        const message = `Delete ${name}?`
        if (window.confirm(message)) {
            personService
                .remove(id)
                .then(returnedObject => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value);
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter));

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filterVal={newFilter} filterHandler={handleFilterChange} />
            <h3>Add New</h3>
            <PersonForm
                submitHandler={addPerson}
                newName={newName}
                newNumber={newNumber}
                nameHandler={handleNameChange}
                numberHandler={handleNumberChange}
            />
            <h3>Numbers</h3>
            <Persons persons={personsToShow} deleteHandler={deleteHandler} />
        </div>
    );
};

export default App;
