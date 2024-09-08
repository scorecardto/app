import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  InteractionManager,
  Alert,
  ScrollView,
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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image as Compressor } from "react-native-compressor";
import ClubPostArrayContainer from "../../app/clubs/ClubPostArrayContainer";
import { Club, ClubPost } from "scorecard-types";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import ScorecardImage from "../../util/ScorecardImage";
import Toast from "react-native-toast-message";
import DatePicker from "react-native-date-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import API_HOST from "../../../lib/API_HOST";

function ToolbarButton(props: {
  icon: string;
  label: string;
  onPress(): void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={props.onPress}>
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
  route: any;
}) {
  const club: Club | null = props.route.params.club;

  const colors = useColors();
  const navigation = useNavigation();

  const TOOLBAR_HEIGHT = 50;

  const ref = useRef<TextInput>(null);

  const { user } = useContext(MobileDataContext);

  const [content, setContent] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const addImageBase = useCallback(async () => {
    let token: string | undefined = undefined;

    user?.getIdToken().then((t) => (token = t));

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    if (!token) {
      token = await user?.getIdToken();
    }

    if (!token) {
      return;
    }

    let uri = result.assets[0].uri;
    // @ts-ignore
    const { size } = await FileSystem.getInfoAsync(uri, { size: true });

    console.log(size);

    if (size > 5 * 1024 * 1024) {
      Toast.show({
        type: "info",
        text1: "Image Too Large",
        text2: "Compressing to 5MB",
      });
      uri = await Compressor.compress(uri, {
        compressionMethod: "manual",
        quality: (5 * 1024 * 1024) / size,
        input: "uri",
        output: "png",
        returnableOutputType: "uri",
      });
    }

    // @ts-ignore
    const { size2 } = await FileSystem.getInfoAsync(uri, { size: true });
    console.log(size2);

    Toast.show({
      type: "info",
      text1: "Uploading Image...",
    });
    const ret = await FileSystem.uploadAsync(
      API_HOST + "/v1/images/upload",
      uri,
      {
        headers: {
          Authorization: token,
        },
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "image",
      }
    );

    console.log(ret.body);
    // @ts-ignore
    const body = JSON.parse(ret.body);

    if (body.result === "success") {
      setImage(body.id);
    }

    if (ret.status !== 200) return;
  }, []);

  const addImage = useCallback(async () => {
    if (image) {
      showActionSheetWithOptions(
        {
          options: ["Replace Image", "Remove Image", "Cancel"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (i) => {
          if (i === 0) {
            addImageBase();
          } else if (i === 1) {
            setImage(null);
          }
        }
      );
    } else {
      addImageBase();
    }
  }, [image]);

  const addLinkBase = useCallback(() => {
    Alert.prompt(
      "Add a Link",
      undefined,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Submit",
          onPress: (l) => {
            if (l) {
              setLink(l);
            }
          },
        },
      ],
      "plain-text"
    );
  }, []);

  const addLink = useCallback(() => {
    if (link) {
      showActionSheetWithOptions(
        {
          options: ["Replace Link", "Remove Link", "Cancel"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (i) => {
          if (i === 0) {
            addLinkBase();
          } else if (i === 1) {
            setLink(null);
          }
        }
      );
    } else {
      addLinkBase();
    }
  }, [link]);

  const { showActionSheetWithOptions } = useActionSheet();

  const [dateEdit, setDateEdit] = useState<Date>(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const addDate = useCallback(() => {
    if (date) {
      showActionSheetWithOptions(
        {
          options: ["Edit Event Time", "Remove Event", "Cancel"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (i) => {
          if (i === 0) {
            setDatePickerOpen(true);
          } else if (i === 1) {
            setDate(null);
          }
        }
      );
    } else {
      Alert.alert(
        "Add an Event Reminder",
        "If your post is associated with an event, you can add a date to remind people of the event. Regardless of the event date, your post will go out as soon as you send it."
      );
      setDatePickerOpen(true);
    }
  }, [date]);

  const dateChipText = useMemo(() => {
    if (date) {
      const dateFormatted = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: true,
      });

      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      return `${dateFormatted.split(", ")[0]}`;
    }
  }, [date]);

  const continueToFinishScreen = useCallback(() => {
    if (club) {
      const post: ClubPost = {
        club: club,
        content,
        eventDate: date?.getTime() ?? undefined,
        link: link ?? undefined,
        postDate: 0,
        picture: image ?? undefined,
      };
      props.navigation.navigate("finishClubPost", {
        post: post,
      });
    }
  }, [club, date, link, image, content]);

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
          onPressRight={() => {
            continueToFinishScreen();
          }}
        />
        <DatePicker
          modal
          open={datePickerOpen}
          date={dateEdit}
          onConfirm={(date) => {
            setDatePickerOpen(false);
            setDate(date);
            setDateEdit(date);
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
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
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 24,
                    marginTop: date || link || image ? 10 : 0,
                    marginBottom: date || link || image ? 4 : 0,
                  }}
                >
                  {date && (
                    <TouchableOpacity
                      onPress={() => {
                        addDate();
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.secondaryNeutral,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 24,
                          marginRight: 8,
                          borderColor: colors.borderNeutral,
                          borderWidth: 1,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                          }}
                        >
                          {dateChipText}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {link && (
                    <TouchableOpacity
                      onPress={() => {
                        addLink();
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.secondaryNeutral,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 24,
                          marginRight: 8,
                          borderColor: colors.borderNeutral,
                          borderWidth: 1,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                          }}
                        >
                          {link}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {image && (
                    <TouchableOpacity
                      onPress={() => {
                        addImage();
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.secondaryNeutral,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 24,
                          marginRight: 8,
                          borderColor: colors.borderNeutral,
                          borderWidth: 1,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                          }}
                        >
                          Image
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
              <View>
                <TextInput
                  defaultValue={""}
                  ref={ref}
                  autoFocus={true}
                  style={{
                    flexShrink: 1,
                    fontSize: 18,
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    marginTop: 0,
                    color: colors.text,
                    marginBottom: TOOLBAR_HEIGHT,
                  }}
                  placeholder="Start writing here..."
                  placeholderTextColor={colors.text}
                  multiline={true}
                  onChangeText={(v) => {
                    setContent(v);
                  }}
                  returnKeyType={"default"}
                  blurOnSubmit={false}
                  onLayout={() => {
                    InteractionManager.runAfterInteractions(() => {
                      ref.current?.focus();
                    });
                  }}
                />
                {image && (
                  <>
                    <View
                      style={{
                        marginHorizontal: 24,
                        marginTop: 24,
                      }}
                    >
                      <ScorecardImage height={150} width={150} id={image} />
                    </View>
                  </>
                )}
              </View>
            </View>
            <KeyboardStickyView
              offset={{
                  opened: TOOLBAR_HEIGHT,
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
                <ToolbarButton
                  icon="image"
                  label="Image"
                  onPress={() => {
                    addImage();
                  }}
                />
                <ToolbarButton
                  icon="link"
                  label="Link"
                  onPress={() => {
                    addLink();
                  }}
                />
                <ToolbarButton
                  icon="clock"
                  label="Event"
                  onPress={() => {
                    addDate();
                  }}
                />
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
