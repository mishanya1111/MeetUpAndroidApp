import {Text, View , StyleSheet} from "react-native";
import {ThemeToggleButton} from "@/components/ThemeToggleButton";
import BackgroundView from "@/components/styleComponent/BackgroundView";


export default function Profile() {
    return (
        <BackgroundView style={styles.color}>
            <ThemeToggleButton />
          <Text> miha</Text>

        </BackgroundView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        padding: 20,
        backgroundColor: 'red'
    },
    color: {
        backgroundColor:'red'
    }
});
