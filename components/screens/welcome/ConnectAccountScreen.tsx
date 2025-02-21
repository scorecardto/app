import ReactNative, {
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import Button from "../../input/Button";
import { TextInput } from "../../input/TextInput";
import { fetchAllContent } from "../../../lib/fetcher";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import fetchAndStore from "../../../lib/fetchAndStore";
import Toast from "react-native-toast-message";
import * as loginSlice from "../../core/state/user/loginSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import StatusText from "../../text/StatusText";
import ScorecardModule from "../../../lib/expoModuleBridge";
import LargeText from "../../text/LargeText";
import CleanTextInput from "../../input/CleanTextInput";
import useColors from "../../core/theme/useColors";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import OnboardingButtonContainer from "../../app/welcome/OnboardingButtonContainer";

const ConnectAccountScreen = (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) => {
  const colors = useColors();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const district = props.route.params.district;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (loading) {
      let schoolLabel = "";
      let gradeLabel = "";
      let realFirstName = "";
      let realLastName = "";

      const timeoutId = setTimeout(() => {
        setLoading(false);
        Toast.show({
          type: "info",
          text1: "Timed Out",
          text2:
            "The login process took too long. Frontline may be down or your internet connection may be slow. Tap here to check if Frontline is down.",
          visibilityTime: 5000,
          position: "top",
          onPress: () => {
            Linking.openURL(
              `https://${district.url}/selfserve/EntryPointHomeAction.do?parent=false`
            );
          },
        });
      }, 12000);

      const reportCard = fetchAllContent(
        district.url,
        undefined,
        username,
        password,
        false,
        msg => {
            clearTimeout(timeoutId);

            if (msg === "INCORRECT_PASSWORD") {
                setLoading(false);
                setPassword("");
                Toast.show({
                    type: "info",
                    text1: "Incorrect password",
                    text2: "Enter the password you use to log into Frontline. Too many incorrect attempts will lock you out of your account.",
                });
            } else if (msg === "INCORRECT_USERNAME") {
                setLoading(false);
                setUsername("");
                setPassword("");

                Toast.show({
                    type: "info",
                    text1: "Incorrect username",
                    text2: "Enter the username you use to log into Frontline.",
                });
            } else {
                setLoading(false);
            }
        },
        undefined,
        (name) => {
          clearTimeout(timeoutId);

          schoolLabel = name.school;
          gradeLabel = name.grade;
          realFirstName = name.firstName;
          realLastName = name.lastName;

          dispatch(loginSlice.setSchoolName(name.school));
          dispatch(loginSlice.setGradeLabel(name.grade));

          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "addName",
                params: { firstName: name.firstName, lastName: name.lastName },
              },
            ],
          });
        }
      );

      reportCard
        .then(async (data) => {
          if (data == null) return;

          dispatch(loginSlice.setDistrict(district));
          dispatch(loginSlice.setUsername(username));
          dispatch(loginSlice.setPassword(password));

          dispatch(
            loginSlice.setDistrictVipProgramDate(district.vipProgramDate)
          );

          ScorecardModule.storeItem(
            "login",
            JSON.stringify({
              host: district.url,
              username,
              password,
              school: schoolLabel,
              grade: gradeLabel,
              realFirstName: realFirstName,
              realLastName: realLastName,
            })
          );

          if (district.vipProgramDate) {
            ScorecardModule.storeItem(
              "vipProgramDate",
              district.vipProgramDate
            );
          }

          const fetchStoreResult = await fetchAndStore(data, dispatch, true, true, true);
        });
    }
  }, [loading]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <LoadingOverlay show={loading} />
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <ScrollView style={{ paddingHorizontal: 20, flexShrink: 1 }}>
          <View style={{ marginBottom: 48, paddingTop: 8 }}>
            <Text
              style={{
                fontSize: 56,
                textAlign: "center",
              }}
            >
              🔑
            </Text>
            <LargeText
              style={{
                fontSize: 28,
                marginTop: 10,
                textAlign: "center",
                color: colors.primary,
              }}
            >
              Login with Frontline
            </LargeText>
          </View>
          <CleanTextInput
            label="Username"
            value={username}
            setValue={setUsername}
            returnKeyType="next"
            type="username"
            autoFocus={true}
          />
          <CleanTextInput
            label="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />
          <View
            style={{
              backgroundColor: colors.secondaryNeutral,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 8,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: colors.text,
                textAlign: "center",
              }}
            >
              Your password will never be shared with Scorecard.
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            flexShrink: 0,
          }}
          onPress={() => {
            setLoading(true);
          }}
        >
          <View
            style={{
              backgroundColor: "#40B97F",
              paddingVertical: 16,
            }}
          >
            <LargeText
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Sign In
            </LargeText>
          </View>
        </TouchableOpacity>
        <OnboardingButtonContainer />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default ConnectAccountScreen;
