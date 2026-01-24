import axios from 'axios';

const PORT = process.env.PORT;

export const api = axios.create({
  baseURL: `http://localhost:${PORT}`,
});