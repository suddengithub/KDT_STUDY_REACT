import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import AxiosApi from "./AxiosApi";
import { useNavigate } from "react-router-dom";

const PostEditor = () => {
  const editorRef = useRef();
  const [postTitle, setPostTitle] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([]);
  const navigate = useNavigate();

  const addCodeBlock = () => {
    setCodeBlocks((prevBlocks) => [...prevBlocks, { language: "", code: "" }]);

    // 자동 스크롤
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleCodeChange = (index, key, value) => {
    setCodeBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[index][key] = value;
      return updatedBlocks;
    });
  };

  const calculateLanguageCounts = () => {
    const counts = {
      Java: 0,
      Python: 0,
      C: 0,
      "C++": 0,
      JavaScript: 0,
      HTML: 0,
      CSS: 0,
    };

    codeBlocks.forEach((block) => {
      if (counts[block.language] !== undefined) {
        counts[block.language]++;
      }
    });

    return counts;
  };

  const handleSave = async () => {
    if (!postTitle.trim()) {
      alert("제목을 입력하세요!");
      return;
    }

    for (const block of codeBlocks) {
      if (!block.language) {
        alert("모든 코드 블록의 언어를 선택해야 합니다.");
        return;
      }
    }

    const postContent = editorRef.current.getInstance().getMarkdown();
    const languageCounts = calculateLanguageCounts();

    const postData = {
      postTitle,
      postContent,
      codeBlocks,
      languageCounts,
    };

    try {
      const response = await AxiosApi.savePost(postData);
      if (response) {
        alert("게시글이 저장되었습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving post", error);
      alert("저장 실패");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>게시글 작성</h1>

      {/* 제목 입력 필드 */}
      <input
        type="text"
        placeholder="제목을 입력해 주세요."
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <Editor
        initialValue="내용을 입력해 주세요."
        previewStyle="vertical"
        height="500px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        ref={editorRef}
      />

      {/* 소스코드 블록 추가 버튼 */}
      <button
        onClick={addCodeBlock}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        + 소스코드 추가
      </button>

      {/* 코드 블록 목록 */}
      {codeBlocks.map((block, index) => (
        <div
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <select
            value={block.language}
            onChange={(e) =>
              handleCodeChange(index, "language", e.target.value)
            }
            style={{
              width: "100%",
              padding: "5px",
              marginBottom: "5px",
              borderRadius: "3px",
            }}
          >
            <option value="">언어 선택</option>
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
            value={block.code}
            onChange={(e) => handleCodeChange(index, "code", e.target.value)}
            placeholder="소스코드를 입력하세요"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "3px",
              resize: "none",
            }}
          />
        </div>
      ))}

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#28A745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          width: "100%",
        }}
      >
        저장
      </button>
    </div>
  );
};

export default PostEditor;
