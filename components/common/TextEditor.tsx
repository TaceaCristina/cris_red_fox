"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useRef, useState } from "react";
import { EditorState, convertToRaw, RawDraftContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Definim tipul pentru referința editorului
type EditorRefType = {
  current: unknown;
};

// Creăm un tip custom pentru props-urile editorului
interface CustomEditorProps {
  editorClassName?: string;
  onChange?: (content: RawDraftContentState) => void;
  editorRef?: any;
  [key: string]: any; // Pentru orice alte props
}

// EditorComponent pentru a gestiona renderizarea condițională
const EditorComponent = ({ 
  editorState, 
  onEditorStateChange, 
  editorRef, 
  editorClassName, 
  ...props 
}: any) => {
  // Importăm editorul doar pe client
  const { Editor } = require("react-draft-wysiwyg");
  
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      editorClassName={editorClassName}
      editorRef={editorRef}
      toolbar={{
        options: ["inline", "list", "link", "history"],
        inline: {
          options: ["bold", "italic", "underline"],
        },
      }}
      {...props}
    />
  );
};

// Componenta TextEditor cu forward ref
const TextEditor = forwardRef<object, CustomEditorProps>(function TextEditor(props, ref) {
  // State pentru renderizarea pe client
  const [isClient, setIsClient] = useState(false);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  
  // Referință pentru a preveni actualizări de state la componentele demontate
  const isMountedRef = useRef(false);

  // Prima useEffect pentru a gestiona detecția clientului și montarea componentei
  useEffect(() => {
    isMountedRef.current = true;
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      setEditorState(EditorState.createEmpty());
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Gestionarea schimbărilor în editor
  const handleEditorChange = (state: EditorState) => {
    if (!isMountedRef.current) return;
    
    setEditorState(state);
      
    // Dacă există onChange în props, îl apelăm cu conținutul convertit
    if (props.onChange) {
      const contentState = state.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      props.onChange(rawContent);
    }
  };

  // Dacă nu suntem pe client sau editorul nu este încărcat, afișăm un placeholder
  if (!isClient || !editorState) {
    return (
      <div className="border rounded-md px-3 py-2 min-h-[150px] bg-muted/20">
        Se încarcă editorul...
      </div>
    );
  }

  // Renderizăm editorul folosind o componentă separată pentru a gestiona importul dinamic
  return (
    <div className="editor-wrapper">
      {isClient && (
        <EditorComponent
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          editorClassName={cn(
            "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            props.editorClassName
          )}
          editorRef={(r: any) => {
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
      )}
    </div>
  );
});

export default TextEditor;