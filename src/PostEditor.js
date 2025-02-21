import React, { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const PostEditor = ({ onSave }) => {
  const editorRef = useRef();
  const [codeBlocks, setCodeBlocks] = useState([]); // 코드 블록 상태 관리

  // 소스코드 블록 추가
  const addCodeBlock = () => {
    setCodeBlocks([...codeBlocks, { language: "", code: "" }]);
  };

  // 코드 블록 내용 변경
  const handleCodeChange = (index, key, value) => {
    const updatedBlocks = [...codeBlocks];
    updatedBlocks[index][key] = value;
    setCodeBlocks(updatedBlocks);
  };

  // 저장 버튼 클릭 시 처리
  const handleSave = async () => {
    const postTitle = prompt("게시글 제목을 입력하세요");
    const postContent = editorRef.current.getInstance().getMarkdown();

    const postData = {
      postTitle,
      postContent,
      codeBlocks, // codeBlocks를 그대로 서버에 전달
    };

    try {
      const response = await fetch("http://localhost:8111/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("게시글이 저장되었습니다.");
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

      {/* 소스코드 블록 추가 버튼 */}
      <button onClick={addCodeBlock}>소스코드 추가</button>

      {/* 각 코드 블록 입력 */}
      {codeBlocks.map((block, index) => (
        <div
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <select
            value={block.language}
            onChange={(e) =>
              handleCodeChange(index, "language", e.target.value)
            }
          >
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
          </select>
          <textarea
            rows="5"
            cols="50"
            value={block.code}
            onChange={(e) => handleCodeChange(index, "code", e.target.value)}
            placeholder="소스코드를 입력하세요"
          />
        </div>
      ))}

      {/* 저장 버튼 */}
      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default PostEditor;
