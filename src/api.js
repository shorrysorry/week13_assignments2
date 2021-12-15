import axios from "axios";

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: {
    Authorization: "KakaoAK 05f657b42d1673392d4036680c1e34f7"
  }
});

// search book api
export const bookSearch = (params) => {
  return Kakao.get("/v3/search/book?target=title", { params });
};
