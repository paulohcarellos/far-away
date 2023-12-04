import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function QRCodeScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    request = JSON.parse(data);
    sendRequest(request);
  };

  const sendRequest = async (data) => {
    const config = {
      headers: {
        Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
      },
    };

    axios
      .post("http://192.168.15.187:8000/setup/", data, config)
      .then((response) => {
        if ((response.status = 200)) {
          alert("Terminal added successfully");
          navigation.navigate("Dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Invalid QRCode");
        navigation.navigate("Dashboard");
      });
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
