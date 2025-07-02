import { MalenomaCatagories } from "@/app/common/malenomaCatagories";
import { Image, View, Text } from "react-native";

interface PastMoleProps {
    picture: string; // URI of the image
    catagory: MalenomaCatagories;
    confidence: number;
}

const backgroundColor = {
    'malignant': '#a85e5e',
    'benign': '#8cb55e',
    'unknown': '#bababa'
}

export const PastMole = ({ picture, catagory, confidence }: PastMoleProps) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            alignSelf: 'stretch',
            width: '100%',
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: '#888',
            borderRadius: 6,
            backgroundColor: backgroundColor[catagory],
            marginBottom: 4
        }}>
            <Image source={{ uri: picture }} style={{ width: 80, height: 80, resizeMode: 'cover', borderRadius: 6, margin: 8, backgroundColor: '#eee' }} />
            <Text style={{ flex: 1, textAlign: 'center' }}>{catagory}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{confidence}</Text>
        </View>
    );
}