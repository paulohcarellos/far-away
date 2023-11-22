import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { useTheme, Text, Layout, Drawer, DrawerGroup, DrawerItem, Icon, Button, Divider } from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
import LockCard from "../components/LockCard";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function DashboardScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [terminals, setTerminals] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const iconRefs = useRef([]);

  useEffect(() => {
    fetchTerminals();
    const interval = setInterval(fetchTerminals, 10000);
    return () => clearInterval(interval);
  }, []);

  /* useEffect(() => {
    console.log(terminals);
  }, [terminals]); */

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const onBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  const fetchTerminals = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
        },
      };

      axios.get("http://192.168.15.187:8000/user-terminals/", config).then((response) => {
        if (response.status === 200) {
          const animate = [];
          console.log(response.data);
          console.log(terminals)

          response.data.forEach((terminal, terminalIdx) => {
            console.log(terminal);
            const old = terminals.find((s) => s.key == terminal.key);

            console.log(old);

            if (old !== undefined) {
              terminal.isLocked.forEach((isLocked, lockedIdx) => {
                console.log(isLocked);
                console.log(old.isLocked[lockedIdx]);
                if (isLocked == true && old.isLocked[lockedIdx] == false) animate.push(terminalIdx * 2 + lockedIdx);
              });
            }
          });

          console.log(animate);

          animate.forEach((icon) => iconRefs.current[icon].startAnimation());

          setTimeout(() => {
            setTerminals(
              response.data.map((terminal) => ({
                key: terminal.key,
                isLocked: terminal.isLocked,
                isLoading: [false, false],
                icons: terminal.isLocked.map((s) => (s ? "lock-outline" : "unlock-outline")),
              }))
            );
          }, 200);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openDevice = async (terminalIdx, deviceIdx) => {
    if (terminals[terminalIdx].isLocked[deviceIdx]) {
      var updating = [...terminals];
      updating[terminalIdx].isLoading[deviceIdx] = true;
      setTerminals(updating);

      try {
        const data = {
          terminal_guid: terminals[terminalIdx].key,
          device_idx: deviceIdx,
        };

        const config = {
          headers: {
            Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
          },
        };

        axios.post("http://192.168.15.187:8000/trigger/", data, config).then((response) => {
          if ((response.status = 200)) {
            var updating = [...terminals];
            updating[terminalIdx].isLoading[deviceIdx] = false;
            updating[terminalIdx].isLocked[deviceIdx] = false;
            setTerminals(updating);

            iconRefs.current[terminalIdx * 2 + deviceIdx].startAnimation();

            setTimeout(() => {
              var updating = [...terminals];
              updating[terminalIdx].icons[deviceIdx] = "unlock-outline";
              setTerminals(updating);
            }, 200);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout style={styles.layout}>
      <View style={styles.terminalList}>
        <Text category="h2" style={styles.listHeader}>
          Terminals
        </Text>
        <Divider />
        <Drawer
          selectedIndex={selectedIndex}
          onSelect={(index) => {
            console.log(index), setSelectedIndex(index);
          }}
          style={styles.terminalDrawer}
        >
          {terminals.map((terminal, idx) => (
            <DrawerGroup
              key={terminal.key}
              title={(evaProps) => <Text style={[evaProps.style, styles.terminalItemTitle]}>Terminal 1</Text>}
              accessoryLeft={(evaProps) => <Icon style={[evaProps.style, styles.terminalItemIcon]} name="radio-outline" />}
              style={styles.terminalItem}
            >
              <DrawerItem
                title={(evaProps) => <Text style={[evaProps.style, styles.lockItemTitle]}>Lock 1</Text>}
                accessoryLeft={
                  <LockCard
                    theme={theme}
                    loading={terminal.isLoading[0]}
                    iconName={terminal.icons[0]}
                    onPress={() => openDevice(idx, 0)}
                    iconRef={iconRefs}
                    refIdx={idx * 2}
                  />
                }
                style={styles.lockItem}
              />
              <DrawerItem
                title={(evaProps) => <Text style={[evaProps.style, styles.lockItemTitle]}>Lock 2</Text>}
                accessoryLeft={
                  <LockCard
                    theme={theme}
                    loading={terminal.isLoading[1]}
                    iconName={terminal.icons[1]}
                    onPress={() => openDevice(idx, 1)}
                    iconRef={iconRefs}
                    refIdx={idx * 2 + 1}
                  />
                }
                style={styles.lockItem}
              />
            </DrawerGroup>
          ))}
        </Drawer>
        <Button appearance="outline" style={styles.addTerminalButton} size="large" accessoryLeft={<Icon name="plus-outline" />}>
          Add Terminal
        </Button>
      </View>
    </Layout>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    layout: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    terminalList: {
      margin: 50,
      padding: 10,
      width: "90%",
      flexDirection: "column",
    },
    terminalDrawer: {
      height: "60%",
    },
    listHeader: {
      marginBottom: 20,
    },
    terminalItem: {
      height: 80,
    },
    terminalItemTitle: {
      fontSize: 20,
    },
    terminalItemIcon: {
      width: 30,
      height: 30,
    },
    lockItemTitle: {
      fontSize: 18,
      marginLeft: 15,
      paddingTop: 5,
    },
    addTerminalButton: {
      height: 70,
    },
  });
