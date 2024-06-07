import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 3000
});

// 拦截器
axiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
      return error.response;
  }
);

axiosInstance.interceptors.request.use(function (config) {
  console.log('拦截')
  const accessToken = localStorage.getItem('access_token');

  if(accessToken) {
      config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})

export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/login', {
        username, password
    });
}
