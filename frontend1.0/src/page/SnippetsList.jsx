import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SnippetsList() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [showDetails, setShowDetails] = useState(true); // ✅ toggle for details panel

  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = location.state?.accessToken;

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/snippets", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch snippets");
        }

        const data = await res.json();
        setSnippets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [accessToken]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("✅ Code copied to clipboard!");
    } catch {
      alert("❌ Failed to copy code");
    }
  };

const handleExplain = async (snippet) => {
  setShowDetails(true); // ✅ ensure details bar opens
  setIsExplaining(true);
  setAiExplanation("");

  try {
    const res = await fetch(`http://localhost:5000/api/ai/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ code: snippet.code, language: snippet.language }),
    });

    if (!res.ok) throw new Error("Failed to fetch explanation");

    const data = await res.json();
    console.log(data)
    setAiExplanation(data.explanation || "No explanation available.");
  } catch (err) {
    setAiExplanation("❌ Error: " + err.message);
  } finally {
    setIsExplaining(false);
  }
};


  if (loading) return <p className="text-center mt-10">Loading snippets...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 p-6">
      <div className="max-w-5xl mx-auto  shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Snippets</h2>
          <button
            onClick={() => navigate("/create", { state: { accessToken } })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Snippet
          </button>
        </div>

        {snippets.length === 0 ? (
          <p className="text-gray-600 text-center">No snippets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Language</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Tags</th>
                  <th className="px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {snippets.map((snippet) => (
                  <tr key={snippet._id} className="border-t hover:text-black hover:bg-gray-50">
                    <td
                      className="px-4 py-2 text-blue-600 cursor-pointer"
                      onClick={() => setActiveSnippet(snippet)}
                    >
                      {snippet.title}
                    </td>
                    <td className="px-4 py-2">{snippet.language}</td>
                    <td className="px-4 py-2">{snippet.category}</td>
                    <td className="px-4 py-2">
                      {snippet.tags?.length > 0 ? snippet.tags.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {activeSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-3">
            <h2 className="text-lg font-bold">{activeSnippet.title}</h2>
            <div className="space-x-3">
              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                {showDetails ? "➡ Hide Details" : "⬅ Show Details"}
              </button>
              <button
                onClick={() => {
                  setActiveSnippet(null);
                  setAiExplanation("");
                }}
                className="text-gray-300 hover:text-white text-xl"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Left/Right layout with collapsible right */}
          <div className="flex flex-1 overflow-hidden">
            {/* Code Viewer */}
            <div
              className={`bg-gray-800 p-4 overflow-auto transition-all duration-300 ${
                showDetails ? "w-2/3" : "w-full"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">
                  {activeSnippet.language}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleCopy(activeSnippet.code)}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => handleExplain(activeSnippet)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    🤖 Explain
                  </button>
                </div>
              </div>

              <SyntaxHighlighter
                language={activeSnippet.language || "javascript"}
                style={oneDark}
                wrapLongLines
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  padding: "1rem",
                  minHeight: "75vh",
                }}
              >
                {activeSnippet.code}
              </SyntaxHighlighter>
            </div>

            {/* Right: Details + AI (collapsible) */}
            {showDetails && (
              <div className="bg-transparent-white p-6 overflow-auto  w-1/3 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4">Details</h3>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {activeSnippet.category}
                </p>
                <p>
                  <span className="font-semibold">Tags:</span>{" "}
                  {activeSnippet.tags?.join(", ") || "-"}
                </p>
                <p>
                  <span className="font-semibold">Source:</span>{" "}
                  {activeSnippet.source || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Notes:</span>{" "}
                  {activeSnippet.notes || "N/A"}
                </p>

                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">AI Explanation</h3>
                  {isExplaining ? (
                    <p className="text-blue-600">⏳ Generating explanation...</p>
                  ) : aiExplanation ? (
                    <p className="text-white whitespace-pre-wrap">
                      {aiExplanation}
                    </p>
                  ) : (
                    <p className="text-white">Click "Explain" to generate.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
