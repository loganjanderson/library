import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/styles.scss";

import Home from "./components/home";
import Header from "./components/header";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";
import Scanner from "./components/scanner";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/checkout" element={<Scanner />} />
      </Routes>
    </main>
  );
}

export default App;
