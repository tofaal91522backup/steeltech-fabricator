import apiClient from "./apiClient.js";

const httpClient = {
  get: async (url) => (await apiClient.get(url)).data,

  post: async (url, data) => (await apiClient.post(url, data)).data,

  put: async (url, data) => (await apiClient.put(url, data)).data,

  patch: async (url, data) => (await apiClient.patch(url, data)).data,

  delete: async (url) => (await apiClient.delete(url)).data,

  postFormData: async (url, formData) =>
    (
      await apiClient.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
};

export default httpClient;
