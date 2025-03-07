import axios from "axios";

const POST_API_URL = "http://localhost:8111/api/posts";

const AxiosApiComments = {
  // 댓글 추가
  saveComment: async (postId, commentData) => {
    try {
      const response = await axios.post(
        `${POST_API_URL}/${postId}/comments`,
        commentData
      );
      return response.data; // 댓글 생성 후, 댓글 데이터 반환
    } catch (error) {
      console.error("Error saving comment", error);
      throw error;
    }
  },

  // 게시글의 댓글 목록을 가져오는 함수 (대댓글 포함)
  getComments: async (postId) => {
    try {
      const response = await axios.get(`${POST_API_URL}/${postId}/comments`);
      return response.data; // 댓글 목록과 대댓글 목록 반환
    } catch (error) {
      console.error("Error fetching comments", error);
      throw error;
    }
  },

  // 댓글 수정 함수
  updateComment: async (postId, commentId, commentData) => {
    if (!commentId) {
      console.error("Invalid comment ID:", commentId);
      throw new Error("Invalid comment ID");
    }

    try {
      const response = await axios.put(
        `${POST_API_URL}/${postId}/comments/${commentId}`,
        commentData
      );
      return response.data; // 수정된 댓글 데이터 반환
    } catch (error) {
      console.error("Error updating comment", error);
      throw error;
    }
  },

  // 댓글 삭제 함수 (대댓글 포함)
  deleteComment: async (postId, commentId) => {
    if (!commentId) {
      console.error("Invalid comment ID:", commentId);
      throw new Error("Invalid comment ID");
    }

    try {
      const response = await axios.delete(
        `${POST_API_URL}/${postId}/comments/${commentId}`
      );
      if (response.status === 204) {
        console.log("댓글 삭제 성공:", commentId);
        return { message: "댓글 삭제 성공" };
      } else {
        console.error("댓글 삭제 실패: 상태 코드", response.status);
        throw new Error("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting comment", error);
      throw error;
    }
  },

  // 대댓글 저장 함수
  saveReply: async (postId, parentCommentId, replyData) => {
    try {
      const response = await axios.post(`${POST_API_URL}/${postId}/comments`, {
        ...replyData,
        parentCommentId,
      });
      return response.data; // 대댓글 생성 후, 대댓글 데이터 반환
    } catch (error) {
      console.error("Error saving reply", error);
      throw error;
    }
  },

  // 대댓글 목록 조회 함수
  getReplies: async (postId, parentCommentId) => {
    try {
      const response = await axios.get(
        `${POST_API_URL}/${postId}/comments/${parentCommentId}/replies`
      );
      return response.data; // 대댓글 목록 반환
    } catch (error) {
      console.error("Error fetching replies", error);
      throw error;
    }
  },
};

export default AxiosApiComments;
