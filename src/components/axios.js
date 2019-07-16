import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // },
  // timeout: 5000,
});

export default instance;
