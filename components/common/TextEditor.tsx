"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, RawDraftContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Use more specific type for dynamic import
// Dynamic import the Editor component with SSR disabled
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
     ssr: false,
     loading: () => <div className="border rounded-md px-3 py-2 min-h-[150px]">Loading editor...</div>
  }
);

// Define the editor ref type properly
type EditorRefType = {
  current: unknown;
};

export default forwardRef<object, EditorProps>(function TextEditor(props, ref) {
  // Use useRef instead of useState to avoid state updates on unmounted component
  const editorStateRef = useRef<EditorState | null>(null);
  const isMountedRef = useRef<boolean>(false);
  
  // Initialize the editor state after component is mounted
  useEffect(() => {
    isMountedRef.current = true;
    editorStateRef.current = EditorState.createEmpty();
    
    // Force a re-render after initialization
    const forceUpdate = () => {};
    forceUpdate();
    
    // Cleanup function to handle unmounting
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleEditorChange = (state: EditorState) => {
    if (isMountedRef.current) {
      editorStateRef.current = state;
      
      // If onChange prop is defined, call it with the converted content
      // We need to convert EditorState to RawDraftContentState for proper typing
      if (props.onChange) {
        const contentState = state.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        props.onChange(rawContent);
      }
    }
  };

  // Return a loading state if the component isn't mounted or editorState isn't initialized
  if (!isMountedRef.current || !editorStateRef.current) {
    return <div className="border rounded-md px-3 py-2 min-h-[150px]">Loading editor...</div>;
  }

  return (
    <Editor
      editorState={editorStateRef.current}
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
        if (isMountedRef.current) {
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            (ref as EditorRefType).current = r;
          }
        }
      }}
      {...props}
    />
  );
});