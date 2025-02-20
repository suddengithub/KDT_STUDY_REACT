import React, { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const PostEditor = ({ onSave }) => {
  const editorRef = useRef();

  const handleSave = () => {
    const markdownContent = editorRef.current.getInstance().getMarkdown();
    const title = prompt("게시글 제목을 입력하세요"); // 제목을 사용자가 입력하도록 함

    // 마크다운 내용과 제목을 서버에 저장
    onSave({ title, content: markdownContent });
  };

  return (
    <div>
      <h1>게시글 작성</h1>
      <Editor
        initialValue="여기에 게시글을 작성하세요"
        previewStyle="vertical"
        height="500px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        ref={editorRef}
      />
      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default PostEditor;
