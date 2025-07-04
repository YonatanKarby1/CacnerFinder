import { View, Text } from "react-native"
import { AlertTriangle } from "lucide-react-native"
import styles from "../styles/report.styles"
import FloatingCamera from "./floatingCamera"
import { router } from "expo-router"

interface TakeAnotherPhotoPageProps {
    title: string;
    description: string;
}

export const TakeAnotherPhotoPage = ({ title, description }: TakeAnotherPhotoPageProps) => {
    return (
        <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={64} color="#ef4444" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>{title}</Text>
          <Text style={styles.errorText}>
            {description}
          </Text>
          <Text style={styles.takePhotoText} onPress={() => router.push('/capture')}>Take a photo</Text>
          <FloatingCamera onClick={() => router.push('/capture')} />
        </View>
      </View>
    )
}