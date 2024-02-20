import { View, Text, FlatList, TextInput } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Contact } from "expo-contacts";
import InviteFlowHeader from "./InviteFlowHeader";
import ContactCard from "./ContactCard";
import ActionButton from "../../input/ActionButton";
import * as sms from "expo-sms";
import LoadingOverlay from "../../screens/loader/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import axios from "redaxios";
import useColors from "../../core/theme/useColors";
export default function ContactListView(props: {
  contacts: Contact[];
  numInvited: number;
  alreadyInvited: string[];
  alreadyOnApp: string[];
  addInvitedNumber: (num: string) => void;
}) {
  const headerText = `Select Person ${props.numInvited + 1}`;

  const [selected, setSelected] = useState(-1);

  const firstName = useSelector(
    (state: RootState) => {
      const name = state.name.firstName.split(" ").join("");

      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    },
    () => true
  );

  useEffect(() => {
    // prefetch
    axios.get("https://scorecardgrades.com/api/invite?name=" + firstName);
  }, []);
  const contacts = useMemo(() => {
    return props.contacts.reduce<Contact[]>((list, contact) => {
      contact.phoneNumbers?.forEach((phoneNumber) => {
        list.push({ ...contact, phoneNumbers: [phoneNumber] });
      });
      return list;
    }, []);
  }, [props.contacts]);

  const selectedContact = contacts[selected];

  const userPhoneNumber = selectedContact?.phoneNumbers?.[0]?.number;

  const inviteButtonText =
    selectedContact !== undefined && userPhoneNumber
      ? "Invite " + selectedContact.name.split(" ")[0]
      : selectedContact !== undefined
      ? "Can't invite this person"
      : "Tap someone to invite";

  const enableInviteButton = selectedContact !== undefined && userPhoneNumber;

  const colors = useColors();

  const [search, setSearch] = useState("");
  return (
    <>
      <View style={{ height: "100%" }}>
        <InviteFlowHeader
          header={headerText}
          subheader="then, send them a link"
        />
        <View>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={{
              padding: 20,
              color: colors.primary,
            }}
            placeholderTextColor={colors.text}
            placeholder="Search for a contact"
          ></TextInput>
        </View>
        <FlatList
          // list including multiple phone numbers for each contact
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isInSearch = search === "" || item.name.includes(search);
            return (
              <View
                key={index}
                style={{
                  display: isInSearch ? "flex" : "none",
                }}
              >
                <ContactCard
                  showPhoneNumber={true}
                  selected={selected === index}
                  name={item.name || ""}
                  phoneNumber={item.phoneNumbers?.[0].number?.toString() || ""}
                  image={item.imageAvailable ? item.image : undefined}
                  onPress={() => {
                    setSelected(index);
                  }}
                  alreadyOnApp={
                    !!(
                      item.phoneNumbers?.[0].number &&
                      props.alreadyOnApp.includes(item.phoneNumbers?.[0].number)
                    )
                  }
                  alreadyInvited={
                    !!(
                      item.phoneNumbers?.[0].number &&
                      props.alreadyInvited.includes(
                        item.phoneNumbers?.[0].number
                      )
                    )
                  }
                />
              </View>
            );
          }}
        />
        <View
          style={{
            zIndex: 1,
            position: "absolute",
            bottom: 0,
            marginBottom: 32,
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ActionButton
            type={enableInviteButton ? "BLACK" : "DISABLED"}
            onPress={() => {
              sms.isAvailableAsync().then((isAvailable) => {
                if (isAvailable && userPhoneNumber) {
                  sms
                    .sendSMSAsync(
                      userPhoneNumber,
                      `https://scorecardgrades.com/i/${firstName} you should get this`
                    )
                    .then((result) => {
                      if (result.result !== "cancelled") {
                        props.addInvitedNumber(userPhoneNumber);
                      }
                    });
                } else {
                  console.log("SMS is not available on this device");
                }
              });
            }}
          >
            {inviteButtonText}
          </ActionButton>
        </View>
      </View>
    </>
  );
}
