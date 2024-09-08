import {getDB, insertDb, saveDb} from "./db.js";

class Note {
    constructor(note, tags) {
        this.content = note;
        this.tags = tags;
        this.id = Date.now();
    }
}

export const newNote = async (note, tags) => {
    const newNote = new Note(note, tags);
    await insertDb(newNote);
    return newNote;
}

export const allNotes = async () => {
    const {notes} = await getDB();
    return notes;
}

export const findNotes = async filter => {
    const {notes} = await getDB();
    filter = filter.toLowerCase()
    return notes.filter(note => note.content.toLowerCase().includes(filter));
}

export const removeNote = async id => {
    let {notes} = await getDB();
    const note = notes.find(note => note.id === id);
    if (note) {
        const newNotes = notes.filter(note => note.id !== id);
        await saveDb({notes: newNotes});
        return note;
    }
}

export const cleanNotes = () => saveDb({notes: []});
