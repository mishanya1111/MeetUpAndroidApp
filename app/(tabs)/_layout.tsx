import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/InitComponent/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
    const { activeTabs } = useThemeColors();

    const styles = StyleSheet.create({
        icon: {
            width: 28,
            height: 28,
            resizeMode: 'contain',
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16, // Делаем круглый аватар
            borderWidth: 2,
            borderColor: '#fff',
        },
    });

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeTabs,
                headerShown: false,
                tabBarButton: HapticTab,
                //tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: () => (
                        <Image source={require('@/assets/icons/find.png')} style={styles.icon} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: () => (
                        <Image source={require('@/assets/icons/favorite.png')} style={styles.icon} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: () => (
                        <Image source={require('@/assets/icons/profile.png')} style={styles.avatar} />
                    ),
                }}
            />
        </Tabs>
    );
}

