import { useNavigation } from "@react-navigation/native";
import BottomSheetProvider from "../../../util/BottomSheet/BottomSheetProvider";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import QuestionMultiselect from "./QuestionMultiselect";
import { MultiselectQuestionPath } from "../../../../lib/types/QuestionPath";
import { Linking, View } from "react-native";

export default function QuestionsSheet(props: { close: () => void }) {
  const navigation = useNavigation();

  const path: MultiselectQuestionPath = {
    emoji: "❓",
    title: "What's Up?",
    label: "Questions",
    type: "multiselect",
    options: [
      {
        label: "Something isn't working",
        title: "What's Wrong?",
        type: "multiselect",
        emoji: "⚠️",
        options: [
          {
            type: "answer",
            label: "My school isn't available.",
            text: "Scorecard supports schools using Frontline for their gradebooks. This service is called ERP & SIS. If your school doesn't use this service, there is no need to use Scorecard. If your school does use Frontline ERP & SIS, try searching for both your school and district.",
            emoji: "🏫",
          },
          {
            type: "answer",
            label: "My username or password is wrong.",
            text: "Make sure you're a student. Enter the same username and password you use to log into your school's gradebook. If you're a teacher, you can't use Scorecard. If you're a teacher, parent, or admin, you can't use Scorecard.",
            emoji: "🔑",
          },
          {
            type: "answer",
            label: "Can't log in, but my password is right.",
            text: "Check your internet connection. Frontline often has outages, so try logging into the gradebook to see if this is a Scorecard issue.",
            emoji: "🚪",
          },
          {
            type: "answer",
            label: "Error entering my phone number.",
            text: "Make sure you're entering a valid US phone number. We can't send verification codes to international numbers. If you're still having trouble, press Skip Login below.",
            emoji: "📞",
          },
          {
            type: "answer",
            label: "Error entering the verification code.",
            text: "If you got an incorrect code error, try again. If you didn't get a code or your code expired, tap Edit Phone Number, then tap Done to get a new code. If you're still having trouble, press Skip Login below.",
            emoji: "🔢",
          },
          {
            type: "answerAction",
            label: "I got a different error.",
            // @ts-ignore
            onPress: () => navigation.navigate("helpOnboarding"),
            emoji: "🙋",
          },
          {
            type: "answerAction",
            label: "A solution above didn't work.",
            // @ts-ignore
            onPress: () => navigation.navigate("helpOnboarding"),
            emoji: "💀",
          },
        ],
      },
      {
        label: "Can you see my login?",
        type: "answer",
        emoji: "👀",
        text: "No, we can't see your login or grades. Everything stays on your device. For notifications, we can see when new grades come in, but we can't see the grades themselves.",
      },
      {
        label: "Why is Scorecard useful?",
        type: "answer",
        emoji: "🔍",
        text: "Scorecard saves you time by checking your grades for you. You can see your grades without logging in, and you can get notifications when new grades come in. It's also easier to use with features like customization, renaming classes, and grade testing.",
      },
      {
        label: "What data does Scorecard store?",
        type: "answer",
        emoji: "🐾",
        text: "Your login and grades are stored on your devices, which means no one else can see them. Some data is stored on a server, including school district, school name, phone number, username, and notifications (see the question above). Scorecard can see data that's stored on a server.",
      },
      {
        label: "Who created Scorecard?",
        type: "answer",
        emoji: "👨‍👩‍👧",
        text: "Scorecard was created by Oscar Casares, Adrian Casares, and Malcolm Roalson, with help from our beta testers and ambassadors. We are students who wanted to make a better way to check grades!",
      },
      {
        label: "How can I trust Scorecard?",
        type: "answer",
        emoji: "❣️",
        text: "Scorecard deals with sensitive data, which is why your login and grades are never uploaded to a server. Our code is open source, which means anyone can see how it works and audit it for security. We're also public about who we are and are always happy to answer questions!",
      },

      {
        type: "answerAction",
        label: "What's your privacy policy?",
        // @ts-ignore
        onPress: () => {
          Linking.openURL(
            "https://scorecardgrades.com/privacy-policy?type=mobile"
          );
        },
        emoji: "🔒",
      },
      {
        type: "answerAction",
        label: "I have a different question.",
        // @ts-ignore
        onPress: () => navigation.navigate("helpOnboarding"),
        emoji: "🙋",
      },
    ],
  };

  return (
    <BottomSheetView>
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <QuestionMultiselect path={path} />
      </View>
    </BottomSheetView>
  );
}
