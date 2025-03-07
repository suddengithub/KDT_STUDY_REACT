import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

const AxiosApiSkills = {
  // 기술 목록 조회
  getSkillByProfileId: async (profileId) => {
    try {
      const response = await axios.get(
        `${PROFILE_API_URL}/${profileId}/skills`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skills", error);
      throw error;
    }
  },

  // 기술 작성
  createSkill: async (profileId, skill) => {
    try {
      const response = await axios.post(
        `${PROFILE_API_URL}/${profileId}/skills`,
        skill
      );
      return response.data;
    } catch (error) {
      console.error("Error creating skill", error);
      throw error;
    }
  },

  // 기술 수정
  updateSkill: async (profileId, skillId, skill) => {
    try {
      const response = await axios.put(
        `${PROFILE_API_URL}/${profileId}/skills/${skillId}`,
        skill
      );
      return response.data;
    } catch (error) {
      console.error("Error updating skill", error);
      throw error;
    }
  },

  // 기술 삭제
  deleteSkill: async (profileId, skillId) => {
    try {
      await axios.delete(`${PROFILE_API_URL}/${profileId}/skills/${skillId}`);
    } catch (error) {
      console.error("Error deleting skill", error);
      throw error;
    }
  },
};

export default AxiosApiSkills;
