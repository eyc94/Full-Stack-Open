import React from "react";

const Persons = (props) => {
    return (
        <div>
            {props.persons.map(person =>
                <div key={person.name}>
                    {person.name} {person.number} <button onClick={() => props.deleteHandler(person.id, person.name)}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default Persons;
