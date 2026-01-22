import { useState, useEffect, useCallback } from "react";
import { saveMessage, getMessage } from "../services/messageService";

export function Common() {
  const [text, setText] = useState("");

  // CTRL + S → POST
  const handleSave = useCallback(async () => {
    try {
      const res = await saveMessage(text);
      console.log("POST /save called ✅", res.data);
    } catch (error) {
      console.error("POST failed ❌", error);
    }
  }, [text]);

  // CTRL + Q → GET
  const handleGet = useCallback(async () => {
    try {
      const res = await getMessage();
      console.log("GET /get called ✅", res.data);
      setText(res.data.text); // update textarea
    } catch (error) {
      console.error("GET failed ❌", error);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // CTRL + S
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }

      // CTRL + Q
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        handleGet();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave, handleGet]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type things to be shared"
      style={{
        width: "100%",
        height: "95vh",
        backgroundColor: "#242424",
        color: "#e5e7eb",
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "18px",
        fontFamily: "monospace",
        boxSizing: "border-box",
      }}
    />
  );
}
