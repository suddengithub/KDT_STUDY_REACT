import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId를 가져옵니다
  const [post, setPost] = useState(null); // 게시글 상태
  const navigate = useNavigate();

  useEffect(() => {
    // API를 통해 해당 postId로 게시글을 가져옵니다.
    AxiosApi.getPostById(postId)
      .then((response) => {
        // API 응답이 왔을 때 post 데이터 상태 설정
        setPost(response);
      })
      .catch((error) => {
        console.error("There was an error fetching the post!", error);
      });
  }, [postId]); // postId가 변경될 때마다 API를 호출

  if (!post) return <div>Loading...</div>; // 게시글 데이터가 없을 때 로딩 화면을 표시

  return (
    <div>
      <button onClick={() => navigate("/")}> 뒤로 가기 </button>
      <h1>{post.postTitle}</h1> {/* 게시글 제목 표시 */}
      <p>{post.postContent}</p> {/* 게시글 내용 표시 */}
      {/* 소스코드 블록 표시 */}
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
    </div>
  );
};

export default PostDetail;
