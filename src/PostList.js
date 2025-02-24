import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi 임포트

const PostList = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const navigate = useNavigate(); // navigate 함수 사용

  useEffect(() => {
    // 게시글 목록을 불러옵니다.
    AxiosApi.getPosts()
      .then((data) => {
        setPosts(data); // 데이터가 잘 왔을 때 상태 업데이트
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`); // 게시글을 클릭하면 상세 페이지로 이동
  };

  return (
    <div>
      <h1>게시판 목록</h1>
      <button onClick={() => navigate("/post-editor")}>
        새 게시글 작성
      </button>{" "}
      {/* 경로 변경 */}
      <ul>
        {posts.map((post) => (
          <li key={post.postId} onClick={() => handlePostClick(post.postId)}>
            {post.postTitle}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
