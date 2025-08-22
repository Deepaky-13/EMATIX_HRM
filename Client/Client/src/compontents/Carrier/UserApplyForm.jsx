import React, { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

const UserApplyForm = ({ jobId, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, description } = form;
    if (!name || !email || !phone || !description) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      await customFetch.post("/userApply", {
        ...form,
        job: jobId,
      });

      toast.success("Application submitted successfully!");
      onClose?.();
    } catch (error) {
      toast.error("Submission failed.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700 text-center">
        Apply for Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}:</label>
            <input
              name={field}
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              value={form[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            placeholder="Why should we hire you?"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserApplyForm;
