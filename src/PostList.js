import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "./AxiosApi";
import PostPagination from "./PostPagination"; // PostPagination 추가
import "./PostList.css"; // CSS 파일을 임포트

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [commentCounts, setCommentCounts] = useState({}); // 댓글 수를 저장할 상태
  const navigate = useNavigate();

  const fetchPosts = (page, pageSize) => {
    AxiosApi.getPosts({ page, size: pageSize })
      .then((data) => {
        setPosts(data.posts);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error("게시글을 불러오는 중 오류 발생!", error);
      });
  };

  useEffect(() => {
    fetchPosts(1, 6); // 처음엔 1페이지, 6개씩 불러오기
  }, []);

  useEffect(() => {
    // 게시글의 댓글 수를 비동기적으로 가져옴
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const comments = await AxiosApi.getComments(post.postId);

          // 댓글과 대댓글을 모두 포함한 총 댓글 수 계산
          const totalComments = comments.reduce(
            (count, comment) =>
              count + 1 + (comment.replies ? comment.replies.length : 0),
            0
          );
          counts[post.postId] = totalComments;
        } catch (error) {
          console.error(
            `댓글 수를 불러오는 중 오류 발생: ${post.postId}`,
            error
          );
        }
      }
      setCommentCounts(counts);
    };

    if (posts.length > 0) {
      fetchCommentCounts();
    }
  }, [posts]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container">
      <h1 className="header">게시판 목록</h1>
      <button
        onClick={() => navigate("/post-editor")}
        className="newPostButton"
      >
        새 게시글 작성
      </button>

      {/* 게시글 목록 */}
      <ul className="postList">
        {posts.map((post) => {
          const formattedPostDate = new Date(post.postCreatedAt);
          const postDateString = !isNaN(formattedPostDate)
            ? formattedPostDate.toLocaleString()
            : "작성일 정보 없음";
          const commentCount = commentCounts[post.postId] || 0;

          return (
            <li
              key={post.postId}
              onClick={() => handlePostClick(post.postId)}
              className="postItem"
            >
              <p className="postDate">{postDateString}</p>{" "}
              {/* 시간 왼쪽에 배치 */}
              <h2 className="postTitle">{post.postTitle}</h2>{" "}
              {/* 제목 가운데 배치 */}
              <p className="commentCount">댓글 {commentCount}개</p>
              <hr className="divider" />
            </li>
          );
        })}
      </ul>

      {/* 전체 게시글 수 */}
      <div className="paginationContainer">
        <span className="totalPosts">전체 게시글 수: {totalElements}</span>
      </div>

      {/* 페이지네이션 컴포넌트 적용 */}
      <PostPagination fetchPosts={fetchPosts} />
    </div>
  );
};

export default PostList;
