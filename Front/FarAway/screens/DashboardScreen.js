import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import {
  useTheme,
  Text,
  Layout,
  Drawer,
  DrawerGroup,
  DrawerItem,
  Icon,
  Button,
  Divider,
  Modal,
  Card,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
import Constants from 'expo-constants';
import LockCard from "../components/LockCard";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function DashboardScreen({ navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [terminals, setTerminals] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTerminal, setModalTerminal] = useState(-1)
  const [modalLock, setModalLock] = useState(-1)
  const [renderedFeature, setRenderedFeature] = useState("menu");

  const [selectedHours, setSelectedHours] = useState(new IndexPath(0));
  const [selectedMinutes, setSelectedMinutes] = useState(new IndexPath(0));

  const iconRefs = useRef([]);

  useEffect(() => {
    fetchTerminals();
    const interval = setInterval(fetchTerminals, 10000);
    return () => clearInterval(interval);
  }, []);

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
    const config = {
      headers: {
        Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
      },
    };Constants.manifest.extra.

    axios
      .get("http://192.168.146.88:8000/user-terminals/", config)
      .then((response) => {
        // todo: multiple-lock
        setTerminals(
          response.data.map((terminal) => ({
            key: terminal.key,
            isLocked: terminal.isLocked,
            isLoading: [false],
            icons: terminal.isLocked.map((s) => (s ? "lock-outline" : "unlock-outline")),
          }))
        );
      })
      .catch((err) => console.log(err));
  };

  const openDevice = async (terminalIdx, deviceIdx) => {
    if (terminals[terminalIdx].isLocked[deviceIdx]) {
      var updating = [...terminals];
      updating[terminalIdx].isLoading[deviceIdx] = true;
      setTerminals(updating);

      const data = {
        terminal_guid: terminals[terminalIdx].key,
        device_idx: deviceIdx,
      };

      const config = {
        headers: {
          Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
        },
      };

      axios
        .post("http://192.168.146.88:8000/trigger/", data, config)
        .then((response) => {
          if ((response.status = 200)) {
            var updating = [...terminals];
            updating[terminalIdx].isLoading[deviceIdx] = false;
            updating[terminalIdx].isLocked[deviceIdx] = false;
            setTerminals(updating);

            iconRefs.current[terminalIdx].startAnimation();

            setTimeout(() => {
              var updating = [...terminals];
              updating[terminalIdx].icons[deviceIdx] = "unlock-outline";
              setTerminals(updating);
            }, 200);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const registerTimer = async () => {
    const timerTime = new Date();
    timerTime.setTime(timerTime.getTime() + selectedHours.row * 3600000 + selectedMinutes.row * 60000);

    const data = {
      terminal_guid: terminals[modalTerminal].key,
      device_idx: modalLock,
      time: timerTime.toISOString(),
    };

    const config = {
      headers: {
        Authorization: `Token ${await SecureStore.getItemAsync("authToken")}`,
      },
    };

    axios
      .post("http://192.168.146.88:8000/register-task/", data, config)
      .then((response) => {
        if ((response.status = 200)) {
          setModalVisible(false)
          alert("Timer registered successfully!");
        }
      })
      .catch((err) => {
        setModalVisible(false)
        alert("Timer failed to register!");
      });
  };

  const handleModalOpen = (terminal, lock) => {
    setModalVisible(true)
    setModalTerminal(terminal)
    setModalLock(lock)
  }

  const handleModalBack = () => {
    if (renderedFeature !== "menu") {
      setRenderedFeature("menu");
    } else setModalVisible(false);
  };

  const handleModalSave = () => {
    // timer only
    registerTimer();
  };

  const renderSelectNumber = (value) => <SelectItem title={value.toString()} key={value} />;

  return (
    <Layout style={styles.layout}>
      <View style={styles.terminalList}>
        <Text category="h2" style={styles.listHeader}>
          Terminals
        </Text>
        <Divider />
        <Drawer style={styles.terminalDrawer}>
          {terminals.map((terminal, idx) => (
            <DrawerGroup
              key={terminal.key}
              style={styles.terminalItem}
              title={(evaProps) => <Text style={[evaProps.style, styles.terminalItemTitle]}>Terminal {idx + 1}</Text>}
              accessoryLeft={(evaProps) => <Icon fill={theme["color-primary-400"]} style={[evaProps.style, styles.terminalItemIcon]} name="radio-outline" />}
            >
              <DrawerItem
                // todo: multiple-lock
                title={(evaProps) => <Text style={[evaProps.style, styles.lockItemTitle]}>Lock {idx + 1}</Text>}
                accessoryLeft={
                  <LockCard
                    theme={theme}
                    loading={terminal.isLoading[0]}
                    iconName={terminal.icons[0]}
                    onPress={() => openDevice(idx, 0)}
                    iconRef={iconRefs}
                    refIdx={idx}
                  />
                }
                accessoryRight={
                  <Button
                    appearance="ghost"
                    status="basic"
                    style={styles.openModalButton}
                    onPress={() => handleModalOpen(idx, 0)}
                    accessoryLeft={(props) => <Icon {...props} fill={theme["color-basic-700"]} name="more-horizontal-outline" style={styles.openModalIcon} />}
                  />
                }
                style={styles.lockItem}
              />
              {
                // todo: multiple-lock
              }
            </DrawerGroup>
          ))}
        </Drawer>
        <Button
          appearance="outline"
          style={styles.addTerminalButton}
          size="large"
          accessoryLeft={<Icon name="plus-outline" />}
          onPress={() => navigation.navigate("QRScanner")}
        >
          Add Terminal
        </Button>
        <Modal
          visible={modalVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => {setModalVisible(false); setRenderedFeature("menu")}}
          animationType="fade"
          style={styles.modal}
        >
          <Card style={styles.modalCard} disabled={true}>
            <Text style={styles.featuresTitle}>Features</Text>
            <Divider />
            {renderedFeature === "menu" && (
              <View style={styles.featuresContainer}>
                <Card style={styles.featuresCard} disabled={true}>
                  <Button
                    appearance="outline"
                    style={styles.featuresButton}
                    onPress={() => {
                      setRenderedFeature("time-picker");
                    }}
                    accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="clock-outline" style={styles.featuresIcon} />}
                  />
                  <Text style={styles.featuresDesc}>Timer</Text>
                </Card>
                <Card style={styles.featuresCard} disabled={true}>
                  <Button
                    appearance="outline"
                    style={styles.featuresButton}
                    accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="flip-2-outline" style={styles.featuresIcon} />}
                  />
                  <Text style={styles.featuresDesc}>Routine</Text>
                </Card>
                <Card style={styles.featuresCard} disabled={true}>
                  <Button
                    appearance="outline"
                    style={styles.featuresButton}
                    accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="link-2-outline" style={styles.featuresIcon} />}
                  />
                  <Text style={styles.featuresDesc}>Link</Text>
                </Card>
                <Card style={styles.featuresCard} disabled={true}>
                  <Button
                    appearance="outline"
                    style={styles.featuresButton}
                    accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="shield-outline" style={styles.featuresIcon} />}
                  />
                  <Text style={styles.featuresDesc}>Password</Text>
                </Card>
              </View>
            )}
            {renderedFeature === "time-picker" && (
              <View style={styles.timerContainer}>
                <View style={styles.timerCard}>
                  <Text style={styles.featuresDesc}>Hours</Text>
                  <Select
                    placeholder="0"
                    value={selectedHours.row.toString()}
                    selectedIndex={selectedHours}
                    onSelect={(item) => setSelectedHours(item)}
                    style={styles.timerSelect}
                  >
                    {[...Array(99).keys()].map((_, idx) => renderSelectNumber(idx))}
                  </Select>
                </View>
                <View style={styles.timerCard}>
                  <Text style={styles.featuresDesc}>Minutes</Text>
                  <Select
                    placeholder="0"
                    value={selectedMinutes.row.toString()}
                    selectedIndex={selectedMinutes}
                    onSelect={(item) => setSelectedMinutes(item)}
                    style={styles.timerSelect}
                  >
                    {[...Array(60).keys()].map((_, idx) => renderSelectNumber(idx))}
                  </Select>
                </View>
              </View>
            )}
            <Divider />
            <View style={styles.modalButtonsContainer}>
              <Button
                appearance="outline"
                style={styles.modalButton}
                onPress={() => handleModalBack(false)}
                accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="arrow-ios-back-outline" style={styles.modalButtonIcon} />}
              >
                Back
              </Button>
              <Button
                appearance="outline"
                style={styles.modalButton}
                onPress={() => handleModalSave()}
                accessoryLeft={(props) => <Icon {...props} fill={theme["color-primary-500"]} name="checkmark-outline" style={styles.modalButtonIcon} />}
              >
                Save
              </Button>
            </View>
          </Card>
        </Modal>
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
    openModalIcon: {
      width: 30,
      height: 30,
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
      width: "90%",
    },
    modalCard: {
      justifyContent: "center",
      alignItems: "center",
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 20,
      marginBottom: 25,
    },
    modalButton: {
      height: 50,
      width: 100,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    modalButtonIcon: {
      height: 30,
      width: 30,
      padding: 0,
      margin: 0,
    },
    featuresContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      paddingTop: 15,
      paddingBottom: 15,
    },
    featuresCard: {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0,
    },
    featuresButton: {
      width: 70,
      height: 70,
    },
    featuresTitle: {
      fontSize: 26,
      alignSelf: "center",
      marginTop: 10,
      paddingBottom: 15,
    },
    featuresDesc: {
      alignSelf: "center",
      marginTop: 5,
    },
    featuresIcon: {
      width: 30,
      height: 30,
    },
    timerContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexWrap: "wrap",
      paddingTop: 20,
      paddingBottom: 40,
    },
    timerCard: {
      margin: 0,
      padding: 0,
    },
    timerSelect: {
      width: 100,
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
    },
  });
