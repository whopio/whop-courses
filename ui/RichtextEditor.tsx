"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faCode,
  faHeading,
  faItalic,
  faListOl,
  faListUl,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ContentBlock,
  DraftHandleValue,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { Dispatch, FC, SetStateAction } from "react";

function getBlockStyle(block: ContentBlock): string {
  switch (block.getType()) {
    case "header-one":
      return "text-2xl font-bold mb-2 mt-3";
    case "code-block":
      return "bg-neutral-100 p-2 rounded-lg font-monospace";
    case "unordered-list-item":
      return "text-red";
    default:
      return "";
  }
}

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

  const selection = value.getSelection();
  const currentBlockType = value
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div>
      {label && <label className="block text-sm mb-1 font-bold">{label}</label>}
      <div className="w-full rounded-lg border-2 border-neutral-200">
        <div className="flex bg-neutral-200 py-1 gap-2 items-stretch px-2">
          <BlockStyleButton
            icon={faHeading}
            state={value}
            onChange={onChange}
            type="header-one"
          />
          <div className="w-0.5 my-1 rounded-full bg-slate-400" />
          <InlineStyleButton
            icon={faBold}
            state={value}
            onChange={onChange}
            style="BOLD"
          />
          <InlineStyleButton
            icon={faItalic}
            state={value}
            onChange={onChange}
            style="ITALIC"
          />
          <InlineStyleButton
            icon={faUnderline}
            state={value}
            onChange={onChange}
            style="UNDERLINE"
          />
          <InlineStyleButton
            icon={faStrikethrough}
            state={value}
            onChange={onChange}
            style="STRIKETHROUGH"
          />
          <div className="w-0.5 my-1 rounded-full bg-slate-400" />
          <BlockStyleButton
            icon={faListUl}
            state={value}
            onChange={onChange}
            type="unordered-list-item"
          />
          <BlockStyleButton
            icon={faListOl}
            state={value}
            onChange={onChange}
            type="ordered-list-item"
          />
          <BlockStyleButton
            icon={faCode}
            state={value}
            onChange={onChange}
            type="code-block"
          />
          <div className="w-0.5 my-1 rounded-full bg-slate-400" />
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
            preserveSelectionOnBlur
            blockStyleFn={getBlockStyle}
          />
        </div>
      </div>
    </div>
  );
};

function BlockStyleButton({
  icon,
  type,
  state,
  onChange,
}: {
  icon: IconProp;
  type: string;
  state: EditorState;
  onChange: Dispatch<SetStateAction<EditorState>>;
}) {
  const currentBlockType = state
    .getCurrentContent()
    .getBlockForKey(state.getSelection().getStartKey())
    .getType();
  return (
    <EditorButton
      icon={icon}
      onToggle={() => onChange(RichUtils.toggleBlockType(state, type))}
      active={currentBlockType === type}
    />
  );
}

function InlineStyleButton({
  icon,
  style,
  state,
  onChange,
}: {
  icon: IconProp;
  style: string;
  state: EditorState;
  onChange: Dispatch<SetStateAction<EditorState>>;
}) {
  return (
    <EditorButton
      icon={icon}
      onToggle={() => onChange(RichUtils.toggleInlineStyle(state, style))}
      active={state.getCurrentInlineStyle().has(style)}
    />
  );
}

function EditorButton({
  icon,
  onToggle,
  active,
}: {
  icon: IconProp;
  onToggle?: () => void;
  active?: boolean;
}) {
  return (
    <button
      className={`w-8 h-8 rounded flex items-center justify-center ${
        active
          ? "hover:bg-neutral-800 bg-neutral-900 text-white"
          : "hover:bg-neutral-300 "
      }`}
      onClick={onToggle}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

export default RichtextEditor;
