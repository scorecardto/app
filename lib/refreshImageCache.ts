import * as FileSystem from "expo-file-system";
import axios from "redaxios";

export async function refreshImageCache() {
    const dir = FileSystem.cacheDirectory+"images";
    const files = await FileSystem.readDirectoryAsync(dir);

    for (const id of files) {
        if (!(await axios.get(`https://api.scorecardgrades.com/v1/images/exists/${id}`)).data.exists) {
            await FileSystem.deleteAsync(`${dir}/${id}`);
        } else {
            await FileSystem.downloadAsync(`https://api.scorecardgrades.com/v1/images/get/${id}`, `${dir}/${id}`)
        }
    }
}