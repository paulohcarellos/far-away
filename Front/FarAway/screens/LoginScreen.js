import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Button, Input, Spinner } from '@ui-kitten/components';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false)

  const handleLogin = () => {
    setLoadingIcon(true)
    axios.post('http://192.168.15.187:8000/login/', {'username': username, 'password': password})
        .then(async response => {
          if (response.status == 200) {
            await SecureStore.setItemAsync('authToken', response.data);
            navigation.navigate('Dashboard')
          }
        })
        .catch(error => {
          console.log(error);
          setLoadingIcon(false)
        });
  }

  const LoadingIndicator = () => (
    <View style={[styles.indicator]}>
      {loadingIcon && <Spinner size='small' />}
    </View>
  );

  return (
    <Layout style={styles.layout}>
      <View style={styles.container}>
        <Input
          style={styles.input}
          label='Email'
          placeholder='Email address'
          autoCapitalize='none'
          onChangeText={setUsername}
        />
        <Input
          style={styles.input}
          label='Password'
          placeholder='Password'
          autoCapitalize='none'
          secureTextEntry={hidden}
          onChangeText={setPassword}
        />
        <Button
          style={styles.button}
          accessoryLeft={LoadingIndicator}
          appearance='outline'
          onPress={() => handleLogin()}
        >
          Login
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 2,
  },
  indicator: {
    position: 'absolute',
    left: '5%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '60%'
  },
  input: {
    paddingBottom: 16,
  }
});