import Share, { Social } from "react-native-share";
import * as Clipboard from "expo-clipboard";

const FB_ID = "874796944092147";

export async function shareToInsta(image: string, url: string) {
  await Share.shareSingle({
    appId: FB_ID,
    backgroundImage: image,
    social: Social.InstagramStories,
  });

  setTimeout(() => {
    let count = 0;
    const i = setInterval(() => {
      if (++count > 10) {
        clearInterval(i);
      }
      Clipboard.setUrlAsync(url);
      console.log("trying to copy..");
    }, 50);
  }, 500);
}
