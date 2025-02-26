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
        setComment("");
      })
      .catch((error) => console.error("댓글을 작성하는 중 오류 발생!", error));
  };

  if (!post) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>
        뒤로 가기
      </button>

      <div style={styles.postContainer}>
        <h1 style={styles.title}>{post.postTitle}</h1>
        <p style={styles.content}>{post.postContent}</p>

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
        <h3>댓글</h3>
        <ul style={styles.commentList}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} style={styles.commentItem}>
                <p>{comment.content}</p>
                <p style={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))
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
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 15px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
