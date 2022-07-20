import { useState } from "react";



const App = () => {
    const [name, setName] = useState("");
    const [born, setBorn] = useState("");
    const [height, setHeight] = useState("");

    return (
        <div>
            <form>
                Name: <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                <br />
                Birthdate: <input type="date" value={born} onChange={(event) => setBorn(event.target.value)} />
                <br />
                Height: <input type="number" value={height} onChange={(event) => setHeight(event.target.value)} />
            </form>
            <div>
                {name} {born} {height}
            </div>
        </div>
    );
};

export default App;
