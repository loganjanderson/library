const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const router = express.Router();

// Get the Baserow token from environment variables
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

// Base URL for Baserow API
const BASEROW_BASE_URL = "https://api.baserow.io/api/database/rows";

app.get("/", (req, res) => {
  res.send("Welcome to the Anderson Family Library API!");
});

router.post("/create-book", async (req, res) => {
  const {
    authorName,
    bookTitle,
    bookImage,
    copies,
    description,
    isbn,
    // categories, // Commented out categories
  } = req.body;

  try {
    // Step 1: Handle multiple authors
    const authorNames = authorName.split(",").map((name) => name.trim());
    const authorIds = [];

    for (const name of authorNames) {
      const authorSearchResponse = await axios.get(
        `${BASEROW_BASE_URL}/table/474110/?user_field_names=true&filter__name__equal=${encodeURIComponent(
          name
        )}`,
        {
          headers: {
            Authorization: `Token ${BASEROW_TOKEN}`,
          },
        }
      );

      let authorId;
      if (authorSearchResponse.data.results.length > 0) {
        authorId = authorSearchResponse.data.results[0].id;
      } else {
        const authorResponse = await axios.post(
          `${BASEROW_BASE_URL}/table/474110/?user_field_names=true`,
          { name: name },
          {
            headers: {
              Authorization: `Token ${BASEROW_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        authorId = authorResponse.data.id;
      }

      authorIds.push(authorId);
    }

    // Step 2: Handle multiple categories
    // const categoryNames = Array.isArray(categories)
    //   ? categories
    //   : categories.split(",").map((cat) => cat.trim());
    // const categoryIds = [];

    // for (const category of categoryNames) {
    //   const categorySearchResponse = await axios.get(
    //     `${BASEROW_BASE_URL}/table/474180/?user_field_names=true&filter__name__equal=${encodeURIComponent(
    //       category
    //     )}`,
    //     {
    //       headers: {
    //         Authorization: `Token ${BASEROW_TOKEN}`,
    //       },
    //     }
    //   );

    //   let categoryId;
    //   if (categorySearchResponse.data.results.length > 0) {
    //     categoryId = categorySearchResponse.data.results[0].id;
    //   } else {
    //     const categoryResponse = await axios.post(
    //       `${BASEROW_BASE_URL}/table/474180/?user_field_names=true`,
    //       { name: category },
    //       {
    //         headers: {
    //           Authorization: `Token ${BASEROW_TOKEN}`,
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     categoryId = categoryResponse.data.id;
    //   }

    //   categoryIds.push(categoryId);
    // }

    // Step 3: Check if the book exists
    const bookSearchResponse = await axios.get(
      `${BASEROW_BASE_URL}/table/473947/?user_field_names=true&filter__title__equal=${encodeURIComponent(
        bookTitle
      )}`,
      {
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
        },
      }
    );

    let bookId;
    if (bookSearchResponse.data.results.length > 0) {
      bookId = bookSearchResponse.data.results[0].id;
      res.status(200).json({
        message: "Book already exists",
        bookId: bookId,
      });
      return;
    } else {
      const bookResponse = await axios.post(
        `${BASEROW_BASE_URL}/table/473947/?user_field_names=true`,
        {
          title: bookTitle,
          img: bookImage,
          Author: authorIds, // Attach all authors to the book
          copies: copies,
          description: description,
          isbn: isbn,
          // categories: categoryIds, // Commented out categories
        },
        {
          headers: {
            Authorization: `Token ${BASEROW_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      bookId = bookResponse.data.id;
    }

    // Step 4: Respond with the created or existing authors, categories, and book
    res.status(200).json({
      authors: authorIds.map((id, index) => ({ id, name: authorNames[index] })),
      // categories: categoryIds.map((id, index) => ({
      //   id,
      //   name: categoryNames[index],
      // })),
      book: { id: bookId, title: bookTitle },
    });
  } catch (error) {
    console.error(
      "Error creating or checking book, authors, or categories:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      error: "Failed to create or check book, authors, or categories",
    });
  }
});

router.get("/get-book", async (req, res) => {
  const { isbn } = req.query; // Extract `isbn` from query parameters

  try {
    // Fetch the book by ISBN using a filter query
    const response = await axios.get(
      `${BASEROW_BASE_URL}/table/473947/?user_field_names=true&filter__isbn__equal=${encodeURIComponent(
        isbn
      )}`,
      {
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
        },
      }
    );

    // Check if the book exists
    if (response.data.results.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Return the book data
    res.status(200).json(response.data.results[0]);
  } catch (error) {
    console.error(
      "Error fetching book data:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Failed to fetch book data" });
  }
});

router.patch("/update-book", async (req, res) => {
  const { bookId, checkedOutCopies, checkedOutBy } = req.body;

  try {
    const response = await axios({
      method: "PATCH",
      url: `https://api.baserow.io/api/database/rows/table/473947/${bookId}/?user_field_names=true`,
      data: {
        checkedOutCopies: checkedOutCopies,
        checkedOutBy: checkedOutBy,
      },
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("Error updating book data:", error);
    res.status(500).json({
      error: "Failed to update book data",
    });
  }
});

// Define the API routes
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
