import {StyleSheet, Text, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, {ReactNode} from "react";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

export default function PrivacySection(props: {
    title: string | ((style: any) => ReactNode);
    subtitle?: string | ((style: any) => ReactNode);
    items: {icon: string, label: string | ((style: any) => ReactNode)}[]
}) {
    const style = StyleSheet.create({
        wrapper: {
            backgroundColor: "rgba(248,248,248,0.96)",
            borderRadius: 25,
            flexDirection: "column",
            paddingBottom: 10,
            marginTop: 15,
        },
        title: {
            color: "#525252",
            fontSize: 20,
            lineHeight: 27,
            marginTop: 13,
            marginLeft: 15,
            marginBottom: props.subtitle ? 0 : 10,
        },
        subtitle: {
            color: "#8f8f8f",
            fontSize: 11,
            lineHeight: 25,
            marginLeft: 15,
            marginRight: 10,
        },
        icon: {
            textAlign: "center",
            textAlignVertical: "center",
            alignSelf: "center",
            lineHeight: 25,
        },
        label: {
            color: "#8c8c8c",
            fontSize: 13,
            lineHeight: 25,
            marginLeft: 10,
        }
    })

    return (
        <View style={style.wrapper}>
            {typeof(props.title) === 'string' ?
                <Text style={style.title}>{props.title}</Text>
                : props.title(style.title)}
            {props.subtitle && (typeof(props.subtitle) === 'string' ?
                <Text style={style.subtitle}>{props.subtitle}</Text>
                : props.subtitle(style.subtitle))}
            <View style={{
                borderBottomColor: '#d2d2d2',
                borderBottomWidth: 1,
                marginBottom: 10,
            }}/>
            {props.items.map((item, i) =>
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 15,
                        marginBottom: 5,
                    }}
                    key={i}
                >
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color={"#868686"}
                        style={style.icon}
                    />
                    {typeof(item.label) === 'string' ?
                        <Text style={style.label}>{item.label}</Text>
                        : item.label(style.label)}
                </View>
            )}
        </View>
    );
}