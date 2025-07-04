import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';

interface AnimatedSandClockProps {
  texts: string[];
}

export const AnimatedSandClock = ({ texts }: AnimatedSandClockProps) => {
  const [activeText, setActiveText] = useState(0);
  const barAnims = useRef([
    new Animated.Value(24),
    new Animated.Value(24),
    new Animated.Value(24),
    new Animated.Value(24),
    new Animated.Value(24),
  ]).current;

  // Animate wave bars (safe, no state updates in animation callback)
  useEffect(() => {
    const animations = barAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 40,
            duration: 240,
            delay: i * 150,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 24,
            duration: 240,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 12,
            duration: 240,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 24,
            duration: 240,
            useNativeDriver: false,
          }),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => {
      animations.forEach((a) => a.stop());
    };
  }, []);

  // Cycle text with a timer (safe)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveText((prev) => (prev + 1) % texts.length);
    }, 1200); // Change text every 1.2 seconds
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <View style={styles.container}>
      {/* Wave bars animation */}
      <View style={styles.waveBarsContainer}>
        {barAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.waveBar,
              { height: anim },
            ]}
          />
        ))}
      </View>
      {/* Animated text */}
      <View style={styles.textContainer}>
        <Text style={styles.animatedText}>
          {texts[activeText]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  waveBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 48,
    gap: 6,
  },
  waveBar: {
    width: 8,
    height: 24,
    backgroundColor: '#F4D06F',
    borderRadius: 4,
    marginHorizontal: 3,
    shadowColor: '#F25F5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textContainer: {
    height: 32,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
}); 