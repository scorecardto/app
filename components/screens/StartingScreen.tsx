import { View, Text } from "react-native";
import React, { useContext, useEffect, useMemo } from "react";
import { NavigationProp, useNavigationState } from "@react-navigation/native";
import { DataContext } from "scorecard-types";
import CourseCard from "../app/dashboard/CourseCard";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Storage } from "expo-storage";
import { MobileDataContext } from "../core/context/MobileDataContext";
const StartingScreen = (props: { navigation: NavigationProp<any, any> }) => {
  const navigation = useNavigationState((state) => state);
  const onStartingScreen =
    navigation.routes[navigation.index].name === "starting";

  const dataContext = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  useEffect(() => {
    // get login and data from storage
    const login = Storage.getItem({ key: "login" });
    const data = Storage.getItem({ key: "data" });

    Promise.all([login, data]).then(([login, data]) => {
      if (login && data) {
        const { courses, gradeCategory, gradeCategoryNames, date } =
          JSON.parse(data);

        const { username, password, host } = JSON.parse(login);

        mobileData.setUsername(username);
        mobileData.setPassword(password);
        mobileData.setDistrict(host);

        props.navigation.reset({
          index: 0,
          routes: [{ name: "scorecard" }],
        });

        dataContext.setData({
          courses,
          gradeCategory,
          gradeCategoryNames,
          date,
        });
        dataContext.setCourseDisplayNames({});
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "account" }],
        });
      }
    });
  }, []);

  return (
    <View>
      <Spinner visible={onStartingScreen} />
    </View>
  );
};

export default StartingScreen;
