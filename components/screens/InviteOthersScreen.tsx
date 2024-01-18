import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../text/Header";
import InviteButton from "../app/vip/InviteButton";
import ContactCard from "../app/vip/ContactCard";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
export default function InviteOthersScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const { colors } = useTheme();
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          sort: "userDefault",
        });

        setContacts(
          data
            .filter((a) => {
              return a.phoneNumbers != null;
            })
            .sort((a, b) => {
              if (
                a.birthday &&
                b.birthday &&
                a.birthday.year &&
                b.birthday.year
              ) {
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
            })
        );
      }
    })();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={{ height: "100%" }}>
        <Header header="Select 3 People" />
        {contacts ? (
          <View style={{ padding: 24 }}>
            <FlatList
              scrollEnabled={false}
              style={{
                borderWidth: 1,
                borderColor: colors.borderNeutral,
                borderRadius: 4,
                backgroundColor: colors.card,
              }}
              data={contacts}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    {item.phoneNumbers?.map((phoneNumber) => {
                      return (
                        <ContactCard
                          showPhoneNumber={item.phoneNumbers?.length !== 1}
                          index={index}
                          name={item.name || ""}
                          phoneNumber={phoneNumber.number?.toString() || ""}
                          onPress={() => {}}
                        />
                      );
                    })}
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={{ padding: 32 }}>
            <InviteButton enabled={false}>Invite</InviteButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
