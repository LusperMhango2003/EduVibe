import Header from "./RecordingsHeader";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaStickyNote, FaSpinner, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
import { searchRecordings, getAllRecordings, getPendingRecordings, approveRecording, rejectRecording, deleteRecording } from "../services/recordingApi";
import { useAuth } from "../context/AuthContext";
import { hasPermission, isContentCreator, isAdmin } from "../utils/permissions";

const Recordings = () => {
  const { user, logout } = useAuth();
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  
  useEffect(() => {
    fetchRecordings();
  
    if (isAdmin(user?.role)) {
      fetchPendingRecordings();
    }
  }, [user?.role]);

  const fetchRecordings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllRecordings();
      setRecordings(data.data || data);
      setFilteredRecordings(data.data || data);
    } catch (err) {
      console.error("Error fetching recordings:", err);
      setError("Failed to load recordings");
      setRecordings([]);
      setFilteredRecordings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRecordings = async () => {
    try {
      const data = await getPendingRecordings();
      setPendingApprovals(data.data || data);
    } catch (err) {
      console.error("Error fetching pending recordings:", err);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredRecordings(recordings);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      const data = await searchRecordings(query);
      setFilteredRecordings(data.data || data);
    } catch (err) {
      console.error("Error searching recordings:", err);
      setError("Failed to search recordings");
      setFilteredRecordings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (recordingId) => {
    try {
      await approveRecording(recordingId);
      setPendingApprovals(pendingApprovals.filter(r => r.id !== recordingId && r._id !== recordingId));
      setError(null);
    } catch (err) {
      setError("Failed to approve recording");
      console.error(err);
    }
  };

  const handleReject = async (recordingId) => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectRecording(recordingId, rejectReason);
      setPendingApprovals(pendingApprovals.filter(r => r.id !== recordingId && r._id !== recordingId));
      setRejectingId(null);
      setRejectReason('');
      setError(null);
    } catch (err) {
      setError("Failed to reject recording");
      console.error(err);
    }
  };

  const handleDelete = async (recordingId) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      try {
        await deleteRecording(recordingId);
        setRecordings(recordings.filter(r => r.id !== recordingId && r._id !== recordingId));
        setFilteredRecordings(filteredRecordings.filter(r => r.id !== recordingId && r._id !== recordingId));
        setError(null);
      } catch (err) {
        setError("Failed to delete recording");
        console.error(err);
      }
    }
  };

  
  const StatusBadge = ({ status }) => {
    const statusColors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const RecordingCard = ({ recording, showActions = true, isPending = false }) => {
    const recordingId = recording.id || recording._id;
    const canEdit = hasPermission(user?.role, 'editOwnContent') && (recording.createdBy === user?.id || user?.id === recording.authorId || isAdmin(user?.role));
    const canDelete = hasPermission(user?.role, 'editOwnContent') && (recording.createdBy === user?.id || user?.id === recording.authorId || isAdmin(user?.role));

    return (
      <div key={recordingId} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
        <div className="relative">
          <div className="flex items-center justify-center w-full h-40 bg-gradient-to-br from-[#0B7077] to-[#FF4B00] rounded mb-3">
            <span className="text-4xl">🎬</span>
          </div>
          {recording.status && <div className="absolute top-2 right-2"><StatusBadge status={recording.status} /></div>}
        </div>

        <h3 className="font-semibold text-[#211C37] truncate">
          {recording.title || recording.name || "Untitled Recording"}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {recording.description || "No description"}
        </p>

        {recording.createdBy && (
          <p className="text-xs text-gray-500 mb-2">
            By: {recording.creatorName || recording.instructorName || "Unknown"}
          </p>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>{recording.duration || "N/A"}</span>
          <span>
            {recording.date ? new Date(recording.date).toLocaleDateString() : "N/A"}
          </span>
        </div>

        
        {showActions && (
          <div className="flex gap-2">
            {!isPending && hasPermission(user?.role, 'viewRecordings') && (
              <button className="flex-1 bg-[#FF4B00] text-white py-2 rounded-lg hover:bg-[#E63E00] transition text-sm font-medium">
                Play
              </button>
            )}
            {isPending && isAdmin(user?.role) && (
              <>
                <button
                  onClick={() => handleApprove(recordingId)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium flex items-center justify-center gap-1"
                >
                  <FaCheck size={12} /> Approve
                </button>
                <button
                  onClick={() => setRejectingId(rejectingId === recordingId ? null : recordingId)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center justify-center gap-1"
                >
                  <FaTimes size={12} /> Reject
                </button>
              </>
            )}
            {!isPending && canEdit && (
              <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium flex items-center justify-center gap-1">
                <FaEdit size={12} /> Edit
              </button>
            )}
            {!isPending && canDelete && (
              <button
                onClick={() => handleDelete(recordingId)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center justify-center gap-1"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        )}

      
        {isPending && rejectingId === recordingId && (
          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <input
              type="text"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
            />
            <button
              onClick={() => handleReject(recordingId)}
              className="w-full bg-red-500 text-white py-1 rounded text-sm font-medium hover:bg-red-600 transition"
            >
              Confirm Rejection
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
  
      <Header onSearch={handleSearch} />

      
      <div className="flex mt-8 container">
        
        <aside className="w-48 flex flex-col space-y-2 border-r border-gray-200 pr-4">
          <Link
            to="/dashboard"
            className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
          <Link
            to="/notes"
            className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
          >
            <FaStickyNote className="mr-2" />
            Notes
          </Link>

          
          {hasPermission(user?.role, 'uploadContent') && (
            <>
              <Link
                to="/upload-recording"
                className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
              >
                <FaUpload className="mr-2" />
                Upload Recording
              </Link>
            </>
          )}

          {isAdmin(user?.role) && pendingApprovals.length > 0 && (
            <button
              onClick={() => setShowPending(!showPending)}
              className="flex items-center px-6 py-2 rounded-lg text-gray-700 hover:bg-[#FF4B00] hover:text-white transition"
            >
              <FaCheck className="mr-2" />
              Approvals ({pendingApprovals.length})
            </button>
          )}
        </aside>

        
        <main className="ml-8 space-y-6 flex-1">
          <div>
            <h1 className="font-inter font-bold text-2xl text-[#211C37]">
              {showPending ? 'Pending Approvals' : 'Class Recordings'}
            </h1>
            <h2 className="font-inter font-regular text-lg text-[#85878D]">
              {showPending ? 'Review submissions for approval' : 'Access and Review Class Sessions'}
            </h2>
          </div>

          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-[#FF4B00] mr-2 text-xl" />
              <span className="text-gray-600">Loading recordings...</span>
            </div>
          )}
          
          {!isLoading && hasSearched && !showPending && (
            <div className="text-sm text-gray-600">
              Found {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {!isLoading && (
            <div>
              {showPending ? (
                pendingApprovals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingApprovals.map((recording) => (
                      <RecordingCard key={recording.id || recording._id} recording={recording} showActions={true} isPending={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No pending approvals</div>
                )
              ) : (
                filteredRecordings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecordings.map((recording) => (
                      <RecordingCard key={recording.id || recording._id} recording={recording} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">{hasSearched ? "No recordings found matching your search." : "No recordings available."}</div>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recordings;
