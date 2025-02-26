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
    <div style={styles.container}>
      <h1 style={styles.header}>게시판 목록</h1>
      <button
        onClick={() => navigate("/post-editor")}
        style={styles.newPostButton}
      >
        새 게시글 작성
      </button>
      <ul style={styles.postList}>
        {posts.map((post) => {
          // postCreatedAt을 Date 객체로 변환하여 포맷
          const formattedPostDate = new Date(post.postCreatedAt);
          const postDateString = !isNaN(formattedPostDate)
            ? formattedPostDate.toLocaleString()
            : "작성일 정보 없음"; // 유효하지 않으면 기본 텍스트 출력

          return (
            <li
              key={post.postId}
              onClick={() => handlePostClick(post.postId)}
              style={styles.postItem}
            >
              <h2 style={styles.postTitle}>{post.postTitle}</h2>
              <p style={styles.postDate}>{postDateString}</p>{" "}
              {/* 게시글 시간 */}
              <hr style={styles.divider} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  newPostButton: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "30px",
  },
  postList: {
    listStyle: "none",
    padding: 0,
  },
  postItem: {
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  postItemHover: {
    transform: "scale(1.02)",
    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
  },
  postTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 10px",
  },
  postDate: {
    fontSize: "14px",
    color: "gray",
    margin: "0",
  },
  divider: {
    marginTop: "10px",
    borderTop: "1px solid #ddd",
  },
};

export default PostList;
