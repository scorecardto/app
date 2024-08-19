// import API_HOST from "../../lib/API_HOST";
// import { store } from "../core/state/store";
// import axios from "redaxios";

// type ScApiGetParams = {
//   pathname: string;
//   auth: boolean;
// };

// type ScApiPostParams = {
//   pathname: string;
//   body?: any;
//   auth: boolean;
// };

// const get = async (p: ScApiGetParams) => {
//   const user = store.getState().user.user;

//   let token: string | undefined = undefined;
//   if (p.auth) {
//     token = await user?.getIdToken();
//   }

//   const headers = {
//     ...(token ? { authorization: token } : {}),
//   };

//   return await axios.get(`${API_HOST}${p.pathname}`, {
//     headers,
//   });
// };

// const post = async (p: ScApiPostParams) => {
//   const user = store.getState().user.user;

//   let token: string | undefined = undefined;
//   if (p.auth) {
//     token = await user?.getIdToken();
//   }

//   const headers = {
//     ...(token ? { authorization: token } : {}),
//   };

//   return await axios.post(`${API_HOST}${p.pathname}`, p.body, {
//     headers,
//   });
// };

// export { get, post };
