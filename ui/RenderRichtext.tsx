"use client";

import { convertFromRaw, Editor, EditorState } from "draft-js";
import { FC } from "react";

export const RichtextRenderer: FC<{ content: string | null | undefined }> = ({
  content,
}) => {
  if (!content) return null;
  try {
    const data = JSON.parse(content);
    const contentState = convertFromRaw(data);
    const editorState = EditorState.createWithContent(contentState);
    return <Editor editorState={editorState} readOnly onChange={() => {}} />;
  } catch (error) {
    return null;
  }
};
