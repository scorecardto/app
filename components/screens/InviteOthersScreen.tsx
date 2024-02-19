import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../text/Header";
import InviteButton from "../app/vip/InviteButton";
import ContactCard from "../app/vip/ContactCard";
import { NavigationProp, useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import ContactRequestView from "../app/vip/ContactRequestView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import ContactListView from "../app/vip/ContactListView";
import axios from "redaxios";
import formatPhoneNumber from "phone";
import {
  addInvitedNumber,
  saveInvitedNumbers,
  setInvitedNumbers,
} from "../core/state/user/invitedNumbersSlice";
import LoadingOverlay from "./loader/LoadingOverlay";
import ContactListDone1View from "../app/vip/ContactListDone1View";
import ContactListDone2View from "../app/vip/ContactListDone2View";
import ContactShareView from "../app/vip/ContactShareView";
export default function InviteOthersScreen(props: {
  navigation: NavigationProp<any>;
}) {
  const [view, setView] = useState<
    "request" | "list" | "share" | "list_done_1" | "list_done_2"
  >("request");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  const alreadyInvited = useSelector(
    (state: RootState) => state.invitedNumbers?.numbers
  );

  console.log(alreadyInvited);

  const numInvited = useSelector(
    (state: RootState) => state.invitedNumbers?.numbers?.length
  );

  const [alreadyOnApp, setAlreadyOnApp] = useState<string[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setView("list");

        const { data } = await Contacts.getContactsAsync({
          sort: "userDefault",
        });

        const contacts = data
          .filter((a) => {
            return a.phoneNumbers != null;
          })
          .reduce<Contacts.Contact[]>((list, contact) => {
            contact.phoneNumbers?.forEach((phoneNumber) => {
              if (phoneNumber.number) {
                const formatted = formatPhoneNumber(phoneNumber.number);

                if (formatted.phoneNumber && formatted.isValid) {
                  list.push({
                    ...contact,
                    phoneNumbers: [
                      {
                        ...phoneNumber,
                        number: formatted.phoneNumber,
                      },
                    ],
                  });
                }
              }
            });
            return list;
          }, []);

        const serverContactRanking = await axios.post(
          "https://scorecardgrades.com/api/metrics/processContactList",
          {
            phoneNumbers: contacts.map((c) => {
              if (!c.phoneNumbers?.[0].number) {
                return "";
              }
              return formatPhoneNumber(c.phoneNumbers?.[0].number).phoneNumber;
            }),
          }
        );

        const sortedContacts = contacts.sort((a, b) => {
          const aRank =
            a.phoneNumbers?.[0].number &&
            serverContactRanking.data[a.phoneNumbers?.[0].number!]?.score;
          const bRank =
            b.phoneNumbers?.[0].number &&
            serverContactRanking.data[b.phoneNumbers?.[0].number!]?.score;

          if (aRank && bRank && aRank > bRank && Math.random() > 0.7) {
            return -1;
          }
          if (aRank && bRank && aRank < bRank && Math.random() > 0.7) {
            return 1;
          }
          if (aRank && !bRank && Math.random() > 0.7) {
            return 1;
          }
          if (bRank && !aRank && Math.random() > 0.7) {
            return -1;
          }

          if (a.birthday && b.birthday && a.birthday.year && b.birthday.year) {
            return a.birthday.year - b.birthday.year > 0 ? 1 : -1;
          }
          if (a.birthday?.year && a.birthday.year < 2000) {
            return 1;
          }
          if (b.birthday?.year && b.birthday.year < 2000) {
            return -1;
          }
          if (Object.entries(a).length > Object.entries(b).length) {
            return -1;
          } else {
            return 1;
          }
        });

        const alreadyOnAppTemp: string[] = [];

        Object.entries(serverContactRanking.data).forEach(
          ([phoneNumber, data]: [any, any]) => {
            if (data && data?.alreadyOnScorecard) {
              alreadyOnAppTemp.push(phoneNumber);
            }
          }
        );

        setAlreadyOnApp(alreadyOnAppTemp);

        setContacts(sortedContacts);
      } else {
        setView("share");
      }
    })();
  }, []);

  return (
    <>
      {view === "list" && contacts.length === 0 && (
        <LoadingOverlay show={contacts.length === 0} />
      )}
      {view === "share" && (
        <ContactShareView
          close={() => {}}
          numInvited={numInvited ?? 0}
          invite={() => {
            dispatch(addInvitedNumber(""));
            dispatch(saveInvitedNumbers());
          }}
        />
      )}
      {view === "request" && <ContactRequestView />}
      {view === "list" && (
        <ContactListView
          contacts={contacts}
          numInvited={numInvited ?? 0}
          alreadyOnApp={alreadyOnApp}
          alreadyInvited={alreadyInvited ?? []}
          addInvitedNumber={(n) => {
            if (numInvited == 0) setView("list_done_1");
            else setView("list_done_2");

            dispatch(addInvitedNumber(n));
            dispatch(saveInvitedNumbers());
          }}
        />
      )}
      {view === "list_done_1" && (
        <ContactListDone1View
          close={() => {
            setView("list");
          }}
        />
      )}
      {view === "list_done_2" && (
        <ContactListDone2View
          close={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "scorecard" }],
            });
          }}
        />
      )}
    </>
  );
}
