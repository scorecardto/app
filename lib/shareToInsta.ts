import Share, {Social} from 'react-native-share'

const FB_ID = "874796944092147";

export async function shareToInsta(image: string) {
    await Share.shareSingle({
        appId: FB_ID,
        backgroundImage: image,
        social: Social.InstagramStories
    })
}