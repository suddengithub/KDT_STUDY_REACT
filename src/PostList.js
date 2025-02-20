import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import
import PostEditor from "./PostEditor"; // PostEditor import

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosApi.getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  const handleSavePost = (postData) => {
    AxiosApi.savePost(postData)
      .then((savedPost) => {
        setPosts([...posts, savedPost]);
        setIsEditorVisible(false); // 에디터를 숨기고 목록으로 돌아옴
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
            <li key={post.id} onClick={() => handlePostClick(post.id)}>
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
