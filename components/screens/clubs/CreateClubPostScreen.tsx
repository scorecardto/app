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
import { useEffect, useRef } from "react";
import ClubPostArrayContainer from "../../app/clubs/ClubPostArrayContainer";
function ToolbarButton(props: { icon: string; label: string }) {
  const colors = useColors();
  return (
    <TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <Octicons
          // @ts-ignore
          name={props.icon}
          size={24}
          style={{
            // marginRight: 16,
            color: colors.button,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
export default function CreateClubPostScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const colors = useColors();
  const navigation = useNavigation();

  const TOOLBAR_HEIGHT = 50;

  const ref = useRef<TextInput>(null);

  return (
    <View style={{}}>
      <View
        style={{
          height: "100%",
          paddingBottom: 180,
        }}
      >
        <ClubPostArrayContainer
          onPressLeft={() => {
            props.navigation.goBack();
          }}
          onPressRight={() => {}}
        />
        <KeyboardAvoidingView
          style={{}}
          behavior="padding"
          keyboardVerticalOffset={TOOLBAR_HEIGHT}
        >
          <View
            style={{
              height: "100%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  paddingHorizontal: 16,
                  // backgroundColor: "red",
                  paddingTop: 0,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingTop: 4,
                  }}
                >
                  <LargeText
                    style={{
                      color: colors.primary,
                    }}
                    textProps={{
                      numberOfLines: 1,
                    }}
                  >
                    Post
                  </LargeText>
                </View>
              </View>
              <TextInput
                defaultValue={""}
                ref={ref}
                autoFocus={true}
                style={{
                  flexShrink: 1,
                  fontSize: 20,
                  paddingHorizontal: 24,
                  paddingTop: 12,
                  marginTop: 0,
                }}
                placeholder="Start writing here..."
                placeholderTextColor={colors.text}
                multiline={true}
                onChangeText={(v) => {}}
                returnKeyType={"default"}
                blurOnSubmit={false}
                onLayout={() => {
                  InteractionManager.runAfterInteractions(() => {
                    ref.current?.focus();
                  });
                }}
              />
            </View>
            <KeyboardStickyView
              offset={{
                closed: TOOLBAR_HEIGHT,
              }}
              style={{
                position: "absolute",
                bottom: 0,
                alignItems: "center",
                width: "100%",
                flexDirection: "row",
                paddingHorizontal: 8,
                height: TOOLBAR_HEIGHT,
                borderTopWidth: 1,
                borderColor: colors.borderNeutral,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <ToolbarButton icon="image" label="Image" />
                <ToolbarButton icon="link" label="Link" />
                <ToolbarButton icon="clock" label="Event" />
              </View>
            </KeyboardStickyView>
          </View>
        </KeyboardAvoidingView>
        {/* <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "yellow",
          marginBottom: 100,
        }}
      >
        <View
          style={{
            backgroundColor: "red",
          }}
        >
          <View
            style={{
              flexShrink: 0,
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
                onPressLeft={() => {
                  props.navigation.goBack();
                }}
                hideRight
                onPressRight={() => {}}
              />

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingTop: 4,
                }}
              >
                <LargeText
                  style={{
                    color: colors.primary,
                  }}
                  textProps={{
                    numberOfLines: 1,
                  }}
                >
                  Post
                </LargeText>
              </View>
            </View>
          </View>
          <TextInput
            defaultValue={""}
            style={{
              flexShrink: 1,
              fontSize: 20,
              paddingHorizontal: 24,
              paddingTop: 12,
            }}
            placeholder="Start writing here..."
            placeholderTextColor={colors.text}
            multiline={true}
            onChangeText={(v) => {}}
            returnKeyType={"default"}
            blurOnSubmit={false}
          />
        </View>
        <View>
          
        </View>
      </KeyboardAvoidingView> */}
      </View>
    </View>
  );
}
