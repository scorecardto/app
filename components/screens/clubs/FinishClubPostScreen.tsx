import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import useColors from "../../core/theme/useColors";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import LargeText from "../../text/LargeText";
import { useCallback, useRef, useState } from "react";
import MediumText from "../../text/MediumText";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../input/Button";
import { ClubPost, ClubPostInternal, PromotionOption } from "scorecard-types";
import LoadingOverlay from "../loader/LoadingOverlay";
import axios from "redaxios";
import useScApi from "../../util/hooks/useScApi";
import Toast from "react-native-toast-message";
import { SimpleTextInput } from "../../input/SimpleTextInput";
import ToggleInput from "../../input/ToggleInput";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardProvider,
} from "react-native-keyboard-controller";

function PromotionOptionCard(props: {
  name: string;
  description: string;
  price: string;
  onPress(): void;
  selected: boolean;
}) {
  const colors = useColors();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          backgroundColor: colors.card,
          paddingTop: 12,
          paddingHorizontal: 12,
          marginTop: 12,
          paddingBottom: 16,
          marginHorizontal: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.borderNeutral,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: props.selected
              ? colors.button
              : colors.backgroundNeutral,
            borderRadius: 32,
            width: 32,
            height: 32,
            flexShrink: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          {props.selected && (
            <MaterialIcons
              name="check"
              style={{
                color: "#FFFFFF",
              }}
              size={16}
            />
          )}
        </View>
        <View
          style={{
            flexShrink: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <MediumText
              style={{
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {props.name}
            </MediumText>
            <View>
              <Text
                style={{
                  color: colors.text,
                }}
              >
                {props.price}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: colors.text,
            }}
          >
            {props.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default function FinishClubPostScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const colors = useColors();

  const ref = useRef<TextInput>(null);

  const [promotionTier, setPromotionTier] = useState(1);

  const post: ClubPost | null = props.route.params.post;

  const [subject, setSubject] = useState(
    post?.club?.clubCode
      ? `New Announcement in #${post?.club?.clubCode}`
      : `New Announcement`
  );

  const [enableEmail, setEnableEmail] = useState(true);
  const [enableSMS, setEnableSMS] = useState(true);
  const [enablePush, setEnablePush] = useState(true);

  if (!post) {
    return (
      <View>
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  const club = post.club;

  const scApi = useScApi();
  const [publishing, setPublishing] = useState(false);
  const publish = useCallback(() => {
    let promotionOptionCode: PromotionOption = "BASIC";

    if (promotionTier === 1 || promotionTier === 2) {
      promotionOptionCode = "PROMOTE";
    }
    const postInternal: ClubPostInternal = {
      ...post,
      promotionOption: promotionOptionCode,
    };

    setPublishing(true);
    scApi
      .post({
        auth: true,
        pathname: "/v1/clubs/post",
        body:
          promotionTier === 2
            ? {
                subject,
                post: postInternal,
                disableEmail: !enableEmail,
                disableSMS: !enableSMS,
                disablePush: !enablePush,
              }
            : {
                post: postInternal,
              },
      })
      .then(() => {
        Toast.show({
          type: "info",
          text1: "Done!",
          text2: "We're pushing this to your club members right now.",
        });
      })
      .catch((e) => {
        Toast.show({
          type: "info",
          text1: "Something went wrong",
          text2: e,
        });
      })
      .finally(() => {
        setPublishing(false);
        props.navigation.navigate("Clubs");
      });
  }, [promotionTier, post, subject, enableEmail, enablePush, enableSMS]);

  return (
    <View style={{}}>
      <LoadingOverlay show={publishing} />
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          height: "100%",
          paddingBottom: 180,
        }}
      >
        <ScrollView
          style={{
            height: "100%",
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              // backgroundColor: "red",
              paddingTop: 24,
            }}
          >
            <CourseCornerButtonContainer
              hideRight={true}
              onPressRight={() => {}}
              onPressLeft={() => {
                props.navigation.goBack();
              }}
            />
            <LargeText
              style={{
                color: colors.primary,
              }}
              textProps={{
                numberOfLines: 1,
              }}
            >
              Promotion
            </LargeText>
          </View>
          <View>
            <PromotionOptionCard
              name="Basic"
              description="Your post will be shown in the feed."
              price={"$0"}
              onPress={() => {
                setPromotionTier(0);
              }}
              selected={promotionTier === 0}
            />
            <PromotionOptionCard
              name="Promote"
              description="Your members will recieve a notification about this post and see it in the feed."
              price={"$0"}
              onPress={() => {
                setPromotionTier(1);
              }}
              selected={promotionTier === 1}
            />
            <PromotionOptionCard
              name="Advanced Promote"
              description="Best for power users. May lead to email issues if used incorrectly."
              price={"$0"}
              onPress={() => {
                setPromotionTier(2);
              }}
              selected={promotionTier === 2}
            />
            {/* <PromotionOption
            name="Promote Plus"
            description="All members will recieve email, text, and device notifications about this post."
            price={"$3.99"}
          />
          <PromotionOption
            name="Promote Max"
            description="Users not in your club be notified of your post. You can target specific users to get the best results."
            price={"$7.99+"}
          /> */}
          </View>
          {promotionTier === 2 ? (
            <>
              <LargeText
                style={{
                  color: colors.primary,
                  marginHorizontal: 12,
                  marginTop: 16,
                  fontSize: 20,
                  marginBottom: 8,
                }}
              >
                Options
              </LargeText>
              <View
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: colors.borderNeutral,
                  marginHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: colors.card,
                }}
              >
                {enableEmail && (
                  <>
                    <MediumText
                      style={{
                        marginBottom: 8,
                        color: subject.length >= 64 ? "red" : colors.primary,
                      }}
                    >
                      Email Subject Line
                    </MediumText>
                    <SimpleTextInput
                      disableMarginBottom
                      value={subject}
                      label="Customize Email Subject"
                      setValue={setSubject}
                    />
                    <View
                      style={{
                        marginTop: 8,
                      }}
                    />
                  </>
                )}
                <ToggleInput
                  label="Promote by Email"
                  setValue={setEnableEmail}
                  value={enableEmail}
                />

                <ToggleInput
                  label="Promote by Text Message"
                  setValue={setEnableSMS}
                  value={enableSMS}
                />
                <ToggleInput
                  label="Promote by Notification"
                  setValue={setEnablePush}
                  value={enablePush}
                />
              </View>
            </>
          ) : (
            <></>
          )}
          <View
            style={{
              marginTop: 24,
            }}
          >
            <Button
              onPress={() => {
                publish();
              }}
            >{`Post in ${club?.name ?? "UKNOWN"}`}</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
