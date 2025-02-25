import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId를 가져옴
  const [post, setPost] = useState(null); // 게시글 상태
  const navigate = useNavigate();

  useEffect(() => {
    // API를 통해 해당 postId로 게시글을 가져옴
    AxiosApi.getPostById(postId)
      .then((response) => {
        setPost(response);
      })
      .catch((error) => {
        console.error("게시글을 불러오는 중 오류 발생!", error);
      });
  }, [postId]);

  if (!post) return <div>Loading...</div>; // 게시글 데이터가 없을 때 로딩 화면 표시

  return (
    <div>
      <button onClick={() => navigate("/")}>뒤로 가기</button>

      {/* 게시글 제목과 내용 */}
      <h1>{post.postTitle}</h1>
      <p>{post.postContent}</p>

      {/* 코드 블록 표시 */}
      {post.codeBlocks && post.codeBlocks.length > 0 && (
        <div>
          {post.codeBlocks.map((block, index) => (
            <div key={index}>
              <h3>{block.language}</h3>
              <pre>{block.code}</pre>
            </div>
          ))}
        </div>
      )}

      {/* ✅ 추가: 수정하기 버튼 */}
      <button
        onClick={() => navigate(`/post-editor/${postId}`)}
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
        수정하기
      </button>
    </div>
  );
};

export default PostDetail;
