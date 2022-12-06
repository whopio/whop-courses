"use client";

import { DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { Dispatch, FC, SetStateAction } from "react";

const RichtextEditor: FC<{
  value: EditorState;
  onChange: Dispatch<SetStateAction<EditorState>>;
  label?: string;
  placeholder?: string;
}> = ({ label, onChange, value, placeholder }) => {
  function handleKeyCommand(
    command: string,
    editorState: EditorState
  ): DraftHandleValue {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  return (
    <div>
      {label && <label className="block text-sm mb-1 font-bold">{label}</label>}
      <div className="py-2 px-4 w-full rounded-lg border-2 border-neutral-200">
        <Editor
          placeholder={placeholder}
          editorState={value}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};
export default RichtextEditor;
