import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import { useAuthUser } from "../hooks/useAuthUser";

export default function SwapPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuthUser();

  useEffect(() => {
  if (authLoading || !user) return;

  fetchMatches();

}, [authLoading, user]);

  const fetchMatches = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const res = await axios.get(
        `http://localhost:5000/api/swaps/matches/${user.uid}`
      );

      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const sendRequest = async (match) => {
    try {
      const user = auth.currentUser;

      await axios.post(
        "http://localhost:5000/api/swaps/request",
        {
          firebase_uid: user.uid,

          receiver_id: match.receiver_id,

          sender_book_id: match.sender_book_id,

          receiver_book_id: match.receiver_book_id,
        }
      );

      alert("Swap request sent successfully!");
    } catch (err) {
      console.error(err);

      alert("Couldn't send request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center">
        Loading matches...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Book Matches
      </h1>

      {matches.length === 0 ? (
        <div className="text-gray-400 text-xl">
          No matches found in your groups.
        </div>
      ) : (
        <div className="space-y-8">

          {matches.map((match, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-6"
            >

              <h2 className="text-2xl font-semibold mb-6">
                Match with {match.name}
              </h2>

              <div className="grid grid-cols-2 gap-10">

                {/* Receive */}

                <div className="bg-slate-800 rounded-xl p-5">

                  <p className="text-pink-400 font-semibold mb-3">
                    You Receive
                  </p>

                  <img
                    src={match.receiver_book_image}
                    alt=""
                    className="w-40 h-56 rounded-lg object-cover"
                  />

                  <h3 className="text-xl font-semibold mt-4">
                    {match.receiver_book_title}
                  </h3>

                  <p className="text-gray-400">
                    {match.receiver_book_author}
                  </p>

                </div>

                {/* Give */}

                <div className="bg-slate-800 rounded-xl p-5">

                  <p className="text-green-400 font-semibold mb-3">
                    You Give
                  </p>

                  <img
                    src={match.sender_book_image}
                    alt=""
                    className="w-40 h-56 rounded-lg object-cover"
                  />

                  <h3 className="text-xl font-semibold mt-4">
                    {match.sender_book_title}
                  </h3>

                  <p className="text-gray-400">
                    {match.sender_book_author}
                  </p>

                </div>

              </div>

              <button
                onClick={() => sendRequest(match)}
                className="mt-8 bg-fuchsia-600 hover:bg-fuchsia-700 transition px-6 py-3 rounded-xl flex items-center gap-3"
              >
                <ArrowLeftRight size={20} />
                Send Swap Request
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}