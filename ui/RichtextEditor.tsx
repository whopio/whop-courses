"use client";

import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { Dispatch, FC, SetStateAction } from "react";

const RichtextEditor: FC<{
  value: EditorState;
  onChange: Dispatch<SetStateAction<EditorState>>;
  label?: string;
}> = ({ label, onChange, value }) => {
  return (
    <div>
      {label && <label className="block text-sm mb-1 font-bold">{label}</label>}
      <div className="py-2 px-4 w-full rounded-lg border-2 border-neutral-200">
        <Editor editorState={value} onChange={onChange} />
      </div>
    </div>
  );
};
export default RichtextEditor;
