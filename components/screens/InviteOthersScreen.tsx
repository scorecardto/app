import { useContext, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { NavigationProp } from "@react-navigation/native";
import ContactRequestView from "../app/vip/ContactRequestView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import ContactListView from "../app/vip/ContactListView";
import axios from "redaxios";
import formatPhoneNumber from "phone";
import auth from "@react-native-firebase/auth";
import {
  addInvitedNumber,
  saveInvitedNumbers,
} from "../core/state/user/invitedNumbersSlice";
import LoadingOverlay from "./loader/LoadingOverlay";
import ContactListDone1View from "../app/vip/ContactListDone1View";
import ContactListDone2View from "../app/vip/ContactListDone2View";
import ContactShareView from "../app/vip/ContactShareView";
import ContactShareDoneView from "../app/vip/ContactShareDoneView";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import FeatureExplanationSheet from "../app/vip/FeatureExplanationSheet";
import { getAnalytics } from "@react-native-firebase/analytics";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import ScorecardModule from "../../lib/expoModuleBridge";

export default function InviteOthersScreen(props: {
  navigation: NavigationProp<any>;
}) {
  const [view, setView] = useState<
    "request" | "list" | "share" | "list_done_1" | "list_done_2" | "share_done"
  >("request");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  const alreadyInvited = useSelector(
    (state: RootState) => state.invitedNumbers?.numbers
  );

  const numInvited = useSelector(
    (state: RootState) => state.invitedNumbers?.numbers?.length
  );

  const [alreadyOnApp, setAlreadyOnApp] = useState<string[]>([]);

  const dispatch = useDispatch();

  const sheets = useContext(BottomSheetContext);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const hasProcessedContacts = ScorecardModule.getItem("hasProcessedContacts");

        if (!hasProcessedContacts) {
          const { data } = await Contacts.getContactsAsync({
            sort: "userDefault",
          });

          const result = await axios.post(
            "https://scorecardgrades.com/api/metrics/processContactList",
            {
              contacts: data.map((c: Contacts.Contact) => ({
                ...c,
                rawImage: undefined,
                imageAvailable: undefined,
                image: undefined,
              })),
              token: await user?.getIdToken(),
              graph: true,
            }
          );

          if (result.data.success) {
            ScorecardModule.storeItem( "hasProcessedContacts", "true");
          }
        }

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
            if (numInvited && numInvited >= 1) {
              setView("share_done");
              getAnalytics().logEvent("sent_invite", {
                through: "share_sheet",
                totalInvited: (numInvited ?? 0) + 1,
              });
            }
            dispatch(addInvitedNumber(""));
            dispatch(saveInvitedNumbers());
          }}
        />
      )}
      {view === "share_done" && (
        <ContactShareDoneView
          close={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "scorecard" }],
            });

            sheets?.addSheet((p) => {
              return <FeatureExplanationSheet close={p.close} />;
            });
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
            getAnalytics().logEvent("sent_invite", {
              through: "contact_list",
              totalInvited: (numInvited ?? 0) + 1,
            });
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

            sheets?.addSheet((p) => {
              return <FeatureExplanationSheet close={p.close} />;
            });
          }}
        />
      )}
    </>
  );
}
