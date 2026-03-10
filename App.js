import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { AppProvider, useAppContext } from './context/AppContext';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';

const Root = () => {
  const { initializing, user, hasHome } = useAppContext();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F6F7FB',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 12, color: '#4B5563', fontWeight: '500' }}>
          Loading HomeOps…
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? <MainNavigator hasHome={hasHome} /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
};

export default App;
