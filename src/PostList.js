import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import
import PostEditor from "./PostEditor"; // PostEditor import

const PostList = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [isEditorVisible, setIsEditorVisible] = useState(false); // 글쓰기 에디터 표시 여부
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

  const handleSavePost = (postData) => {
    AxiosApi.savePost(postData)
      .then((savedPost) => {
        setPosts([...posts, savedPost]); // 새로운 글 추가
        setIsEditorVisible(false); // 글 작성 완료 후 에디터 숨김
      })
      .catch((error) => {
        console.error("Error saving post", error);
      });
  };

  return (
    <div>
      <h1>게시판 목록</h1>
      <button onClick={() => setIsEditorVisible(true)}>새 게시글 작성</button>
      {isEditorVisible ? (
        <PostEditor onSave={handleSavePost} />
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.postId} onClick={() => handlePostClick(post.postId)}>
              {post.postTitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
