import ReactNative, { View, ScrollView } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import { NavigationProp } from "@react-navigation/native";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import { TextInput } from "../../input/TextInput";
import StatusText from "../../text/StatusText";
import Button from "../../input/Button";
import MediumText from "../../text/MediumText";
import axios from "redaxios";
import API_HOST from "../../../lib/API_HOST";
import Toast from "react-native-toast-message";
import useScApi from "../../util/hooks/useScApi";

export default function CreateClubScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const colors = useColors();

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");

  const usernameRef = useRef<ReactNative.TextInput>(null);
  const passwordRef = useRef<ReactNative.TextInput>(null);

  const [tickerValid, setTickerValid] = useState(false);
  const [loadingTickerValid, setLoadingTickerValid] = useState(false);
  const [tickerValidMessage, setTickerValidMessage] = useState("");

  const api = useScApi();

  const performCheck = useCallback(() => {
    if (ticker === "") {
      setTickerValid(false);
      setLoadingTickerValid(false);
      setTickerValidMessage("");
    } else {
      api
        .post({
          pathname: "/v1/clubs/checkTicker",
          auth: true,
          body: {
            ticker: ticker.toUpperCase(),
          },
        })
        .then((r) => {
          setLoadingTickerValid(false);
          setTickerValidMessage(r.data.result);

          if (r.data.result === "success") {
            setTickerValid(true);
          }
        });
    }
  }, [ticker]);

  const [loading, setLoading] = useState(false);

  const create = useCallback(() => {
    setLoading((l) => {
      if (l) return true;
      else {
        api
          .post({
            pathname: "/v1/clubs/create",
            auth: true,
            body: {
              name,
              ticker: ticker.toUpperCase(),
            },
          })
          .then((r) => {
            Toast.show({
              type: "info",
              text1: "Success",
            });
          })
          .catch((r) => {
            Toast.show({
              type: "info",
              text1: "Something went wrong",
            });
          })
          .finally(() => {
            setLoading(false);
          });
        return true;
      }
    });
  }, [ticker]);

  useEffect(() => {
    setTickerValid(false);
    setLoadingTickerValid(true);

    const timeout = setTimeout(() => {
      performCheck();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [ticker]);

  useEffect(() => {
    if (loadingTickerValid) {
      const timeout = setTimeout(() => {
        performCheck();
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loadingTickerValid]);

  const tickerTooltip = useMemo(() => {
    if (!ticker) {
      return `For example, "DOGS" or "MODELUN"`;
    }
    if (loadingTickerValid) {
      return "checking...";
    }
    if (tickerValidMessage === "success") {
      return "This club code is available!";
    }
    if (tickerValidMessage === "TOO LONG") {
      return "Must be 10 characters or less.";
    }
    if (tickerValidMessage === "TOO SHORT") {
      return "Must be at least 2 characters.";
    }
    if (tickerValidMessage === "INCORRECT FORMAT") {
      return "Must be alphanumeric, with no spaces or special characters.";
    }
    if (tickerValidMessage === "TAKEN") {
      return "This club code is not available.";
    }
    return "Something went wrong on our end.";
  }, [tickerValidMessage, ticker, loadingTickerValid]);

  const tickerColor = useMemo(() => {
    if (tickerValidMessage === "" || ticker === "" || loadingTickerValid) {
      return "gray";
    } else if (tickerValidMessage === "success") {
      return "green";
    } else {
      return "red";
    }
  }, [tickerValidMessage, ticker, loadingTickerValid]);
  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        flex: 1,
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
              Create Club
            </LargeText>
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          flexGrow: 1,
          padding: 16,
          flex: 1,
        }}
      >
        <View
          style={{
            height: "100%",
            flex: 1,
          }}
        >
          <MediumText style={{ marginBottom: 16, color: colors.primary }}>
            Name
          </MediumText>
          <TextInput
            label="Name"
            setValue={setName}
            value={name}
            type="text"
            ref={usernameRef}
          />
          <MediumText style={{ marginTop: 16, color: colors.primary }}>
            Club Code
          </MediumText>
          <StatusText
            style={{
              color: tickerColor,
              fontSize: 14,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {tickerTooltip}
          </StatusText>
          <TextInput
            label="Club Code"
            setValue={setTicker}
            value={ticker}
            type="username"
            ref={passwordRef}
          />

          <Button
            onPress={() => {
              create();
            }}
            disabled={!name || !tickerValid}
          >
            Create
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
