import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import axios from "redaxios";
import { NavigationProp, useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import useKeyboardVisisble from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";

const starred = require("../../../assets/starred.svg");

export default function SelectDistrictScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const HEADER = "Select Your District";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const [districts, setDistricts] = useState<any>([]);
  const [test, setTest] = useState(0);

  useEffect(() => {
    axios.get("https://scorecardgrades.com/api/districts").then((value) => {
      setDistricts(value.data.districts);
    });
  }, []);

  const { colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisisble();

  const [loading, setLoading] = useState(false);

  const [districtSearch, setDistrictSearch] = useState("");
  return (
    <KeyboardAvoidingView
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LoadingOverlay show={loading} />
      <WelcomeScreen
        header={HEADER}
        footerText={FOOTER}
        showBanner={!isKeyboardVisible}
        monoLabel="Step 1 of 3"
      >
        <View>
          <TextInput
            label="Search for your school or district"
            setValue={setDistrictSearch}
            value={districtSearch}
            type="username"
          />
          <FlatList
            style={{
              borderWidth: 1,
              borderColor: colors.borderNeutral,
              borderRadius: 4,
              backgroundColor: colors.card,
            }}
            data={districts.sort((a: any, b: any) => {
              if (a.pinned && !b.pinned && !districtSearch) {
                return -1;
              } else if (!a.pinned && b.pinned && !districtSearch) {
                return 1;
              } else {
                if (districtSearch) {
                  const aName = a.name.toLowerCase();
                  const bName = b.name.toLowerCase();

                  const aIndex = aName.indexOf(districtSearch.toLowerCase());
                  const bIndex = bName.indexOf(districtSearch.toLowerCase());

                  if (aIndex !== -1 && bIndex !== -1) {
                    if (aIndex < bIndex) return -1;
                    else if (aIndex > bIndex) return 1;
                    else return aName.localeCompare(bName);
                  } else if (aIndex !== -1 && bIndex === -1) {
                    return -1;
                  } else if (aIndex === -1 && bIndex !== -1) {
                    return 1;
                  } else {
                    return aName.localeCompare(bName);
                  }
                } else {
                  return a.name.localeCompare(b.name);
                }
              }
            })}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setLoading(true);

                    setTimeout(() => {
                      setLoading(false);
                      props.navigation.navigate("connectAccount", {
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
      </WelcomeScreen>
    </KeyboardAvoidingView>
  );
}
