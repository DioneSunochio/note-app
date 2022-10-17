const Note = require("../models/noteModel");

const getAllNote = async (req, res, next) => {
  try {
    const notesByUserID = await Note.find({ userId: req.user });

    if (notesByUserID) {
      res.status(200).json(notesByUserID);
    } else {
      res.status(400);
      throw new Error("Not Found.");
    }
  } catch (error) {
    next(error);
  }
};

const noteCreate = async (req, res, next) => {
  const { title, text } = req.body;
  try {
    if (!title || !text) {
      res.status(400);
      throw new Error("Please add all fields.");
    }

    const newNote = await Note.create({ userId: req.user, title, text });

    if (newNote) {
      res.status(200).json(newNote);
    } else {
      res.status(400);
      throw new Error("Invalid data.");
    }
  } catch (error) {
    next(error);
  }
};

const noteUpdate = async (req, res, next) => {
  const { id, title, text } = req.body;
  try {
    if (!id) {
      res.status(400);
      throw new Error("Please add note id.");
    }

    await Note.findById(id).catch(() => {
      res.status(400);
      throw new Error("Note not exists.");
    });

    const note = await Note.findByIdAndUpdate(
      id,
      { title, text },
      { new: true }
    );

    if (note) {
      res.status(200).json(note);
    } else {
      res.status(400);
      throw new Error("Invalid data.");
    }
  } catch (error) {
    next(error);
  }
};

const noteDelete = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) {
      res.status(400);
      throw new Error("Please add note id.");
    }

    await Note.findById(id).catch(() => {
      res.status(400);
      throw new Error("Note not exists.");
    });

    const note = await Note.findByIdAndDelete(id);

    res.status(200).json({ id, title: note.title });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllNote, noteCreate, noteUpdate, noteDelete };
