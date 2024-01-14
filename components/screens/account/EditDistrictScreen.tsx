import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import axios from "redaxios";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { Image } from "expo-image";
import useKeyboardVisisble from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";

const starred = require("../../../assets/starred.svg");

export default function EditDistrictScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const HEADER = "Edit District";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const [districts, setDistricts] = useState<any>([]);

  useEffect(() => {
    axios.get("https://scorecardgrades.com/api/districts").then((value) => {
      setDistricts(value.data.districts);
    });
  }, []);

  const { colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisisble();

  const [loading, setLoading] = useState(false);
  return (
    <KeyboardAvoidingView
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
          <TextInput
            label="Search for your school or district"
            setValue={() => {}}
            value=""
            type="username"
          />
          <FlatList
            scrollEnabled={false}
            style={{
              borderWidth: 1,
              borderColor: colors.borderNeutral,
              borderRadius: 4,
              backgroundColor: colors.card,
            }}
            data={districts.sort((a: any, b: any) => {
              if (a.pinned && !b.pinned) {
                return -1;
              } else if (!a.pinned && b.pinned) {
                return 1;
              } else {
                return a.name.localeCompare(b.name);
              }
            })}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setLoading(true);

                    setTimeout(() => {
                      setLoading(false);
                      props.navigation.navigate("editConnectAccount", {
                        district: item,
                      });
                    }, 1000);
                  }}
                >
                  <View
                    style={{
                      borderTopWidth: index !== 0 ? 1 : 0,
                      borderTopColor: colors.borderNeutral,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                    }}
                  >
                    <View
                      style={{
                        marginBottom: 4,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 16,
                          fontWeight: "500",
                          marginRight: 8,
                        }}
                      >
                        {item.name}
                      </Text>
                      {item.pinned && (
                        <Image
                          source={starred}
                          style={{
                            width: 16,
                            aspectRatio: 1,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 14,
                      }}
                    >
                      {item.url}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </AccountSubpageScreen>
    </KeyboardAvoidingView>
  );
}
