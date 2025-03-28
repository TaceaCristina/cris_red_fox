"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef, useState } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default forwardRef<Object, EditorProps>(function TextEditor(props, ref) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEditorChange = (state: EditorState) => {
    if (isMounted.current) {
      setEditorState(state);
    }
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorChange}
      editorClassName={cn(
        "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        props.editorClassName
      )}
      toolbar={{
        options: ["inline", "list", "link", "history"],
        inline: {
          options: ["bold", "italic", "underline"],
        },
      }}
      editorRef={(r) => {
        if (typeof ref === "function") {
          ref(r);
        } else if (ref) {
          (ref as any).current = r;
        }
      }}
      {...props}
    />
  );
});
