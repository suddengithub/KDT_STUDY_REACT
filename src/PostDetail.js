import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId를 가져옴
  const [post, setPost] = useState(null); // 게시글 상태
  const [comment, setComment] = useState(""); // 댓글 작성 상태
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const navigate = useNavigate();

  // 게시글과 댓글을 초기 로딩시 불러오기
  useEffect(() => {
    // 게시글 가져오기
    AxiosApi.getPostById(postId)
      .then((response) => {
        setPost(response);
      })
      .catch((error) => {
        console.error("게시글을 불러오는 중 오류 발생!", error);
      });

    // 댓글 목록 가져오기
    AxiosApi.getComments(postId)
      .then((response) => {
        setComments(response); // 댓글 목록을 상태에 저장
      })
      .catch((error) => {
        console.error("댓글 목록을 불러오는 중 오류 발생!", error);
      });
  }, [postId]); // postId가 변경될 때마다 호출

  // 댓글 변경 핸들러
  const handleCommentChange = (e) => {
    setComment(e.target.value); // 댓글 상태 업데이트
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요!");
      return;
    }

    const newComment = {
      content: comment, // 댓글 내용
      postId: postId, // 관련 게시글의 postId
    };

    // 댓글을 서버에 저장하는 API 호출
    AxiosApi.saveComment(postId, newComment)
      .then((savedComment) => {
        // 새로운 댓글을 목록에 추가하고 상태 업데이트
        setComments((prevComments) => [...prevComments, savedComment]);
        setComment(""); // 댓글 입력란 초기화
      })
      .catch((error) => {
        console.error("댓글을 작성하는 중 오류 발생!", error);
      });
  };

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

      {/* 댓글 목록 표시 */}
      <div>
        <h3>댓글</h3>
        <ul>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index}>{comment.content}</li>
            ))
          ) : (
            <li>댓글이 없습니다.</li>
          )}
        </ul>
      </div>

      {/* 댓글 입력란과 제출 버튼 */}
      <div>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요"
          style={{ width: "100%", height: "100px" }}
        />
        <button
          onClick={handleCommentSubmit}
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
          댓글 작성
        </button>
      </div>

      {/* ✅ 수정하기 버튼 */}
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
