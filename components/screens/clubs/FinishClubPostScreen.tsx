import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  InteractionManager,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useColors from "../../core/theme/useColors";
import {
  KeyboardStickyView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { Octicons } from "@expo/vector-icons";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import LargeText from "../../text/LargeText";
import { useEffect, useRef, useState } from "react";
import ClubPostArrayContainer from "../../app/clubs/ClubPostArrayContainer";
import MediumText from "../../text/MediumText";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../input/Button";
import { Club } from "scorecard-types";
function PromotionOption(props: {
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
  const navigation = useNavigation();

  const ref = useRef<TextInput>(null);

  const [promotionTier, setPromotionTier] = useState(0);

  const club: Club | null = props.route.params.club;

  return (
    <View style={{}}>
      <View
        style={{
          height: "100%",
          paddingBottom: 180,
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
          <PromotionOption
            name="Basic"
            description="Your members with Scorecard installed will see this post in their feed, but won't receive a notification for it."
            price={"$0"}
            onPress={() => {
              setPromotionTier(0);
            }}
            selected={promotionTier === 0}
          />
          <PromotionOption
            name="Promote"
            description="All members will recieve a notification about this post."
            price={"$0"}
            onPress={() => {
              setPromotionTier(1);
            }}
            selected={promotionTier === 1}
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
        <View
          style={{
            marginTop: 24,
          }}
        >
          <Button onPress={() => {}}>{`Post in ${
            club?.name ?? "UKNOWN"
          }`}</Button>
        </View>
      </View>
    </View>
  );
}
