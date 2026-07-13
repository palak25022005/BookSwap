import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuthUser } from "../hooks/useAuthUser";
import { socket } from "../socket";

export default function Notifications() {
  const { user, authLoading } = useAuthUser();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load requests from database
  const loadRequests = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/swaps/requests/${user.uid}`
      );

      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (authLoading || !user) return;

    loadRequests();
  }, [authLoading, user, loadRequests]);

  // Register socket once user logs in
  useEffect(() => {
    if (authLoading || !user) return;

    socket.emit("register", user.uid);
  }, [authLoading, user]);

  // Listen for realtime notifications
  useEffect(() => {
  const handleNewRequest = async (data) => {
    console.log("New Request:", data);

    await loadRequests();
  };

  socket.on("new_swap_request", handleNewRequest);

  return () => {
    socket.off("new_swap_request", handleNewRequest);
  };
}, [loadRequests]);

  const acceptRequest = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/swaps/request/${id}/accept`
      );

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Unable to accept request");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/swaps/request/${id}/reject`
      );

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Unable to reject request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        Swap Notifications
      </h1>

      {requests.length === 0 ? (
        <div className="text-gray-400 text-xl">
          No swap requests.
        </div>
      ) : (
        <div className="space-y-8">

          {requests.map((request) => (

            <div
              key={request.id}
              className="bg-slate-900 rounded-2xl p-6"
            >

              <h2 className="text-2xl font-semibold mb-5">
                {request.sender_name} wants to swap with you
              </h2>

              <div className="grid grid-cols-2 gap-8">

                <div className="bg-slate-800 p-5 rounded-xl">

                  <p className="text-pink-400 font-semibold mb-3">
                    Their Book
                  </p>

                  <img
                    src={request.sender_book_image}
                    className="w-40 h-56 rounded-lg object-cover"
                    alt=""
                  />

                  <h3 className="mt-4 text-xl">
                    {request.sender_book_title}
                  </h3>

                  <p className="text-gray-400">
                    {request.sender_book_author}
                  </p>

                </div>

                <div className="bg-slate-800 p-5 rounded-xl">

                  <p className="text-green-400 font-semibold mb-3">
                    Your Book
                  </p>

                  <img
                    src={request.receiver_book_image}
                    className="w-40 h-56 rounded-lg object-cover"
                    alt=""
                  />

                  <h3 className="mt-4 text-xl">
                    {request.receiver_book_title}
                  </h3>

                  <p className="text-gray-400">
                    {request.receiver_book_author}
                  </p>

                </div>

              </div>

              <p className="mt-6">
                Status :
                <span className="ml-2 text-yellow-400">
                  {request.status}
                </span>
              </p>

              {request.status === "PENDING" && (
                <div className="mt-6 flex gap-4">

                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(request.id)}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}