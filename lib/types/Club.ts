import ClubPost from "./ClubPost";

export default interface Club {
  name: string;
  code: string;
  isMember: boolean;
  isOwner: boolean;
  memberCount: number;
  posts: ClubPost[];
  heroColor: string;
  picture?: string;
  omitInClubList?: boolean;
}
