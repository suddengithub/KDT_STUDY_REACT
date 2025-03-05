import axios from "axios";

const PROFILE_API_URL = "http://localhost:8111/api/profiles";

const AxiosApiProfiles = {
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

export default AxiosApiProfiles;
