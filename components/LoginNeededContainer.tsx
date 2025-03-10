import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ThemedText } from "@/components/styleComponent/ThemedText";
import { SIGN_IN } from "@/constant/router";
import { router } from "expo-router";

// возможные типы сообщений
type LoginMessageType = 'meetup_details' | 'owned_meetups' | 'subscribed_meetups' | 'profile';

// пропсы компонента
interface LoginNeededContainerProps {
    type: LoginMessageType;
}

export function LoginNeededContainer({ location }: LoginNeededContainerProps) {
    const messages: Record<LoginMessageType, string> = {
        meetup_details: 'You need to log in to view meetup details.',
        owned_meetups: 'You need to log in to view meetups you own.',
        subscribed_meetups: 'You need to log in to view meetups you have subscribed to.',
        profile: 'You need to log in to view your profile.'
    };

    return (
        <View style={styles.loginNeededContainer}>
            <ThemedText>{messages[location]}</ThemedText>

            <TouchableOpacity onPress={() => router.push(SIGN_IN)} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginNeededContainer: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        marginTop: 250
    },
    loginButton: {
        backgroundColor: '#3a6ff7',
        paddingVertical: 10,
        paddingHorizontal: 80,
        width: '80%',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
