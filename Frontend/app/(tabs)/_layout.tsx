import { Tabs } from 'expo-router';
import { Camera, History } from 'lucide-react-native';
import ReportScreen from './report';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ size, color }) => (
            <ReportScreen/>
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Take Photo',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}