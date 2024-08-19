export default interface ClubPost {
  clubName: string;
  description: string;
  postDate: number;
  eventDate?: number;
  clubCode: string;
  heroColor: string;
  picture?: string;
  link?: string;
}
