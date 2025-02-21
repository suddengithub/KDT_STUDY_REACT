import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId를 가져옵니다
  const [post, setPost] = useState(null); // 게시글 상태

  useEffect(() => {
    // API를 통해 해당 postId로 게시글을 가져옵니다.
    AxiosApi.getPostById(postId)
      .then((response) => {
        // API 응답이 왔을 때 post 데이터 상태 설정
        if (response) {
          setPost(response); // 서버에서 받은 데이터를 상태로 업데이트
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the post!", error);
      });
  }, [postId]); // postId가 변경될 때마다 API를 호출

  if (!post) return <div>Loading...</div>; // 게시글 데이터가 없을 때 로딩 화면을 표시

  return (
    <div>
      <h1>{post.postTitle}</h1> {/* 게시글 제목 표시 */}
      <p>{post.postContent}</p> {/* 게시글 내용 표시 */}
    </div>
  );
};

export default PostDetail;
