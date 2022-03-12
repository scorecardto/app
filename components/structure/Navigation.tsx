import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppScreen} from '../../../types/AppScreen';

type INavigationProps = {
  screens: AppScreen[];
};

const Tab = createBottomTabNavigator();

export default function Navigation({screens}: INavigationProps) {
  return (
    <Tab.Navigator>
      {screens.map((screen, idx) => {
        return (
          <React.Fragment key={idx}>
            <Tab.Screen
              name={screen.title}
              component={screen.component}
              options={{
                tabBarShowLabel: false,
              }}
            />
          </React.Fragment>
        );
      })}
    </Tab.Navigator>
  );
}
