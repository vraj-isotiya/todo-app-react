import axios from "axios";

const API = axios.create({
  baseURL: "http://65.2.168.162:5000/api",
});

export const getTodos = () => API.get("/todos");
export const createTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const healthCheck = () => API.get("/health");
