import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import AxiosApi from "./AxiosApi";
import { useNavigate, useParams } from "react-router-dom";
import "./PostEditor.css";

const PostEditor = () => {
  const { postId } = useParams();
  const editorRef = useRef();
  const [postTitle, setPostTitle] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      AxiosApi.getPostById(postId)
        .then((response) => {
          setPostTitle(response.postTitle);
          setCodeBlocks(response.codeBlocks || []);
          editorRef.current.getInstance().setMarkdown(response.postContent);
        })
        .catch((error) =>
          console.error("게시글을 불러오는 중 오류 발생!", error)
        );
    }
  }, [postId]);

  const addCodeBlock = () => {
    setCodeBlocks((prevBlocks) => [...prevBlocks, { language: "", code: "" }]);
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
      if (postId) {
        await AxiosApi.updatePost(postId, postData);
        alert("게시글이 수정되었습니다.");
      } else {
        await AxiosApi.savePost(postData);
        alert("게시글이 저장되었습니다.");
      }
      navigate("/");
    } catch (error) {
      console.error("게시글 저장 중 오류 발생", error);
      alert("저장 실패");
    }
  };

  return (
    <div className="postEditorContainer">
      <button onClick={() => navigate("/")} className="backButton">
        뒤로 가기
      </button>

      <input
        type="text"
        placeholder="제목을 입력해 주세요."
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        className="titleInput"
      />

      <Editor
        initialValue="내용을 입력해 주세요."
        previewStyle="vertical"
        height="500px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        ref={editorRef}
      />

      <button onClick={addCodeBlock} className="addCodeButton">
        + 소스코드 추가
      </button>

      {codeBlocks.map((block, index) => (
        <div key={index} className="codeBlockContainer">
          <select
            value={block.language}
            onChange={(e) =>
              handleCodeChange(index, "language", e.target.value)
            }
            className="languageSelect"
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
            className="codeTextarea"
          />
        </div>
      ))}

      <button onClick={handleSave} className="saveButton">
        {postId ? "수정 완료" : "저장"}
      </button>
    </div>
  );
};

export default PostEditor;
