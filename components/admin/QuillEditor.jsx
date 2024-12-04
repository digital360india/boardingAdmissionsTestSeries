"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";

import katex from "katex";

if (typeof window !== "undefined") {
  window.katex = katex;
}
Quill.register(
  {
    "formats/formula": Quill.import("formats/formula"),
  },
  true
);

export const QuillEditor = ({ value, onContentChange }) => {
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (!quillInstanceRef.current) {
      const quillInstance = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ script: "sub" }, { script: "super" }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["formula"],
            ["clean"],
            ["image"],
          ],
        },
      });

      quillInstanceRef.current = quillInstance;
      if (value) {
        quillInstance.clipboard.dangerouslyPasteHTML(value);
      }

      // Override image handler to restrict image size to 10KB
      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
          const file = input.files[0];

          // Check if the file exists and its size
          if (file && file.size <= 10 * 1024) { // 10KB limit
            const reader = new FileReader();
            reader.onload = () => {
              const range = quillInstance.getSelection();
              quillInstance.insertEmbed(range.index, "image", reader.result);
            };
            reader.readAsDataURL(file);
          } else {
            alert("File is too large! Maximum allowed size is 10KB.");
          }
        };
      };

      // Set the custom image handler
      quillInstance.getModule("toolbar").addHandler("image", imageHandler);

      quillInstance.on("text-change", () => {
        const htmlContent = quillInstance.root.innerHTML;
        onContentChange(htmlContent);
      });
    }
  }, [value, onContentChange]);

  return (
    <div
      ref={quillRef}
      style={{
        height: "150px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    />
  );
};
