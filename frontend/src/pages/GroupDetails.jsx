import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, ArrowLeft, Copy } from "lucide-react";

export default function GroupDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [group, setGroup] = useState(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, []);

  async function fetchGroup() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/groups/details/${id}`
      );

      setGroup(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(group.invite_code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 p-3 rounded-lg"
        >
          <ArrowLeft />
        </button>

        <div>

          <h1 className="text-4xl font-bold">

            {group.name}

          </h1>

          <p className="text-gray-400">

            {group.members.length} Members

          </p>

        </div>

      </div>

      {/* Invite Code */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-xl font-semibold mb-4">

          Invite Code

        </h2>

        <div className="flex justify-between items-center bg-slate-800 rounded-xl px-5 py-4">

          <span className="text-2xl tracking-widest">

            {group.invite_code}

          </span>

          <button
            onClick={copyInvite}
            className="bg-violet-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Copy size={18} />
            Copy
          </button>

        </div>

      </div>

      {/* Members */}

      <div className="bg-slate-900 rounded-2xl p-6 mt-8">

        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">

          <Users />

          Members

        </h2>

        <div className="space-y-4">

          {group.members.map(member => (

            <div
              key={member.id}
              className="bg-slate-800 rounded-xl p-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">

                  {member.name}

                </h3>

                <p className="text-gray-400 text-sm">

                  {member.email}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Toast */}

      {copied && (

        <div className="fixed bottom-6 right-6 bg-green-600 px-5 py-3 rounded-xl">

          Invite code copied!

        </div>

      )}

    </div>
  );
}