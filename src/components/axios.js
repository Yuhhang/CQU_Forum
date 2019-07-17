import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  withCredentials: true,
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // },
});

export default instance;
