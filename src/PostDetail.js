import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi";
import "./PostDetail.css"; // CSS 파일 분리

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0); // 좋아요 상태
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await AxiosApi.getPostById(postId);
        setPost(postResponse);
        setLikesCount(postResponse.likesCount); // 초기 좋아요 개수 설정

        const commentsResponse = await AxiosApi.getComments(postId);
        setComments(commentsResponse);
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생!", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchPostData();
  }, [postId]);

  // 좋아요 추가
  const handleLike = () => {
    AxiosApi.likePost(postId)
      .then(() => setLikesCount((prev) => prev + 1)) // UI 즉시 업데이트
      .catch((error) => console.error("좋아요 추가 중 오류 발생!", error));
  };

  // 좋아요 취소
  const handleUnlike = () => {
    AxiosApi.unlikePost(postId)
      .then(() => setLikesCount((prev) => Math.max(prev - 1, 0))) // 최소 0 이하로 내려가지 않도록 설정
      .catch((error) => console.error("좋아요 취소 중 오류 발생!", error));
  };

  // 댓글 입력 값 처리
  const handleCommentChange = (e) => setComment(e.target.value);

  // 댓글 제출 처리
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

  // 댓글 수정 시
  const handleCommentEdit = (commentId, updatedContent) => {
    const updatedComment = { content: updatedContent, postId };

    AxiosApi.updateComment(postId, String(commentId), updatedComment)
      .then((updatedComment) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.commentId === commentId ? updatedComment : comment
          )
        );
      })
      .catch((error) => console.error("댓글 수정 중 오류 발생!", error));
  };

  // 댓글 삭제 시
  const handleCommentDelete = (commentId) => {
    AxiosApi.deleteComment(postId, String(commentId))
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
      })
      .catch((error) => console.error("댓글 삭제 중 오류 발생!", error));
  };

  // 게시글 삭제 처리
  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      AxiosApi.deletePost(postId)
        .then(() => {
          alert("게시글이 삭제되었습니다.");
          navigate("/"); // 삭제 후 메인 페이지로 이동
        })
        .catch((error) => console.error("게시글 삭제 중 오류 발생!", error));
    }
  };

  if (loading) return <div className="loading">Loading...</div>; // 로딩 상태 표시

  if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>; // 게시글이 없는 경우 처리

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
          <span>좋아요 {likesCount}</span>
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

        <button onClick={handleDelete} className="deleteButton">
          삭제하기
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

                  {/* 댓글 수정 및 삭제 기능 */}
                  <div className="commentActions">
                    <button
                      onClick={() => {
                        const updatedContent = prompt(
                          "댓글을 수정하세요",
                          comment.content
                        );
                        if (updatedContent) {
                          handleCommentEdit(comment.commentId, updatedContent);
                        }
                      }}
                      className="editCommentButton"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleCommentDelete(comment.commentId)}
                      className="deleteCommentButton"
                    >
                      삭제
                    </button>
                  </div>
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
