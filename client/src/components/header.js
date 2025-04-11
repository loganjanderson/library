import { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import RoundLogo from "../images/logo-round.png";
import { Link } from "react-router";
import Modal from "react-modal";

const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [allowAddBook, setAllowAddBook] = useState(false);

  useEffect(() => {
    if (password === "HopOnPop") {
      setAllowAddBook(true);
    } else if (password === "ILoveReading") {
      alert("Tsk Tsk! You tried to cheat");
    }
  }, [password]);

  const closeModal = () => {
    setModalIsOpen(false);
    if (password !== "HopOnPopOff") {
      setPassword("");
    }
  };

  return (
    <div className="header-wrapper">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <div className="links">
        {/* <Link to="/">Home</Link>
        <Link to="/books">Books</Link> */}
        <Link onClick={() => setModalIsOpen(true)}>Login</Link>
        <Link to="/checkout">Checkout</Link>
        {allowAddBook && <Link to="/addbook">Add Books</Link>}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
          },
        }}
      >
        <div className="modal">
          <label htmlFor="">Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password is ILoveReading"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Header;
