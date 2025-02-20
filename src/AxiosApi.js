import axios from "axios";

const API_URL = "http://localhost:8111/api/posts";

const AxiosApi = {
  getPosts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts", error);
      throw error;
    }
  },
  savePost: async (postData) => {
    try {
      const response = await axios.post(API_URL, postData);
      return response.data;
    } catch (error) {
      console.error("Error saving post", error);
      throw error;
    }
  },
};

export default AxiosApi;
