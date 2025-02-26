import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import AxiosApi from "./AxiosApi";
import "./PostList.css"; // CSS 파일을 임포트

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commentCounts, setCommentCounts] = useState({}); // 댓글 수를 저장할 상태
  const navigate = useNavigate();

  useEffect(() => {
    AxiosApi.getPosts({ page, size: pageSize })
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error("게시글을 불러오는 중 오류 발생!", error);
      });
  }, [page, pageSize]);

  useEffect(() => {
    // 게시글의 댓글 수를 비동기적으로 가져옴
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const commentCount = await AxiosApi.getComments(post.postId);
          counts[post.postId] = commentCount.length;
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

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
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
              <h2 className="postTitle">{post.postTitle}</h2>
              <p className="postDate">{postDateString}</p>
              <p className="commentCount">댓글 {commentCount}개</p>
              <hr className="divider" />
            </li>
          );
        })}
      </ul>

      <div className="paginationContainer">
        <span className="totalPosts">전체 게시글 수: {totalElements}</span>
        <ReactPaginate
          previousLabel={"← 이전"}
          nextLabel={"다음 →"}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page"}
          previousClassName={"previous"}
          nextClassName={"next"}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
        />
      </div>
    </div>
  );
};

export default PostList;
