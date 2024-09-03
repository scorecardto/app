import { useDispatch } from "react-redux";
import { setClubs, setRecentPosts } from "../../core/state/social/socialSlice";
import useScApi from "./useScApi";

function useSocial() {
  const dispatch = useDispatch();

  const api = useScApi();
  const refreshClubs = async () => {
    const r = await api.get({
      auth: true,
      pathname: "/v1/clubs/list",
    });

    dispatch(setClubs(r.data.clubs));
    dispatch(setRecentPosts(r.data.recentPosts));
  };
  return {
    refreshClubs,
  };
}

export default useSocial;
