import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

const AxiosApiCareers = {
  // 경력 목록 조회
  getCareerByProfileId: async (profileId) => {
    try {
      const response = await axios.get(
        `${PROFILE_API_URL}/${profileId}/careers`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching careers", error);
      throw error;
    }
  },

  // 경력 추가
  createCareer: async (profileId, careerData) => {
    try {
      const response = await axios.post(
        `${PROFILE_API_URL}/${profileId}/careers`,
        careerData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating career", error);
      throw error;
    }
  },

  // 경력 수정
  updateCareer: async (profileId, careerId, careerData) => {
    try {
      const response = await axios.put(
        `${PROFILE_API_URL}/${profileId}/careers/${careerId}`,
        careerData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating career", error);
      throw error;
    }
  },

  // 경력 삭제
  deleteCareer: async (profileId, careerId) => {
    try {
      await axios.delete(`${PROFILE_API_URL}/${profileId}/careers/${careerId}`);
    } catch (error) {
      console.error("Error deleting career", error);
      throw error;
    }
  },
};

export default AxiosApiCareers;
