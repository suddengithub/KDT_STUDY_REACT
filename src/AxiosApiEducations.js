import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

// 학력 관련 API
const AxiosApiEducations = {
  // 학력 추가
  createEducation: async (profileId, educationData) => {
    try {
      const response = await axios.post(
        `${PROFILE_API_URL}/${profileId}/educations`,
        educationData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding education", error);
      throw error;
    }
  },

  // 학력 목록 조회
  getEducationByProfileId: async (profileId) => {
    try {
      const response = await axios.get(
        `${PROFILE_API_URL}/${profileId}/educations`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching educations", error);
      throw error;
    }
  },

  // 학력 수정
  updateEducation: async (profileId, educationId, educationData) => {
    try {
      const response = await axios.put(
        `${PROFILE_API_URL}/${profileId}/educations/${educationId}`,
        educationData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating education", error);
      throw error;
    }
  },

  // 학력 삭제
  deleteEducation: async (profileId, educationId) => {
    try {
      await axios.delete(
        `${PROFILE_API_URL}/${profileId}/educations/${educationId}`
      );
    } catch (error) {
      console.error("Error deleting education", error);
      throw error;
    }
  },
};

export default AxiosApiEducations;
