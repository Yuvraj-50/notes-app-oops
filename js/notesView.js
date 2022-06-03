export default class NotesView {
  constructor(
    root,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteRemove } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteRemove = onNoteRemove;

    this.root.innerHTML = `
        <div class="notes__sidebar">
            <button type=" button" class="notes__add">Add note </button>
            <div class="notes__list"> </div>
        </div>
        <div class="notes__preview">
            <input class="notes__title" placeholder="New Note..." type="text">
            <textarea class="notes__body">Take note...</textarea>
        </div>
    `;

    // selecting the html elements;

    const addNoteBtn = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    addNoteBtn.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) =>
      inputField.addEventListener("blur", () => {
        const updateTitle = inpTitle.value.trim();
        const updateBody = inpBody.value.trim();

        this.onNoteEdit(updateTitle, updateBody);
      })
    );

    this.updateNotesPreviewVisiblity(false);
  }

  _createListItemHtml(id, title, body, updated) {
    const max_body_length = 60;

    return `
      <div class = "notes__list-item" data-note-id = "${id}"> 
        <div class = "notes__small-title">  ${title}  </div>
        <div class = "notes__small-body">
            ${body.substring(0, max_body_length)}
            ${body.length > max_body_length ? "..." : ""}
        </div>
        <div class = "notes__small-updated"> 
            ${updated.toLocaleString(undefined, {
              dateStyle: "full",
              timeStyle: "short",
            })}
        </div>
      </div>
      `;
  }

  updateNotesList(notes) {
    const noteListContainer = this.root.querySelector(".notes__list");
    // Empty list
    noteListContainer.innerHTML = "";

    for (const note of notes) {
      const htlm = this._createListItemHtml(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      noteListContainer.insertAdjacentHTML("beforeend", htlm);

      // adding eventlistner  update / delete note;
      noteListContainer
        .querySelectorAll(".notes__list-item")
        .forEach((noteListItem) => {
          noteListItem.addEventListener("click", () => {
            this.onNoteSelect(noteListItem.dataset.noteId);
          });

          noteListItem.addEventListener("dblclick", () => {
            const doDelete = confirm(
              "Are you sure you want to delete the note"
            );
            if (doDelete) {
              this.onNoteRemove(noteListItem.dataset.noteId);
            }
          });
        });
    }
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.add("notes__list-item--selected");
  }

  updateNotesPreviewVisiblity(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
