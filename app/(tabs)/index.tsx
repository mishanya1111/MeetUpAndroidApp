import {Image, StyleSheet, Platform, View, Text} from 'react-native';

import {useThemeColors} from "@/hooks/useThemeColors";
import {BackgroundView} from "@/components/styleComponent/BackgroundView";

export default function HomeScreen() {
  const { background } = useThemeColors();

  const styles = StyleSheet.create({
    titleContainer: {
      padding: 20,
      height: '100%'
    }
  });

  return (
      <BackgroundView >
        <Text style = {[styles.titleContainer]}> il</Text>
      </BackgroundView>
  );
}
