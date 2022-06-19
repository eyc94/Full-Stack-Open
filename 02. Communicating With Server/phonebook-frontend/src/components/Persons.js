import React from "react";

import personService from "../services/persons";

const Persons = (props) => {
    return (
        <div>
            {props.persons.map(person =>
                <div key={person.name}>
                    {person.name}
                    {person.number}
                    <button onClick={() => props.deleteHandler(person.id)}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default Persons;
