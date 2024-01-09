import React from "react";
import "styles/LoadingSpinner.scss";
import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
        <FaSpinner className="spinner m-auto text-3xl" />
      </div>
    </div>
  );
}