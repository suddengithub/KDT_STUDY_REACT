import axios from "axios";

const API_URL = "http://localhost:8111/api/posts";

const AxiosApi = {
  // 게시글 목록을 가져오는 함수
  getPosts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts", error);
      throw error;
    }
  },

  // 게시글 저장 함수
  savePost: async (postData) => {
    try {
      const response = await axios.post(API_URL, postData); // postData 전송
      return response.data;
    } catch (error) {
      console.error("Error saving post", error);
      throw error;
    }
  },

  // 게시글 ID로 특정 게시글 가져오기
  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID", error);
      throw error;
    }
  },

  // 게시글 수정 함수
  updatePost: async (postId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${postId}`, updatedData);
      if (response.status === 200) {
        console.log("게시글 수정 성공:", response.data);
        return response.data;
      } else {
        console.error("게시글 수정 실패: 상태 코드", response.status);
        throw new Error("게시글 수정 실패");
      }
    } catch (error) {
      console.error("Error updating post", error);
      throw error;
    }
  },

  // 게시글 삭제 함수
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post", error);
      throw error;
    }
  },

  // 댓글 저장 함수
  saveComment: async (postId, commentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${postId}/comments`,
        commentData
      );
      return response.data; // 댓글 생성 후, 댓글 데이터 반환
    } catch (error) {
      console.error("Error saving comment", error);
      throw error;
    }
  },

  // 게시글의 댓글 목록을 가져오는 함수
  getComments: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/${postId}/comments`);
      return response.data; // CommentResponseDto 형태로 반환될 데이터 처리
    } catch (error) {
      console.error("Error fetching comments", error);
      throw error;
    }
  },
};

export default AxiosApi;
