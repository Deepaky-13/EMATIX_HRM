import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

const ImpNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ agenda: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await customFetch.get("/note"); // adjust URL to your backend
      setNotes(res.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customFetch.patch(`/note/${editingId}`, form);
        toast.success("Note updated");
      } else {
        await customFetch.post("/note", form);
        toast.success("Note created");
      }
      setForm({ agenda: "", description: "" });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (note) => {
    setForm({ agenda: note.agenda, description: note.description });
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      await customFetch.delete(`/note/${id}`);
      toast.success("Note deleted");
      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
        Important Notes
      </h2>

      {/* Form */}
      <form
        className="bg-white p-4 rounded shadow mb-8 max-w-xl mx-auto md:mx-0"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Agenda</label>
          <input
            type="text"
            name="agenda"
            value={form.agenda}
            onChange={(e) => setForm({ ...form, agenda: e.target.value })}
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors duration-200 w-full md:w-auto"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(notes) && notes.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No notes found.
          </p>
        ) : (
          Array.isArray(notes) &&
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-5 rounded shadow relative flex flex-col"
            >
              <h3 className="text-lg font-bold mb-2 truncate">{note.agenda}</h3>
              <p className="text-gray-700 flex-grow whitespace-pre-wrap">
                {note.description}
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Created:{" "}
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <div className="absolute right-2 bottom-0 flex gap-3 text-sm">
                <button
                  className="text-yellow-600 hover:underline focus:outline-none focus:ring-1 focus:ring-yellow-600 rounded"
                  onClick={() => handleEdit(note)}
                  aria-label={`Edit note ${note.agenda}`}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline focus:outline-none focus:ring-1 focus:ring-red-600 rounded"
                  onClick={() => handleDelete(note._id)}
                  aria-label={`Delete note ${note.agenda}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImpNotesPage;
