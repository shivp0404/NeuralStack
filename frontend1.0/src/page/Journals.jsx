import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Journals() {
  const [form, setForm] = useState({
    date: "",
    learned: "",
    built: "",
    confused: "",
  });
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);

  const location = useLocation();
  const accessToken = location.state?.accessToken;

  // Fetch all journals
  const fetchJournals = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/journal/all", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setJournals(data);
    } catch (err) {
      setMessage("Failed to fetch journals");
    } finally {
      setLoading(false);
    }
  };

  // Fetch journal by date
  const fetchByDate = async () => {
    if (!dateFilter) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/journal?date=${dateFilter}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      setJournals(data ? [data] : []);
    } catch (err) {
      setMessage("Failed to fetch journal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [accessToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ Journal added successfully!");
        setForm({ date: "", learned: "", built: "", confused: "" });
        fetchJournals(); // refresh list
      } else {
        const data = await res.json();
        setMessage(data.message || "❌ Failed to add journal");
      }
    } catch {
      setMessage("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Journal Form */}
        <div className="col-span-1">
          <div className="bg-gray-800/90 p-6 rounded-2xl shadow-lg sticky top-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
              ✍️ Add Journal
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring focus:ring-indigo-500"
              />
              <textarea
                name="learned"
                value={form.learned}
                onChange={handleChange}
                placeholder="What did you learn today?"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring focus:ring-indigo-500"
              />
              <textarea
                name="built"
                value={form.built}
                onChange={handleChange}
                placeholder="What did you build today?"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring focus:ring-indigo-500"
              />
              <textarea
                name="confused"
                value={form.confused}
                onChange={handleChange}
                placeholder="What confused you today?"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring focus:ring-indigo-500"
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Save Journal
              </button>
            </form>
            {message && (
              <p className="text-center mt-3 text-sm text-gray-400">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Journals List */}
        <div className="col-span-2">
          <div className="bg-gray-800/90 p-6 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
              <h2 className="text-2xl font-bold text-indigo-400">
                📖 My Journals
              </h2>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-900 text-gray-200"
                />
                <button
                  onClick={fetchByDate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Get Journal
                </button>
                <button
                  onClick={fetchJournals}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Show All
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-center">⏳ Loading...</p>
            ) : journals.length === 0 ? (
              <p className="text-center text-gray-400">No journals yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map((j) => (
                  <div
                    key={j._id}
                    onClick={() => setSelectedJournal(j)}
                    className="border border-gray-700 rounded-xl p-5 hover:shadow-xl hover:border-indigo-500 transition cursor-pointer bg-gray-900/70"
                  >
                    <h3 className="font-semibold text-lg text-indigo-400">
                      {j.date}
                    </h3>
                    <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                      {j.learned}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journal Modal */}
      {selectedJournal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative border border-gray-700">
            <button
              onClick={() => setSelectedJournal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-6 text-indigo-400">
              {selectedJournal.date}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-300">Learned</h4>
                <p className="text-gray-400 mt-1">
                  {selectedJournal.learned || "-"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300">Built</h4>
                <p className="text-gray-400 mt-1">
                  {selectedJournal.built || "-"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300">Confused</h4>
                <p className="text-gray-400 mt-1">
                  {selectedJournal.confused || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
