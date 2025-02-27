import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import AxiosApi from "./AxiosApi"; // AxiosApi 임포트
import "./PostPagination.css";

const PostPagination = ({ fetchPosts }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6; // 한 페이지당 게시글 수

  useEffect(() => {
    AxiosApi.getPosts({ page, size: pageSize })
      .then((data) => {
        setTotalPages(data.totalPages);
        fetchPosts(page, pageSize); // 상위 컴포넌트에서 posts 업데이트
      })
      .catch((error) => {
        console.error("게시글 불러오는 중 오류 발생!", error);
      });
  }, [page]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="paginationContainer">
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
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
      />
    </div>
  );
};

export default PostPagination;
