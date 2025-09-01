import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Users,
  UserCheck,
  Clock,
  MapPin,
  Route,
  Calendar,
} from "lucide-react";
import customFetch from "../../utils/customFetch";
import MarketingForm from "../../compontents/Marketing/MarketingForm";
import LeadsModal from "../../compontents/Marketing/LeadsModal";
import ClientsModal from "../../compontents/Marketing/ClientModal";

const MarketingDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openLeads, setOpenLeads] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode, setFilterMode] = useState("today");
  const logsPerPage = 3;

  useEffect(() => {
    const fetchOwnData = async () => {
      try {
        const res = await customFetch.get("/auth/login/user");
        setUser(res.data.user.userId);
        console.log(res.data.user.userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwnData();
  }, []);
  const fetchLogs = async () => {
    try {
      const res = await customFetch.get("/marketing");
      console.log(res.data);

      const filteredLogs = res.data.filter((log) => log.User?._id === user);

      setLogs(filteredLogs);
      console.log(filteredLogs);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filtering logic
  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
  const filteredLogs = logs
    .filter((log) => {
      // apply Today filter
      if (filterMode === "today") {
        return new Date(log.date).toISOString().split("T")[0] === today;
      }
      return true;
    })
    .filter((log) => {
      const query = search.toLowerCase();
      return (
        log.names?.toLowerCase().includes(query) ||
        log.siteDetails?.toLowerCase().includes(query) ||
        log.meetings?.toLowerCase().includes(query) ||
        log.date?.toString().toLowerCase().includes(query)
      );
    });

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const handleEdit = (log) => {
    setEditData(log);
    setOpenForm(true);
  };

  const handleLeads = (log) => {
    setSelectedLog(log);
    setOpenLeads(true);
  };

  const handleClients = (log) => {
    setSelectedLog(log);
    setOpenClients(true);
  };

  // Helper for 12-hour format
  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  console.log(logs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Route className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Marketing Logs
              </h1>
              <p className="text-gray-600 text-sm">
                Track your marketing activities and client interactions
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Log
          </button>
        </div>
        {/* Search Input & Toggle */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to first page when searching
            }}
            className="px-4 py-2 border rounded-xl w-1/3 focus:ring focus:ring-indigo-200"
          />

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterMode("today");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                filterMode === "today"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setFilterMode("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                filterMode === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Logs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.length}
                </p>
                <p className="text-gray-600 text-sm">Total Logs</p>
              </div>
            </div>
          </div>

          {/* Total Leads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.reduce((acc, log) => acc + (log.leads?.length || 0), 0)}
                </p>
                <p className="text-gray-600 text-sm">Total Leads</p>
              </div>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.reduce(
                    (acc, log) => acc + (log.clients?.length || 0),
                    0
                  )}
                </p>
                <p className="text-gray-600 text-sm">Total Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentLogs.map((log) => (
            <div
              key={log._id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {log.names || "No Name"}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{log.meetings || "N/A"}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-gray-500 text-xs">In Time</p>
                      <p className="font-medium text-gray-900">
                        {formatTime(log.intime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-gray-500 text-xs">Start KM</p>
                      <p className="font-medium text-gray-900">
                        {log.startKM || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-gray-500 text-xs">End KM</p>
                      <p className="font-medium text-gray-900">
                        {log.endingKM || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Office Out</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(log.officeOutTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Site Reached</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(log.siteReachedTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Site Out</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(log.siteOutTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Office Reached</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(log.officeReachedTime)}
                    </span>
                  </div>
                </div>

                {log.siteDetails && log.siteDetails !== "N/A" && (
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Site Details</p>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {log.siteDetails}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => handleEdit(log)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleLeads(log)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl transition-colors duration-200 text-sm font-medium"
                >
                  <Users className="w-4 h-4" />
                  Leads
                </button>

                <button
                  onClick={() => handleClients(log)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-colors duration-200 text-sm font-medium"
                >
                  <UserCheck className="w-4 h-4" />
                  Clients
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Empty State */}
        {logs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Route className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No marketing logs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your marketing activities by creating your first
              log.
            </p>
            <button
              onClick={() => setOpenForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Your First Log
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {openForm && (
        <MarketingForm
          open={openForm}
          handleClose={() => {
            setOpenForm(false);
            setEditData(null);
            fetchLogs();
          }}
          editData={editData}
        />
      )}

      {openLeads && (
        <LeadsModal
          open={openLeads}
          handleClose={() => {
            setOpenLeads(false);
            fetchLogs();
          }}
          log={selectedLog}
        />
      )}

      {openClients && (
        <ClientsModal
          open={openClients}
          handleClose={() => {
            setOpenClients(false);
            fetchLogs();
          }}
          log={selectedLog}
        />
      )}
    </div>
  );
};

export default MarketingDashboard;
