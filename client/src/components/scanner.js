import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Scanner = () => {
  const [stopStream, setStopStream] = useState(false);
  const [bookData, setBookData] = useState({});
  const [canScan, setCanScan] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [checkedOutName, setCheckedOutName] = useState("");
  // const [categories, setCategories] = useState([]); // Array of categories

  const getBookData = async (isbn) => {
    try {
      const response = await fetch(
        `http://localhost:5001/get-book?isbn=${encodeURIComponent(isbn)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookData(data);
      setCanScan(false);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setCanScan(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:5001/update-book", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: bookData.id,
          checkedOutCopies: bookData.checkedOutCopies + 1,
          checkedOutBy: checkedOutName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Book checked out successfully!");
    } catch (error) {
      console.error("Failed to update book data:", error);
      alert("Failed to check out the book. Please try again.");
    }
  };

  const handleClearForm = () => {
    setBookData({});
    setCheckedOutName("");
    setIsbn("");
    setCanScan(true);
  };

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

      {bookData.title ? (
        <div className="book-info">
          {bookData.title && (
            <img src={bookData.img} alt={bookData.title || "Book Thumbnail"} />
          )}
          <div className="line">
            <h3>Title:</h3>
            <p>{bookData.title}</p>
          </div>
          <div className="line">
            <h3>Author:</h3>
            <p>{bookData.Author[0].value}</p>
          </div>
          <div className="line">
            <h3>Your Name:</h3>
            <input
              type="text"
              value={checkedOutName}
              onChange={(e) => setCheckedOutName(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <button onClick={handleClearForm}>Clear Book</button>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      ) : (
        <div className="stop-scanning">
          <button
            onClick={() => setCanScan(false)}
            style={{ marginTop: "30px" }}
          >
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
