import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi";
import "./PostDetail.css"; // CSS 파일 분리

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0); // 🔹 좋아요 상태 추가
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosApi.getPostById(postId)
      .then((response) => {
        setPost(response);
        setLikesCount(response.likesCount); // 🔹 초기 좋아요 개수 설정
      })
      .catch((error) =>
        console.error("게시글을 불러오는 중 오류 발생!", error)
      );

    AxiosApi.getComments(postId)
      .then((response) => setComments(response))
      .catch((error) =>
        console.error("댓글 목록을 불러오는 중 오류 발생!", error)
      );
  }, [postId]);

  const handleLike = () => {
    AxiosApi.likePost(postId)
      .then(() => setLikesCount((prev) => prev + 1)) // 🔹 UI 즉시 업데이트
      .catch((error) => console.error("좋아요 추가 중 오류 발생!", error));
  };

  const handleUnlike = () => {
    AxiosApi.unlikePost(postId)
      .then(() => setLikesCount((prev) => Math.max(prev - 1, 0))) // 🔹 최소 0 이하로 내려가지 않도록 설정
      .catch((error) => console.error("좋아요 취소 중 오류 발생!", error));
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요!");
      return;
    }

    const newComment = { content: comment, postId };

    AxiosApi.saveComment(postId, newComment)
      .then((savedComment) => {
        setComments((prevComments) => [...prevComments, savedComment]);
        setComment("");
      })
      .catch((error) => console.error("댓글을 작성하는 중 오류 발생!", error));
  };

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate("/")} className="backButton">
        뒤로 가기
      </button>

      <div className="postContainer">
        <h1 className="title">{post.postTitle}</h1>
        <p className="content">{post.postContent}</p>
        <p className="postDate">
          {new Date(post.postCreatedAt).toLocaleString()}
        </p>

        <div className="likesContainer">
          <span>좋아요 {likesCount}</span> {/* 🔹 likesCount 상태로 변경 */}
          <button className="likeButton" onClick={handleLike}>
            좋아요
          </button>
          <button className="unlikeButton" onClick={handleUnlike}>
            좋아요 취소
          </button>
        </div>

        {post.codeBlocks?.length > 0 && (
          <div className="codeContainer">
            {post.codeBlocks.map((block, index) => (
              <div key={index} className="codeBlock">
                <h3>{block.language}</h3>
                <pre className="code">{block.code}</pre>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(`/post-editor/${postId}`)}
          className="editButton"
        >
          수정하기
        </button>
      </div>

      <div className="commentSection">
        <h3>댓글 ({comments.length})</h3>
        <ul className="commentList">
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              const formattedCommentDate = new Date(
                comment.createdAt
              ).toLocaleString();
              return (
                <li key={index} className="commentItem">
                  <p>{comment.content}</p>
                  <p className="commentDate">{formattedCommentDate}</p>
                </li>
              );
            })
          ) : (
            <li className="noComment">댓글이 없습니다.</li>
          )}
        </ul>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요"
          className="commentInput"
        />
        <button onClick={handleCommentSubmit} className="commentButton">
          댓글 작성
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
