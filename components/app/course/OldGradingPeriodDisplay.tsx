import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import React, {useMemo} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import SmallText from "../../text/SmallText";
import {MaterialIcons} from "@expo/vector-icons";
import TinyText from "../../text/TinyText";

export default function OldGradingPeriodDisplay(props: {
    lastUpdatedOldGradingPeriod: string | undefined;
    refreshGradingPeriod: (allowGetFromStorage: boolean) => void;
}) {
    const colors = useColors();
    const accents = useAccents();

    const lastUpdatedText = useMemo(() => {
        if (
            props.lastUpdatedOldGradingPeriod === "" ||
            props.lastUpdatedOldGradingPeriod == null
        ) {
            return null;
        }

        const lastUpdated = new Date(props.lastUpdatedOldGradingPeriod);

        const now = new Date();

        const diff = now.getTime() - lastUpdated.getTime();

        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Last updated today.";
        } else if (diffDays === 1) {
            return "Last updated yesterday.";
        } else {
            return `Last updated ${diffDays} days ago.`;
        }
    }, [props.lastUpdatedOldGradingPeriod]);

    return (
        <View
            style={{
                borderRadius: 8,
                marginTop: -10,
                marginBottom: 20,
                overflow: "hidden",
                backgroundColor: colors.card,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
            }}
        >
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <SmallText
                    style={{
                        fontSize: 16,
                        color: colors.primary,
                    }}
                >
                    Old Grading Period
                </SmallText>
                <TinyText
                    style={{
                        color: colors.text,
                        marginTop: 4,
                    }}
                >
                    {lastUpdatedText ?? "Fetching grades..."}
                </TinyText>

            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => props.refreshGradingPeriod(false)}
                    style={{
                        backgroundColor: accents.secondary,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: accents.primary
                        }}
                    >
                        Refresh
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}