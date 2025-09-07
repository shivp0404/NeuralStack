import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function EditSnippet() {
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
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ snippet id from route
  const accessToken = location.state?.accessToken;

  // Fetch snippet details
  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/snippets/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setForm({
            ...data,
            tags: data.tags?.join(", ") || "", // turn array into string
          });
        } else {
          setMessage(data.message || "Failed to load snippet");
        }
      } catch (err) {
        setMessage("Error fetching snippet");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchSnippet();
  }, [id, accessToken]);

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
      const res = await fetch(`http://localhost:5000/api/snippets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Snippet updated successfully!");
        navigate("/dashboard", { state: { accessToken } });
      } else {
        setMessage(data.message || "Failed to update snippet");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading snippet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Snippet</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Code *</label>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Language</label>
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

          {/* Tags */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. react, hooks, auth"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Source</label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Optional link"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Notes</label>
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
              Update Snippet
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
