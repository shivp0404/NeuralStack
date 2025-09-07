import { useState, useEffect } from "react";
import { Pencil, Trash2, Check, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// 🔹 User Info Component
function UserInfo() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = location.state?.accessToken;

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          setMessage(result.message || "Unauthorized");
        }
      } catch (err) {
        setMessage("Error fetching user data");
      }
    };

    fetchData();
  }, [accessToken, navigate]);

  const logout = async()=>{
  try {
          const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
        const result = await res.json();
         console.log(result)
        if (res.ok) {
          navigate('/')
        } else {
          setMessage(result.message || "Unauthorized");
        }
      } catch (err) {
        setMessage("Error doing logout");
      }
  }

  if (!data)
    return <div className="bg-white rounded-2xl shadow p-6">Loading...</div>;

  return (
    <div className="rounded-2xl bg-gray-800/90  shadow p-6 mb-4">
      <h2 className="text-xl text-indigo-700 font-bold mb-4">User Profile</h2>
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-lg  text-gray-100 font-semibold">
            {data.username}
          </p>
        </div>
        <button onClick={logout}   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">logout</button>
      </div>
    </div>
  );
}

// 🔹 Stats Component
function Stats() {
  const [stats, setStats] = useState(null);
  const location = useLocation();
  const accessToken = location.state?.accessToken;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    if (accessToken) fetchStats();
  }, [accessToken]);

  if (!stats)
    return <div className="bg-white rounded-2xl shadow p-6">Loading...</div>;

  return (
    <div className="bg-gray-800/90 rounded-2xl shadow p-6">
      <h2 className="text-xl text-indigo-700 font-bold mb-4">Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.totalSnippets}</p>
          <p className="text-gray-100">Total Snippets</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.totalRevisions}</p>
          <p className="text-gray-100">Total Revisions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.aiUsed}</p>
          <p className="text-gray-100">Total AI Used</p>
        </div>
      </div>
    </div>
  );
}

// 🔹 Heatmap Component
// import { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Heatmap() {
  const [heatmap, setHeatmap] = useState([]);
  const location = useLocation();
  const accessToken = location.state?.accessToken;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/revision/history", {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setHeatmap(data); // [{date: '2025-09-01', count: 2}, ...]
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    if (accessToken) fetchHistory();
  }, [accessToken]);

  return (
    <div className="bg-gray-800/90  rounded-2xl shadow p-6">
      <h2 className="text-xl text-indigo-700 font-bold mb-4">
        Activity Heatmap
      </h2>
      {heatmap.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-500">
          No activity yet
        </div>
      ) : (
        <CalendarHeatmap
          startDate={new Date(new Date().setMonth(new Date().getMonth() - 14))}
          endDate={new Date()}
          values={heatmap}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.type === "created") return "color-green";
            if (value.type === "reviewed") return "color-blue";
            if (value.type === "snoozed") return "color-orange";
            return "color-filled";
          }}
          tooltipDataAttrs={(value) =>
            value.date
              ? { "data-tip": `${value.date}: ${value.type}` }
              : { "data-tip": "No activity" }
          }
        />
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-500 inline-block rounded"></span>{" "}
          Created
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-blue-500 inline-block rounded"></span>{" "}
          Reviewed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-orange-500 inline-block rounded"></span>{" "}
          Snoozed
        </span>
      </div>
    </div>
  );
}

// 🔹 Recent Snippets Component
function RecentSnippets() {
  const [snippets, setSnippets] = useState([]);
  const location = useLocation();
  const accessToken = location.state?.accessToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/snippets/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSnippets(data);
        }
      } catch (err) {
        console.error("Failed to fetch snippets:", err);
      }
    };
    if (accessToken) fetchSnippets();
  }, [accessToken]);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`, { state: { accessToken } });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/snippets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
 <div className=" bg-gray-800/90 min-h- rounded-2xl shadow p-6">
  <h2 className="text-xl  text-indigo-700 font-bold mb-4">Recent Snippets</h2>
   { snippets.length === 0 ? (
        <p className="text-gray-500">🎉No Snippets to show</p>
      ) :(
  <ul
    className="space-y-1 max-h-30 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
    style={{ scrollbarWidth: "none" }}
  >
    {snippets.map((s) => (
      <li
        key={s._id}
        className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 hover:text-black"
      >
        <span className="text-left flex-1">{s.title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(s._id)}
            className="p-1 text-blue-500 hover:text-blue-700"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(s._id)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </li>
    ))}
  </ul>)}
  <style>
    {`
      ul::-webkit-scrollbar { display: none; }
    `}
  </style>
</div>

  );
}

// 🔹 Revision Queue Component

function RevisionQueue() {
  const [queue, setQueue] = useState([]);
  const location = useLocation();
  const accessToken = location.state?.accessToken;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/revision/queue", {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setQueue(data);
        }
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      }
    };
    if (accessToken) fetchQueue();
  }, [accessToken]);

  const handleMarkReviewed = async (id) => {
    try {
      await fetch("http://localhost:5000/api/revision/mark-reviewed", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ snippetId: id }),
      });
      setQueue(queue.filter((q) => q._id !== id)); // remove from UI
    } catch (err) {
      console.error("Mark reviewed failed:", err);
    }
  };

  const handleSnooze = async (id, days) => {
    try {
      await fetch(`http://localhost:5000/api/revision/snooze/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ days }),
      });
      setQueue(queue.filter((q) => q._id !== id)); // ✅ remove from current queue
    } catch (err) {
      console.error("Snooze failed:", err);
    }
  };

  return (
        <div className="rounded-2xl mt-5 shadow p-6 bg-gray-800/90">
      <h2 className="text-xl text-indigo-700 font-bold mb-4">Revision Queue</h2>
      {queue.length === 0 ? (
        <p className="text-gray-500">🎉 Nothing due for revision right now!</p>
      ) : (
        <ul className="space-y-2 max-h-75 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {queue.map((s) => (
            <li
              key={s._id}
              className="flex justify-between hover:text-black items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <span className="flex-1 text-left">{s.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkReviewed(s._id)}
                  className="p-1 text-green-500 hover:text-green-700"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleSnooze(s._id, 2)} // default 2 days
                  className="p-1 text-yellow-500 hover:text-yellow-700"
                >
                  <Clock size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// 🔹 Main Dashboard
export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = location.state?.accessToken;

  const getallSnippet = () => {
    navigate("/allsnippets", { state: { accessToken } });
  };
  const getalljournals = () => {
    navigate("/journals", { state: { accessToken } });
  };

  const handleCreateSnippet = () => {
    navigate("/create", { state: { accessToken } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-1 lg:col-span-1">
        <UserInfo />

        <div className="flex ml-4 space-x-2">
          <button
            onClick={getalljournals}
            className="px-4 py-2 bg-blue-600  text-white rounded-lg hover:bg-blue-700"
          >
            Journals
          </button>
          <button
            onClick={handleCreateSnippet}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Snippet
          </button>
          <button
            onClick={getallSnippet}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            All Snippet
          </button>
        </div>

         <div className="md:col-span-2 lg:col-span-3">
        
        <RevisionQueue />
      </div>

      </div>
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
        <Stats />
        <Heatmap />
        <RecentSnippets />
      </div>
     
    </div>
  );
}
