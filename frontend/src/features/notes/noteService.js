import axios from "axios";

const API_URL = "/notes";

const getNotes = async (token) => {
  const config = {
    Cookie: `access_token${token}`,
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const createNote = async (noteData, token) => {
  const config = {
    Cookie: `access_token:${token}`,
  };

  const response = await axios.post(API_URL + "/create", noteData, config);

  return response.data;
};

const deleteNote = async (id, token) => {
  const config = {
    Cookie: `access_token:${token}`,
  };
  const response = await axios.delete(API_URL + "/delete" + `/${id}`, config);

  return response.data;
};

const noteService = {
  getNotes,
  createNote,
  deleteNote,
};

export default noteService;
