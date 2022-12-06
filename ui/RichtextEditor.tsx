"use client";

import {
  faBold,
  faHeading,
  faItalic,
  faParagraph,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      <div className="w-full rounded-lg border-2 border-neutral-200">
        <div className="flex bg-neutral-200 py-1 gap-2 items-stretch px-2">
          <button className="w-8 h-8 hover:bg-neutral-300 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faHeading} />
          </button>
          <button className="w-8 h-8 hover:bg-neutral-800 bg-neutral-900 text-white rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faParagraph} />
          </button>
          <div className="w-0.5 my-1 rounded-full bg-slate-400"></div>
          <button className="w-8 h-8 hover:bg-neutral-300 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button className="w-8 h-8 hover:bg-neutral-300 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button className="w-8 h-8 hover:bg-neutral-300 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button className="w-8 h-8 hover:bg-neutral-300 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
          <div className="w-0.5 my-1 rounded-full bg-slate-400"></div>
          <div className="text-sm text-neutral-500 italic flex items-center">
            Other editor controls...
          </div>
        </div>
        <div className="p-2">
          <Editor
            placeholder={placeholder}
            editorState={value}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
    </div>
  );
};
export default RichtextEditor;
