import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaYoutube } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-dark text-light mt-4 rounded w-75 m-auto shadow-lg">
      <div className="container text-center py-3">
        <h1 className="display-6 fw-bold mb-1 d-flex align-items-center justify-content-center">
          <FaYoutube className="text-danger me-2" />
          YouTube Playlist Analyzer
        </h1>
        <p className="lead">
          Analyze your playlist to plan your viewing time efficiently
        </p>
      </div>
    </header>
  );
}

export default Header;
