import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import Button from "../../input/Button";
import { TextInput } from "../../input/TextInput";
import { fetchAllContent } from "../../../lib/fetcher";
import SmallText from "../../text/SmallText";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import fetchAndStore from "../../../lib/fetchAndStore";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import Toast from "react-native-toast-message";
import ReactNative from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../core/state/store";
import * as loginSlice from "../../core/state/user/loginSlice";
import { setOldCourseState } from "../../core/state/grades/oldCourseStatesSlice";
import ScorecardModule from "../../../lib/expoModuleBridge";
import {validate} from "email-validator";
import {setPreferredEmail} from "../../core/state/social/socialSlice";
import useScApi from "../../util/hooks/useScApi";
export default function EditEmailScreen (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Edit Email";
  const FOOTER =
    "This will update your email address for every club you are in. Make sure it's correct!";

  const { accents, colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const oldEmail = props.route.params.email ?? "";
  const [email, setEmail] = useState(oldEmail);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const emailRef = useRef<ReactNative.TextInput>(null);

  const isStudentEmail = email.includes("austinisd") || email.includes("stu.a");
  const isEmailValid = validate(email.toLowerCase()) && !isStudentEmail;

  const api = useScApi();
  const finish = () => {
      if (isEmailValid) {
          dispatch(setPreferredEmail(email.toLowerCase()));
          ScorecardModule.storeItem("preferredEmail", email.toLowerCase());
      }

      if (oldEmail && oldEmail !== email) {
          api.post({
              pathname: "/v1/clubs/changeEmail",
              body: {
                  oldEmail: oldEmail,
                  newEmail: email
              },
              auth: true,
          }).then(props.navigation.goBack)
      } else {
          props.navigation.goBack();
      }
  }

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LoadingOverlay show={loading} />
      <AccountSubpageScreen
        header={HEADER}
        footerText={FOOTER}
        showBanner={!isKeyboardVisible}
      >
        <View>
            <SmallText style={{color: colors.text, marginBottom: 20}}>{FOOTER}</SmallText>
            <TextInput
            label="Email"
            setValue={v => {setEmail(v.toLowerCase());}}
            value={email}
            type="email"
            ref={emailRef}
          />
          <Button disabled={!isEmailValid} onPress={() => {
              setLoading(true);
              finish();
          }}>Update</Button>
        </View>
      </AccountSubpageScreen>
    </View>
  );
};