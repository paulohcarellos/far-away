import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Layout, Button, Icon, Spinner, useTheme } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function DashboardScreen() {
  const theme = useTheme()
  const styles = getStyles(theme)

  const [iconName, setIconName] = useState('lock-outline')
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const [loadingIcon, setLoadingIcon] = useState(false)

  const lockIconRef = useRef();

  const openLock = () => {
    setOpening(true)
    axios.post('http://192.168.15.187:8000/trigger/', {'device_guid': 'c4135d2ca2fa49a9b6f05ce775981ff8'})
        .then(response => {
          setOpened(response.data.success)
        })
        .catch(error => {
          console.log(error);
        });
  }

  useEffect(() => {setLoadingIcon(opening)}, [opening]);

  useEffect(() => {
    if (opened == true) {
      setOpening(false)

      lockIconRef.current.startAnimation()
      setTimeout(() => {
        setIconName('unlock-outline')
      }, 200)
    }
  }, [opened]);

  const onBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const LoadingIndicator = () => (
    <View style={[styles.indicator]}>
      {loadingIcon && <Spinner size='small' />}
    </View>
  );

  return (
    <Layout style={styles.layout}>
      <View style={styles.lockContainer}>
        <View style={styles.lockIcon}>
          <Icon
            name={iconName}
            animation='shake'
            fill={theme['text-basic-color']}
            ref={lockIconRef}
          />
        </View>
        <View
          style={styles.footerContainer}
        >
          <Button
            style={styles.openButton}
            accessoryLeft={LoadingIndicator}
            appearance='outline'
            onPress={() => openLock()}
            size='large'
          >
            Open
          </Button>
        </View>
      </View>
    </Layout>
  );
};

const getStyles = theme => StyleSheet.create({
  layout: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockContainer: {
    height: 300,
    width: 300,
    borderWidth: 1,
    borderColor: theme['border-basic-color-4'],
    borderRadius: 12,
    justifyContent: 'space-evenly',
  },
  lockIcon: {
    height: '60%'
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 15,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    width: 150
  },
});