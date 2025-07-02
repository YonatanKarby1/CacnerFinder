import { StyleSheet } from 'react-native';

const captureStyles = StyleSheet.create({
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#888', // grey
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(73, 73, 73, 0.05)',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(43, 42, 42, 0.1)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: '#e5e7eb', // light grey
    marginHorizontal: 16,
  },
  captureButton: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 85, 59, 0.1)', // grey
    marginHorizontal: 16,
  },
  captureButtonDisabled: {
    backgroundColor: '#d1d5db', // lighter grey
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default captureStyles; 