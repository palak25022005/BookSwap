import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {auth} from "../lib/firebase.js";
import axios from "axios";
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

  const [showModal,setShowModal]=useState(false);

const [book,setBook]=useState({
    title:"",
    author:"",
    genre:"",
    description:""
});

const [books, setBooks] = useState([]);

const handleSubmit = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/books",
      {
        user_id: user.uid,
        ...book,
      }
    );

    setBooks((prev) => [res.data, ...prev]);

    setShowModal(false);

    setBook({
      title: "",
      author: "",
      genre: "",
      description: "",
    });
  } catch (err) {
    console.error(err);
  }
};



useEffect(() => {
  const fetchBooks = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No logged in user");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/books/${user.uid}`
      );

      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBooks();
}, []);

  // Dummy data
  const groups = [
    { id: 1, name: "COEP Hostel", members: 42 },
    { id: 2, name: "Civil Engineering", members: 61 },
    { id: 3, name: "Office Friends", members: 18 },
  ];

  

  return (
    <>
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
    onClick={() => setShowModal(true)}
  >
    Add Book
  </button>

  {/* My Books */}
  <div className="mt-6 border-t border-slate-700 pt-4">
    <h3 className="text-lg font-semibold mb-3">My Books</h3>

    <div className="max-h-[350px] overflow-y-auto space-y-4">
      {books.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No books added yet.
        </p>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            className="bg-slate-800 rounded-xl p-3 flex gap-3"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {book.title}
              </h3>

              <p className="text-gray-300">
                {book.author}
              </p>

              <p className="text-violet-300 text-sm">
                {book.genre}
              </p>

              <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                {book.description}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
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

    {showModal && (
<div className="fixed inset-0 bg-black/70 flex justify-center items-center">

<div className="bg-slate-900 p-8 rounded-xl w-[500px]">

<h2 className="text-2xl mb-5">
Add Book
</h2>

<input
placeholder="Book Name"
className="w-full p-3 mb-3 rounded bg-slate-800"
onChange={(e)=>setBook({...book,title:e.target.value})}
/>

<input
placeholder="Author"
className="w-full p-3 mb-3 rounded bg-slate-800"
onChange={(e)=>setBook({...book,author:e.target.value})}
/>

<input
placeholder="Genre"
className="w-full p-3 mb-3 rounded bg-slate-800"
onChange={(e)=>setBook({...book,genre:e.target.value})}
/>

<textarea
placeholder="Description"
className="w-full p-3 mb-3 rounded bg-slate-800"
rows={4}
onChange={(e)=>setBook({...book,description:e.target.value})}
/>

<div className="flex justify-end gap-3">

<button
onClick={()=>setShowModal(false)}
className="px-5 py-2 bg-gray-600 rounded"
>
Cancel
</button>

<button
onClick={handleSubmit}
className="px-5 py-2 bg-violet-600 rounded"
>
Save
</button>

</div>

</div>

</div>
)}

</>
  );
}