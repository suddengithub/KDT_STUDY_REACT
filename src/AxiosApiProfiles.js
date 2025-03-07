import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

// 프로필 관련 API(프로필)
const AxiosApiProfiles = {
  // 프로필 추가
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(PROFILE_API_URL, profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile", error);
      throw error;
    }
  },

  // 프로필 조회
  getProfileList: async () => {
    try {
      const response = await axios.get(PROFILE_API_URL); // 전체 프로필 목록을 불러오는 API
      return response.data;
    } catch (error) {
      console.error("Error fetching profile list", error);
      throw error;
    }
  },

  // 프로필 특정 조회
  getProfileById: async (profileId) => {
    try {
      const response = await axios.get(`${PROFILE_API_URL}/${profileId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile by ID", error);
      throw error;
    }
  },

  // 프로필 수정
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

  // 프로필 삭제
  deleteProfile: async (profileId) => {
    try {
      const response = await axios.delete(`${PROFILE_API_URL}/${profileId}`);
      if (response.status === 204) {
        console.log("게시글 삭제 성공:", profileId);
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
};

export default AxiosApiProfiles;
