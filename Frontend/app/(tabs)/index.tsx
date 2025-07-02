import React from 'react';
import { View, Text } from 'react-native';
import commonStyles from './styles/common';
import FloatingCamera from './components/floatingCamera';
import { useRouter } from 'expo-router';
import { PastMoles } from './components/pastMole/pastMoles';

export default function ScanScreen() {
  const router = useRouter();
  return (
    <View style={commonStyles.container}>
      <PastMoles />
      <FloatingCamera onClick ={() => {
        router.push('/capture');
      }} />
    </View>
  );
}