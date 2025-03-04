import axios from "axios";

const POST_API_URL = "http://localhost:8111/api/posts";
const PROFILE_API_URL = "http://localhost:8111/api/profiles";

const AxiosApi = {
  // 게시글 목록을 가져오는 함수 (페이지네이션 적용)
  getPosts: async ({ page, size }) => {
    try {
      const response = await axios.get(POST_API_URL, {
        params: { page: page - 1, size }, // 페이지는 0부터 시작하므로 -1을 해줍니다.
      });

      // 서버에서 반환된 데이터 구조: posts, totalPages, totalElements, pageNumber, pageSize
      return {
        posts: response.data.content, // 게시글 목록
        totalPages: response.data.totalPages, // 전체 페이지 수
        totalElements: response.data.totalElements, // 전체 게시글 수
        pageNumber: response.data.pageNumber, // 현재 페이지 번호
        pageSize: response.data.pageSize, // 한 페이지에 보여줄 게시글 수
      };
    } catch (error) {
      console.error("Error fetching posts", error);
      throw error;
    }
  },

  // 게시글 저장 함수 (createPost)
  savePost: async (postData) => {
    try {
      const response = await axios.post(POST_API_URL, postData); // postData 전송
      return response.data;
    } catch (error) {
      console.error("Error saving post", error);
      throw error;
    }
  },

  // 게시글 ID로 특정 게시글 가져오기
  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${POST_API_URL}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID", error);
      throw error;
    }
  },

  // 게시글 수정 함수 (updatePost)
  updatePost: async (postId, updatedData) => {
    try {
      const response = await axios.put(
        `${POST_API_URL}/${postId}`,
        updatedData
      );
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
      const response = await axios.delete(`${POST_API_URL}/${postId}`);
      if (response.status === 204) {
        console.log("게시글 삭제 성공:", postId);
        return { message: "게시글 삭제 성공" };
      } else {
        console.error("게시글 삭제 실패: 상태 코드", response.status);
        throw new Error("게시글 삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting post", error);
      throw error;
    }
  },

  // 댓글 저장 함수 (createComment)
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
  // 게시글 수정 시, 기존 댓글 수와 코드 블록 갯수 반영 함수
  updatePostWithCommentsAndCodeBlocks: async (postId, updatedData) => {
    try {
      // 기존 게시글 수정
      const postResponse = await axios.put(
        `${POST_API_URL}/${postId}`,
        updatedData
      );

      if (postResponse.status === 200) {
        const updatedPost = postResponse.data;

        // 댓글 수 업데이트
        const commentsResponse = await axios.get(
          `${POST_API_URL}/${postId}/comments`
        );
        updatedPost.commentCount = commentsResponse.data.length;

        // 코드 블록 수 업데이트 (코드 블록 갯수는 서버에서 관리)
        const codeBlockResponse = await axios.get(
          `${POST_API_URL}/${postId}/codeblocks`
        );
        updatedPost.codeBlockCount = codeBlockResponse.data.length;

        console.log("게시글 수정 후 데이터:", updatedPost);
        return updatedPost;
      } else {
        console.error("게시글 수정 실패: 상태 코드", postResponse.status);
        throw new Error("게시글 수정 실패");
      }
    } catch (error) {
      console.error("Error updating post with comments and code blocks", error);
      throw error;
    }
  },

  // 게시글 좋아요 증가
  likePost: async (postId) => {
    try {
      const response = await axios.post(`${POST_API_URL}/${postId}/like`);
      return response.data; // 좋아요 증가 후 게시글 데이터 반환
    } catch (error) {
      console.error("Error liking post", error);
      throw error;
    }
  },

  // 게시글 좋아요 취소 (unlike)
  unlikePost: async (postId) => {
    try {
      const response = await axios.post(`${POST_API_URL}/${postId}/unlike`);
      return response.data; // 좋아요 취소 후 게시글 데이터 반환
    } catch (error) {
      console.error("Error unliking post", error);
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
  // 🔹 프로필 관련 API
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(PROFILE_API_URL, profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile", error);
      throw error;
    }
  },

  getProfileById: async (profileId) => {
    try {
      const response = await axios.get(`${PROFILE_API_URL}/${profileId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile by ID", error);
      throw error;
    }
  },

  updateProfile: async (profileId, updatedData) => {
    try {
      const response = await axios.put(
        `${PROFILE_API_URL}/${profileId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile", error);
      throw error;
    }
  },
};

export default AxiosApi;
