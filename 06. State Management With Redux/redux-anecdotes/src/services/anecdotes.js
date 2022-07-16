import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createNew = async (content) => {
    const generateId = () => Number((Math.random() * 1000000).toFixed(0));
    const object = { content, id: generateId(), votes: 0 };
    const response = await axios.post(baseUrl, object);
    return response.data;
};

const getById = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
};

const vote = async (id) => {
    const anecdote = await getById(id);
    const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const response = await axios.put(`${baseUrl}/${id}`, votedAnecdote);
    return response.data;
};

export default { getAll, createNew, vote };
