import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import AxiosApi from "./AxiosApi"; // AxiosApi 임포트
import "./PostPagination.css";

const PostPagination = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태 (초기값을 빈 배열로 설정)
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const pageSize = 6; // 한 페이지당 게시글 수 (6개로 설정)

  useEffect(() => {
    // 게시글 목록을 불러옵니다.
    AxiosApi.getPosts(page, pageSize)
      .then((data) => {
        setPosts(data.posts || []); // posts가 없을 경우 빈 배열로 설정
        setTotalPages(data.totalPages); // 전체 페이지 수 업데이트
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, [page]); // page가 변경될 때마다 호출

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1); // react-paginate는 0-based index를 사용하므로 +1을 해줘야 합니다.
  };

  return (
    <div className="post-container">
      <h1 className="post-header">게시판 목록</h1>
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => {
            const formattedPostDate = new Date(post.postCreatedAt);
            const postDateString = !isNaN(formattedPostDate)
              ? formattedPostDate.toLocaleString()
              : "작성일 정보 없음";
            return (
              <li key={post.postId} className="post-item">
                <h2 className="post-title">{post.postTitle}</h2>
                <p className="post-date">{postDateString}</p>
                <hr className="post-divider" />
              </li>
            );
          })
        ) : (
          <p>게시글이 없습니다.</p> // 게시글이 없을 경우 표시할 문구
        )}
      </ul>

      {/* 페이지네이션 */}
      <ReactPaginate
        previousLabel={"← 이전"}
        nextLabel={"다음 →"}
        pageCount={totalPages}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
        pageClassName="page"
        previousClassName="previous"
        nextClassName="next"
        pageRangeDisplayed={5} // 한 번에 보여주는 페이지 수
        marginPagesDisplayed={2} // 양옆으로 보여주는 페이지 수
      />
    </div>
  );
};

export default PostPagination;
