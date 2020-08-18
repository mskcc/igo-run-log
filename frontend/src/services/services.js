import axios from 'axios';
import { BACKEND } from '../configs/config';

// // Check for authorization error
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       error.payload = error.response.data;
//       if (error.response.status === 401) {
//         // Automatically redirect client to the login page
//         window.location.href = `${AUTH_URL}/${HOME_PAGE_PATH}`;
//       }
//     }
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

// SORT ORDER

const parseResp = (resp) => {
  console.log(resp);
  
  const data = resp.data || {};
  const contents = data.data || {};
  return contents;
};

export function getRuns(query, type) {
  return axios
    .get(`${BACKEND}/api/runs/runs?query=${query}&type=${type}`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Runs: ' + error.message);
    });
}

export function getTable() {
  return axios
    .get(`${BACKEND}/api/runs/table`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Table: ' + error.message);
    });
}
