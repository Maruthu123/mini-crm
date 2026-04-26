import axios from "axios";

const instance = axios.create({
  baseURL: "https://mini-crm-backend-3is6.onrender.com"
});

export default instance;