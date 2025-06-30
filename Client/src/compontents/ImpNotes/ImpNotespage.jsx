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
      console.log(res);

      setNotes(res.data ?? []); //
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Important Notes</h2>

      {/* Form */}
      <form
        className="bg-white p-4 rounded shadow mb-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <label className="block text-sm font-medium">Agenda</label>
          <input
            type="text"
            name="agenda"
            value={form.agenda}
            onChange={(e) => setForm({ ...form, agenda: e.target.value })}
            className="border w-full p-2 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border w-full p-2 rounded"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid gap-4">
        {Array.isArray(notes) && notes.length === 0 ? (
          <p className="text-gray-500">No notes found.</p>
        ) : (
          Array.isArray(notes) &&
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-4 rounded shadow relative"
            >
              <h3 className="text-lg font-bold">{note.agenda}</h3>
              <p className="text-gray-700">{note.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Created:{" "}
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="text-yellow-600 hover:underline"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(note._id)}
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
