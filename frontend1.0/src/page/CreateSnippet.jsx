import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateSnippet() {
  const [form, setForm] = useState({
    title: "",
    code: "",
    language: "javascript",
    tags: "",
    category: "General",
    source: "",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = location.state?.accessToken;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...form,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t),
  };

  try {
    const res = await fetch("http://localhost:5000/api/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ secure
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Immediately schedule revision for this snippet
      try {
        await fetch("http://localhost:5000/api/revision/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ snippetId: data._id }), // backend expects snippetId
        });
      } catch (scheduleErr) {
        console.error("Failed to schedule revision:", scheduleErr);
      }

      setMessage("Snippet created & revision scheduled successfully!");
      navigate("/dashboard", { state: { accessToken } });
    } else {
      setMessage(data.message || "Failed to create snippet");
    }
  } catch (err) {
    setMessage("Error connecting to server");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 p-6">
      <div className="w-full max-w-2xl bg-gray-800/90 p-6  rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Create New Snippet</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Required fields */}
          <div>
            <label className="block mb-1 text-white font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Code *</label>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Optional fields */}
          <div>
            <label className="block mb-1 text-white font-medium">Language</label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. react, hooks, auth"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="General"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Source</label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Optional link or reference"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Optional notes..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard", { state: { accessToken } })}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Snippet
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
