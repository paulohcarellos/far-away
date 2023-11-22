import React, { useState, useRef } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Icon, Spinner, useTheme } from "@ui-kitten/components";

export default function LockCard({ theme, loading, iconName, onPress, iconRef, refIdx }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ justifyContent: "space-evenly" }}>
        {loading ? (
          <Spinner size="small" status="info" />
        ) : (
          <Icon
            name={iconName}
            animation="pulse"
            fill={theme["text-basic-color"]}
            ref={(ref) => (iconRef.current[refIdx] = ref)}
            style={{ width: 30, height: 30 }}
          />
        )}
      </View>
    </Pressable>
  );
}
