import axios from "axios";

export async function fetchBookImage(title) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      title
    )}`;

    const response = await axios.get(url);

    if (response.data.docs.length === 0) {
      return "";
    }

    const book = response.data.docs[0];

    if (!book.cover_i) {
      return "";
    }

    return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  } catch (error) {
    console.error("Error fetching book image:", error.message);
    return "";
  }
}