import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ChoresScreen from '../screens/ChoresScreen';
import AddChoreScreen from '../screens/AddChoreScreen';
import CreateHomeScreen from '../screens/CreateHomeScreen';
import InviteRoommatesScreen from '../screens/InviteRoommatesScreen';
import AccountScreen from '../screens/AccountScreen';
import JoinHomeScreen from '../screens/JoinHomeScreen';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          height: 64,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'home-outline';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Chores') {
            iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Chores" component={ChoresScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const MainNavigator = ({ hasHome }) => {
  const { home, pendingInviteForUser } = useAppContext();
  const initialRoute = hasHome ? 'HomeTabs' : pendingInviteForUser ? 'JoinHome' : 'CreateHome';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerTitleAlign: 'center',
        contentStyle: { backgroundColor: '#F6F7FB' },
      }}
    >
      <Stack.Screen
        name="CreateHome"
        component={CreateHomeScreen}
        options={{ title: 'Create your home' }}
      />
      <Stack.Screen
        name="JoinHome"
        component={JoinHomeScreen}
        options={{ title: 'Join your home' }}
      />
      <Stack.Screen
        name="InviteRoommates"
        component={InviteRoommatesScreen}
        options={{ title: home?.name || 'Invite roommates' }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Add expense' }}
      />
      <Stack.Screen
        name="AddChore"
        component={AddChoreScreen}
        options={{ title: 'Add chore' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
