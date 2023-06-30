import 'react-native-gesture-handler';

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

//en AppState se pueden colocar todos los proveedores

const AppState = ( { children }: { children: JSX.Element | JSX.Element[]}) => { //any
  return (
    <AuthProvider>
      <ProductsProvider>
        { children }
      </ProductsProvider> 
    </AuthProvider>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator/>
      </AppState>
    </NavigationContainer>
  )
}

export default App;