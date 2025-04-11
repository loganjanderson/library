import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";

const AddBook = () => {
  const [stopStream, setStopStream] = useState(false);
  const [bookData, setBookData] = useState({});
  const [canScan, setCanScan] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [copies, setCopies] = useState(1);
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  // const [categories, setCategories] = useState([]); // Array of categories

  useEffect(() => {
    setTitle(
      bookData.title +
        (bookData.subtitle && bookData.subtitle !== "A Novel"
          ? `: ${bookData.subtitle}`
          : "")
    );
    setAuthor(bookData.authors ? bookData.authors.join(", ") : "");
    setImage(bookData.imageLinks?.smallThumbnail || "");
    setDescription(bookData.description || "");
    // setCategories(bookData.categories || []);
  }, [bookData]);

  const getBookData = async (isbn) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookData(data.items[0].volumeInfo);
      setCanScan(false);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
    }
  };

  const handleCreateBookData = async () => {
    try {
      const response = await fetch("http://localhost:5001/create-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName: author,
          bookTitle: title,
          bookImage: image,
          copies: copies,
          description: description,
          isbn: isbn,
          // categories: categories, // Commented out categories
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Book created successfully:", result);
      alert("Book created successfully!", result);
    } catch (error) {
      console.error("Failed to create book:", error);
      alert("Failed to create book.", error);
    }
  };

  const handleClearForm = () => {
    setBookData({});
    setTitle("");
    setAuthor("");
    setImage("");
    setCanScan(true);
  };

  // const handleAddCategory = (newCategory) => {
  //   if (newCategory.trim() && !categories.includes(newCategory.trim())) {
  //     setCategories([...categories, newCategory.trim()]);
  //   }
  // };

  // const handleRemoveCategory = (categoryToRemove) => {
  //   setCategories(
  //     categories.filter((category) => category !== categoryToRemove)
  //   );
  // };

  return (
    <div className="scanner-wrapper">
      <div
        className="barcode-scanner"
        onClick={() => !canScan && setCanScan(true)}
      >
        {canScan ? (
          <BarcodeScannerComponent
            width={500}
            height={500}
            stopStream={stopStream}
            onUpdate={(err, result) => {
              if (result) {
                getBookData(result.text);
                setIsbn(result.text);
              }
            }}
          />
        ) : (
          <div className="start-scanner">
            <h2 onClick={() => setCanScan(true)}>Click to begin scanning</h2>
          </div>
        )}
      </div>

      {bookData.title && (
        <div className="book-info">
          {bookData.imageLinks?.smallThumbnail && (
            <img
              src={bookData.imageLinks.smallThumbnail}
              alt={bookData.title || "Book Thumbnail"}
            />
          )}
          <div className="line">
            <h3>Title:</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="line">
            <h3>Author:</h3>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="line">
            <h3>Copies:</h3>
            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>
          {/* <div className="line">
            <h3>Categories:</h3>
            <input
              type="text"
              placeholder="Add a category"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddCategory(e.target.value);
                  e.target.value = ""; // Clear input after adding
                }
              }}
            />
          </div>
          <div className="categories-list">
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <span>{category}</span>
                <button onClick={() => handleRemoveCategory(category)}>
                  Remove
                </button>
              </div>
            ))}
          </div> */}
          <div className="line">
            <p>{description}</p>
          </div>
          <div className="form-buttons">
            <button onClick={handleClearForm}>Clear Book</button>
            <button onClick={handleCreateBookData}>Add Book</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;
