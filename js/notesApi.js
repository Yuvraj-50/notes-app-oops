export default class NotesApi {
  //

  static getNotes() {
    const notes = JSON.parse(localStorage.getItem("notesApp-notes") || "[]");

    return notes.sort((a, b) =>
      new Date(a.updated) > new Date(b.updated) ? -1 : 1
    );
  }

  static addNotes(note) {
    const notes = NotesApi.getNotes();

    const existing = notes.find((n) => n.id == note.id);

    // eidt / update note
    if (existing) {
      existing.title = note.title;
      existing.body = note.body;
      existing.updated = new Date().toISOString();
    } else {
      // generates random id and set it on note
      note.id = Math.floor(Math.random() * 10000000);
      // generates date and set it on note
      note.updated = new Date().toISOString();

      notes.push(note);
    }

    // update local storage
    localStorage.setItem("notesApp-notes", JSON.stringify(notes));
  }

  static removeNotes(id) {
    const notes = NotesApi.getNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notesApp-notes", JSON.stringify(newNotes));
  }
}
