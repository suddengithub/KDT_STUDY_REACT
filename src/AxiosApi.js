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

  // 게시글 저장 함수 (소스코드 블록 포함)
  savePost: async (postData) => {
    try {
      const response = await axios.post(API_URL, postData); // postData 전송
      return response.data;
    } catch (error) {
      console.error("Error saving post", error);
      throw error;
    }
  },

  // 게시글 ID로 특정 게시글 가져오기 (소스코드 블록 포함)
  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/${postId}`); // postId로 변경
      return response.data; // 서버에서 반환되는 데이터 구조에 맞게 데이터 처리
    } catch (error) {
      console.error("Error fetching post by ID", error);
      throw error;
    }
  },

  // 게시글 수정 함수 (소스코드 블록 포함)
  updatePost: async (postId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${postId}`, updatedData); // postId와 수정된 데이터 전달
      return response.data;
    } catch (error) {
      console.error("Error updating post", error);
      throw error;
    }
  },

  // 게시글 삭제 함수
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/${postId}`); // postId로 삭제
      return response.data;
    } catch (error) {
      console.error("Error deleting post", error);
      throw error;
    }
  },
};

export default AxiosApi;
