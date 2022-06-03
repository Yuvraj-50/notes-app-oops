import NotesView from "./notesView.js";
import NotesApi from "./notesApi.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.ActiveNotes = null;
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesApi.getNotes();

    this._setNotes(notes);

    if (notes.length > 1) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNotesList(notes);
    this.view.updateNotesPreviewVisiblity(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNotes = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNotes);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "New Note",
          body: "Take Note",
        };

        NotesApi.addNotes(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, body) => {
        NotesApi.addNotes({
          id: this.activeNote.id,
          title,
          body,
        });

        this._refreshNotes();
      },
      onNoteRemove: (noteId) => {
        NotesApi.removeNotes(noteId);
        this._refreshNotes();
      },
    };
  }
}
