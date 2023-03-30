
import { SkyMass } from '@skymass/skymass';
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from './localStorage.mjs';

const sm = new SkyMass({ key: "6d9bfa7c20e0ef48a1d6d29c83396c50bcb53e85" });

let id = 1;
const localStorageKey = "@skymass/notes";
// const NOTES = [
//   { id: id++, note: "Buy milk", priority: "low", },
//   { id: id++, note: "Set up webserver", priority: "med" },
//   { id: id++, note: "Build SkyMass app", priority: "high" },
// ];

let NOTES = getLocalStorage() || [];

function addNote({ note, priority }) {
  NOTES.push({ id: id++, note, priority });
  setLocalStorage(localStorageKey);
}

// 👉 add function to update todo.done given it's id
function updateNote(id, note, priority) {
  const index = NOTES.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    NOTES[index] = { ...NOTES[index], note, priority };
    setLocalStorage(NOTES);
  };
}

async function updateNoteModal(ui, note) {
  ui.md`### Update Note`;
  const noteTextArea = ui.textarea("note", {
    placeholder: "New note...",
    required: true,
    defaultVal: note.note,
  });
  const priority = ui.radioGroup("priority", {
    options: ["low", "medium", "high"],
    label: "Priority",
    defaultVal: note.priority,
  });
  const updateNoteButton = ui.button("update", { label: "Update Note" });

  if (noteTextArea.isReady && updateNoteButton.didClick) {
    updateNote(note.id, noteTextArea.val, priority.val);
    // close the modal
    ui.close();
  }
}

// 👉 function to remove todo given it's id
function deleteTodo(id) {
  const index = NOTES.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    NOTES.splice(index, 1);
    setLocalStorage(NOTES);
  };
}
sm.page("/notes", async (ui) => {
  ui.md`### ✅ My Note List!`;

  const note = ui.textarea("note", {
    placeholder: "New note...",
    required: true,
  });
  const priority = ui.radioGroup("priority", {
    options: ["low", "medium", "high"],
    label: "Priority",
    defaultVal: "medium",
  });
  const addNoteButton = ui.button("add", { label: "Add Note" });

  if (note.isReady && addNoteButton.didClick) {
    addNote({
      note: note.val,
      priority: priority.val,
    });
    // clear out the note input
    note.setVal("");
  }

  const noteList = ui.table("Notes", NOTES);
  const [selectedTodo] = noteList.selection;

  const edit = ui.button("edit", { label: "Edit Note" });
  if (noteList.selection.length && edit.didClick) {
    ui.modal("modal", (ui) => updateNoteModal(ui, selectedTodo));
  }
  
  const deleteButton = ui.button("del", { label: "Delete Note" });
  if (selectedTodo && deleteButton.didClick) {
    deleteTodo(selectedTodo.id); // 👈 delete todo
  }

  const deleteAllButton = ui.button("delete_all", { label: "Delete All Notes" });
  if(deleteAllButton.didClick) {
    NOTES = [];
    deleteLocalStorage(localStorageKey);
  }
});