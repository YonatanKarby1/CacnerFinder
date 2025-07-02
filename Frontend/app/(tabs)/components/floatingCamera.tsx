import { TouchableOpacity } from "react-native";
import commonStyles from "../styles/common";
import { Camera } from "lucide-react-native";

interface FloatingCameraProps {
    onClick: () => void;
}   

const FloatingCamera = ({ onClick }: FloatingCameraProps) => {
    return (
        <TouchableOpacity style={commonStyles.floatingActionButton} onPress={onClick}>
          <Camera size={28} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
    )
}

export default FloatingCamera;