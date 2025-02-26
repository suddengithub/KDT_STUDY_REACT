import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosApi from "./AxiosApi"; // AxiosApi import

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글과 댓글 데이터 불러오기
    AxiosApi.getPostById(postId)
      .then((response) => setPost(response))
      .catch((error) =>
        console.error("게시글을 불러오는 중 오류 발생!", error)
      );

    AxiosApi.getComments(postId)
      .then((response) => setComments(response))
      .catch((error) =>
        console.error("댓글 목록을 불러오는 중 오류 발생!", error)
      );
  }, [postId]);

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
        setComment(""); // 댓글 작성 후 입력창 비우기
      })
      .catch((error) => console.error("댓글을 작성하는 중 오류 발생!", error));
  };

  const handleLike = () => {
    AxiosApi.likePost(postId)
      .then((updatedPost) => {
        setPost(updatedPost); // 좋아요를 누른 후 게시글 업데이트
      })
      .catch((error) =>
        console.error("좋아요를 등록하는 중 오류 발생!", error)
      );
  };

  const handleUnlike = () => {
    AxiosApi.unlikePost(postId)
      .then((updatedPost) => {
        setPost(updatedPost); // 좋아요를 취소한 후 게시글 업데이트
      })
      .catch((error) => console.error("좋아요 취소하는 중 오류 발생!", error));
  };

  if (!post) return <div style={styles.loading}>Loading...</div>;

  // 게시글 작성 시간 포맷 처리 (LocalDateTime -> Date 객체로 변환 후 포맷)
  const formattedPostDate = new Date(post.postCreatedAt); // LocalDateTime 형식이므로 Date 객체로 변환
  const postDateString = !isNaN(formattedPostDate)
    ? formattedPostDate.toLocaleString() // 유효한 날짜라면 포맷 적용
    : "작성일 정보 없음"; // 유효하지 않으면 기본 텍스트 출력

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>
        뒤로 가기
      </button>

      <div style={styles.postContainer}>
        <h1 style={styles.title}>{post.postTitle}</h1>
        <p style={styles.content}>{post.postContent}</p>

        {/* 게시글 작성 시간 출력 */}
        <p style={styles.postDate}>{postDateString}</p>

        {/* 좋아요 갯수 출력 */}
        <div style={styles.likesContainer}>
          <span>좋아요 {post.likesCount}</span>{" "}
          {/* likesCount로 좋아요 갯수 표시 */}
          <button onClick={handleLike} style={styles.likeButton}>
            좋아요
          </button>
          <button onClick={handleUnlike} style={styles.unlikeButton}>
            좋아요 취소
          </button>
        </div>

        {post.codeBlocks?.length > 0 && (
          <div style={styles.codeContainer}>
            {post.codeBlocks.map((block, index) => (
              <div key={index} style={styles.codeBlock}>
                <h3>{block.language}</h3>
                <pre style={styles.code}>{block.code}</pre>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(`/post-editor/${postId}`)}
          style={styles.editButton}
        >
          수정하기
        </button>
      </div>

      <div style={styles.commentSection}>
        <h3>댓글 ({comments.length})</h3> {/* 댓글 수 표시 */}
        <ul style={styles.commentList}>
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              const formattedCommentDate = new Date(comment.createdAt);
              const commentDateString = !isNaN(formattedCommentDate)
                ? formattedCommentDate.toLocaleString()
                : "작성일 정보 없음"; // 유효하지 않으면 기본 텍스트 출력

              return (
                <li key={index} style={styles.commentItem}>
                  <p>{comment.content}</p>
                  <p style={styles.commentDate}>{commentDateString}</p>
                </li>
              );
            })
          ) : (
            <li style={styles.noComment}>댓글이 없습니다.</li>
          )}
        </ul>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요"
          style={styles.commentInput}
        />
        <button onClick={handleCommentSubmit} style={styles.commentButton}>
          댓글 작성
        </button>
      </div>
    </div>
  );
};

const styles = {
  backButton: {
    display: "block", // 줄바꿈 적용
    padding: "10px 15px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px", // 아래 요소와 간격 조정
  },
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  postContainer: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  content: {
    fontSize: "16px",
    lineHeight: "1.6",
  },
  postDate: {
    fontSize: "14px",
    color: "gray",
    marginTop: "10px",
  },
  likesContainer: {
    marginTop: "20px",
  },
  likeButton: {
    padding: "5px 10px",
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  unlikeButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  codeContainer: {
    marginTop: "20px",
  },
  codeBlock: {
    backgroundColor: "#272822",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px",
  },
  code: {
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  editButton: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
  commentSection: {
    marginTop: "30px",
    textAlign: "left",
  },
  commentList: {
    listStyle: "none",
    padding: 0,
  },
  commentItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  commentDate: {
    fontSize: "0.9em",
    color: "gray",
  },
  noComment: {
    padding: "10px",
    textAlign: "center",
    color: "gray",
  },
  commentInput: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
  },
  commentButton: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
  },
};

export default PostDetail;
