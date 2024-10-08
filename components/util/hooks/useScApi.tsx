import { useCallback, useContext, useMemo } from "react";
import API_HOST from "../../../lib/API_HOST";
import axios, { Response } from "redaxios";
import { MobileDataContext } from "../../core/context/MobileDataContext";
function useScApi() {
  const { user } = useContext(MobileDataContext);

  type ScApiGetParams = {
    pathname: string;
    auth: boolean;
    params?: {
      [x: string]: string;
    };
  };

  const get = useCallback(
    async (p: ScApiGetParams): Promise<Response<any>> => {
      let token: string | undefined = undefined;
      if (p.auth) {
        token = await user?.getIdToken();
      }

      const headers = {
        ...(token ? { authorization: token } : {}),
      };

      // const params = new URLSearchParams(p.params);

      return await axios.get(`${API_HOST}${p.pathname}`, {
        headers,
        params: p.params,
      });
    },
    [user]
  );

  type ScApiPostParams = {
    pathname: string;
    body?: any;
    auth: boolean;
  };
  const post = useCallback(
    async (p: ScApiPostParams): Promise<Response<any>> => {
      let token: string | undefined = undefined;
      if (p.auth) {
        token = await user?.getIdToken();
      }

      const headers = {
        ...(token ? { authorization: token } : {}),
      };

      return await axios.post(`${API_HOST}${p.pathname}`, p.body, {
        headers,
      });
    },
    [user]
  );

  return useMemo(() => {
    return {
      post,
      get,
    };
  }, [post, get, user]);
}
export default useScApi;
