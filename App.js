import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
import ConnectionScreen from "./screens/ConnectionScreen"
import SignInScreen from "./screens/SignInScreen"
import SignUpScreen from "./screens/SignUpScreen"
import DogInfoFormScreen from "./screens/DogInfoFormScreen"
import DogProfileScreen from "./screens/DogProfileScreen"
import MapScreen from "./screens/MapScreen"
import TakePictureScreen from "./screens/TakePictureScreen"
import GalleryScreen from "./screens/GalleryScreen"
import InterestPoint from "./screens/InterestPoint"
import SettingsScreen from "./screens/SettingsScreen"
import BookmarksScreen from "./screens/BookmarksScreen.js"
import DiscussionsScreen from "./screens/DiscussionScreen.js"
import RequestScreen from "./screens/RequestScreen.js"
import ChatScreen from "./screens/ChatScreen.js"
import UserProfileScreen from "./screens/UserProfileScreen.js"
import ChatScreenCopy from "./screens/ChatScreenCopy.js"

import { persistStore, persistReducer } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Provider } from "react-redux"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { LogBox } from 'react-native';

import user from "./reducers/user.js"
import dog from "./reducers/dog.js"
const reducers = combineReducers({ user, dog })
const persistConfig = { key: "oufwouf", storage: AsyncStorage }
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
const persistor = persistStore(store)
LogBox.ignoreAllLogs();//Ignore all log notifications
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Connection"
              component={ConnectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Sign In"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Sign Up"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dog Info Form"
              component={DogInfoFormScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dog Profile"
              component={DogProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TakePicture"
              component={TakePictureScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Gallery"
              component={GalleryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Interest"
              component={InterestPoint}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Request"
              component={RequestScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Bookmarks"
              component={BookmarksScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Discussions"
              component={DiscussionsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreenCopy} //ChatScreen
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="userProfile"
              component={UserProfileScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )

  /*
            <Stack.Screen name="Bookmarks" component="BookmarksScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Hotspots" component="HotspotsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="TakePicture" component="TakePictureScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Gallery" component="GalleryScreen" options={{ headerShown: false }} />
  */
}
