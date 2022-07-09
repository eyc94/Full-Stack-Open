const NoteForm = ({ onSubmit, handleChange, value }) => {
    return (
        <div>
            <h2>Create A New Note</h2>

            <form onSubmit={onSubmit}>
                <input
                    value={value}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default NoteForm;
