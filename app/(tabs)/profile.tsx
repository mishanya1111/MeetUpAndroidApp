import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeToggleButton} from '@/components/ThemeToggleButton';
import {ThemedText} from '@/components/styleComponent/ThemedText';
import {BackgroundView} from '@/components/styleComponent/BackgroundView';
import {useRouter} from 'expo-router';
import {SIGN_IN, SIGN_UP} from '@/constant/router';
import {useAuth} from "@/context/AuthContext";
import React from "react";

export default function Profile() {
  const router = useRouter();
  const {name} = useAuth();
  return (
    <BackgroundView>
      <ThemedText style={[styles.titleContainer]}> Profile</ThemedText>
      <ThemeToggleButton/>
      <TouchableOpacity
        onPress={() => {
          router.push(SIGN_IN);
        }}
      >
        <ThemedText>Login IN</ThemedText>
      </TouchableOpacity>
      <ThemedText> {name}</ThemedText>

      <View style={}>
        <TouchableOpacity onPress={() => router.push(SIGN_UP)}>
          <Text style={styles.link}>Don’t have an account? Sign up!</Text>
        </TouchableOpacity>
      </View>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 20
  }
});
