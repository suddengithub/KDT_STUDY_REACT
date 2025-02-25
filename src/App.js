import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import PostEditor from "./PostEditor"; // PostEditor 임포트

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/post-editor/:postId" element={<PostEditor />} />{" "}
        {/* 수정 경로 추가 */}
        <Route path="/post-editor" element={<PostEditor />} />{" "}
        {/* 새 게시글 작성 경로 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
