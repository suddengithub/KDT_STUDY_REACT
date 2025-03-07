import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

// 프로필 관련 API
const AxiosApiProfiles = {
  // 프로필 작성
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(PROFILE_API_URL, profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile", error);
      throw error;
    }
  },

  // 프로필 목록 조회
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
};

export default AxiosApiProfiles;
