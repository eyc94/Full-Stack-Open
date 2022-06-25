import React from "react";

const Filter = (props) => {
    return (
        <div>
            <div>Filter shown with <input value={props.filterVal} onChange={props.filterHandler} /></div>
        </div>
    );
};

export default Filter;
