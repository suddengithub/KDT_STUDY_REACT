import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PostList from "./PostList"; // 게시글 목록 (페이지네이션)
import PostDetail from "./PostDetail"; // 게시글 상세
import PostEditor from "./PostEditor"; // 게시글 작성/수정
import ProfileDetail from "./ProfileDetail";
import ProfileList from "./ProfileList";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/postList" element={<PostList />} />{" "}
        {/* 게시글 목록 (페이지네이션) */}
        <Route path="/posts/:postId" element={<PostDetail />} />{" "}
        {/* 게시글 상세 보기 */}
        <Route path="/post-editor/:postId" element={<PostEditor />} />{" "}
        {/* 게시글 수정 */}
        <Route path="/post-editor" element={<PostEditor />} />{" "}
        {/* 새 게시글 작성 */}
        <Route path="/profiles/:profileId" element={<ProfileDetail />} />
        <Route path="/" element={<ProfileList />} />
      </Routes>
    </Router>
  );
};

export default App;
