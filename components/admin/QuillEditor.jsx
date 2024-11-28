"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import katex from "katex";
import { Quill as GlobalQuill } from "react-quill";

// Import the KaTeX module for math symbols
GlobalQuill.register("modules/katex", function () {
  return { katex };
});

const QuillEditor = ({ onContentChange }) => {
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
            ["formula"], // Formula button for KaTeX
            ["clean"],
          ],
          katex: true, // Enable KaTeX module
        },
      });

      quillInstanceRef.current = quillInstance;

      quillInstance.on("text-change", () => {
        const htmlContent = quillInstance.root.innerHTML;
        onContentChange(htmlContent);
      });
    }
  }, [onContentChange]);

  return <div ref={quillRef} className="h-[300px] " />;
};

export default QuillEditor;
