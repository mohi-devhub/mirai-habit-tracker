import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { LoadingScreen } from "./src/components/LoadingScreen";
import { MascotProvider } from "./src/components/MascotProvider";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <MascotProvider>
            <AppNavigator />
          </MascotProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
