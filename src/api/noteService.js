import api from "./api";

export const getNotes = () => api.get("/notes");
export const getNoteById = (id) => api.get(`/notes/${id}`);
export const createNote = (note) => api.post("/notes", note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
