import * as Sentry from "@sentry/react";
import React from "react";

/**
 * ErrorButton component to test Sentry's error tracking.
 * This should only be used in development environments.
 */
function ErrorButton() {
  return (
    <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        margin: "10px"
      }}
      onClick={() => {
        throw new Error("This is your first error!");
      }}
    >
      Break the world
    </button>
  );
}

export default ErrorButton;
