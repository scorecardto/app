import Share, {Social} from 'react-native-share'

const FB_ID = "874796944092147";

export async function shareToStory(social: Social.InstagramStories | Social.Snapchat, image: string) {
    await Share.shareSingle({
        appId: FB_ID,
        backgroundImage: image,
        social
    })
    return true;
}