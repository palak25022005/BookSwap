import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Users,
  Plus,
  Search,
  Share2,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  // Dummy data
  const groups = [
    { id: 1, name: "COEP Hostel", members: 42 },
    { id: 2, name: "Civil Engineering", members: 61 },
    { id: 3, name: "Office Friends", members: 18 },
  ];

  const books = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      owner: "Aditi",
      group: "COEP Hostel",
      image: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    },
    {
      id: 2,
      title: "The Alchemist",
      author: "Paulo Coelho",
      owner: "Rahul",
      group: "Civil Engineering",
      image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    },
    {
      id: 3,
      title: "Deep Work",
      author: "Cal Newport",
      owner: "Sneha",
      group: "Office Friends",
      image: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Manage your books, wishlist and exchange circles.
          </p>
        </div>

        <button
          className="bg-fuchsia-600 hover:bg-fuchsia-700 px-5 py-3 rounded-xl font-semibold"
          onClick={() => navigate("/match")}
        >
          Find Matches
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 p-8">
        {/* Left Column */}
        <div className="space-y-6">

          <div className="bg-slate-900 rounded-2xl p-6">
            <BookOpen className="mb-3" />
            <h2 className="text-xl font-semibold">
              Add Book to Shelf
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Add books you own and are willing to exchange.
            </p>

            <button
              className="mt-5 w-full bg-violet-600 py-3 rounded-xl"
            >
              Add Book
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <Heart className="mb-3 text-pink-400" />

            <h2 className="text-xl font-semibold">
              Wishlist
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Add books you'd like to borrow.
            </p>

            <button
              className="mt-5 w-full bg-pink-600 py-3 rounded-xl"
            >
              Add Wishlist Book
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <Search className="mb-3 text-green-400" />

            <h2 className="text-xl font-semibold">
              Find Match
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Search all your groups for matching books.
            </p>

            <button
              className="mt-5 w-full bg-green-600 py-3 rounded-xl"
            >
              Start Matching
            </button>
          </div>
        </div>

        {/* Middle Column */}
        <div className="bg-slate-900 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Users />
              My Groups
            </h2>

            <button className="bg-violet-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18} />
              Create
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border border-white/10 rounded-xl p-4"
              >
                <h3 className="font-semibold text-lg">
                  {group.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  {group.members} Members
                </p>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-slate-800 rounded-lg py-2">
                    View
                  </button>

                  <button className="flex items-center gap-2 bg-fuchsia-600 rounded-lg px-4">
                    <Share2 size={18} />
                    Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-5">
            Discover Books
          </h2>

          <div className="space-y-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-slate-900 rounded-2xl overflow-hidden"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-semibold">
                    {book.title}
                  </h3>

                  <p className="text-gray-400">
                    {book.author}
                  </p>

                  <p className="text-sm mt-3">
                    👤 {book.owner}
                  </p>

                  <p className="text-sm text-violet-300">
                    📍 {book.group}
                  </p>

                  <button
                    className="mt-5 w-full bg-fuchsia-600 hover:bg-fuchsia-700 py-3 rounded-xl flex justify-center items-center gap-2"
                  >
                    Request Book
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}