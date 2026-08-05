import axios from "axios";
import {appConfig} from "../../config/appConfig";
import { store } from "../../app/store.js";

const apiClient = axios.create({
  baseURL: appConfig.API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const adminToken = store.getState()?.authAdmin?.token;
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default apiClient;
