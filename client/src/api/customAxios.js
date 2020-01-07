import * as axios from "axios";

const token = localStorage.getItem("token") || "";

export const customAxios = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`
  }
});

window.customAxios = customAxios;
