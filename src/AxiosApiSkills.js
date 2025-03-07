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
};

export default AxiosApiSkills;
