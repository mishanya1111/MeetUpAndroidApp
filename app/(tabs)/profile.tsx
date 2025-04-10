import React, {useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Image, ScrollView, TextInput } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { LoginNeededContainer } from '@/components/LoginNeededContainer';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import Loader from '@/components/Loader';
import { CREATE_MEETUPS } from '@/constant/router';
import {router} from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProfile } from '@/hooks/useProfile';
import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

type ProfileProps = {
    targetProfileId?: number;
};

export default function Profile({ targetProfileId }: ProfileProps) {
    const { token, name, removeToken, saveName } = useAuth();
    const [ showModal, setShowModal ] = useState(false);
    const { headerFooter, buttonBg, text} = useThemeColors();
    const [isSaving, setIsSaving] = useState(false);
    const { userData, loading, error, updateProfile, isOwnProfile } = useProfile(targetProfileId);

    const [editableUserData, setEditableUserData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        user_description: '',
        tg_id: '',
    });

    useEffect(() => {
        if (userData) {
            setEditableUserData({
                ...editableUserData,
                ...userData
            });
        }
    }, [userData]);


    // сохраняем фото
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    useEffect(() => {
        if (userData?.photo) {
            setPhotoUri(userData.photo);
        }
    }, [userData?.photo]);

    const handlePickImage = async () => {
        // Запрашиваем разрешение на доступ к галерее
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }

        // Открываем файловый менеджер
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Квадратное изображение
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri); // Обновляем аватарку на экране
            // Можно отправить фото на сервер
            console.log('Selected image:', result.assets[0].uri);
        }
    };

    const handleLogout = useCallback(() => {
        removeToken();
        setShowModal(false);
    }, [removeToken]);

    const handleChange = (key, value) => {
        setEditableUserData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            console.log("Отправляемые данные:", { ...editableUserData, photo: photoUri });

            const updatedData = await updateProfile({ ...editableUserData, photo: photoUri });

            if (updatedData?.photo) {
                setPhotoUri(updatedData.photo);
            }

            if (updatedData?.username && updatedData.username !== name) {
                await saveName(updatedData.username);
            }

            Alert.alert("Success", "Данные профиля успешно обновлены!");
            console.log("Данные профиля успешно обновлены!");
        } catch (error) {
            console.error("Ошибка обновления профиля:", error);
            Alert.alert("Error", "Failed to update your profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    let content: React.JSX.Element;

    if (loading) {
        content = <Loader />;
    } else if (error) {
        content = <ThemedText>{error}</ThemedText>;
    } else if (!token) {
        content = (
            <>
                <ThemeToggleButton />
                <LoginNeededContainer message="You need to log in to view your profile and create meetups." />
            </>
        );
    } else if (isOwnProfile) {
        content = (
            <>
                <ThemeToggleButton />

                {/* Аватар + кнопка */}
                <View style={styles.avatarContainer}>
                    {photoUri && <Image source={{ uri: photoUri }} style={styles.profileImage} />}

                    <TouchableOpacity style={[styles.uploadButton, { backgroundColor: buttonBg }]} onPress={handlePickImage}>
                        <Text style={[styles.uploadButtonText, { color: "#f2f2f2" }]}>Upload photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Поля редактируемые */}
                <View style={styles.infoContainer}>
                    <Text style={[styles.label, { color: text }]}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableUserData.first_name || ''}
                        onChangeText={(val) => handleChange('first_name', val)}
                        placeholder="Enter your first name"
                        placeholderTextColor="#aaa"
                    />
                    <Text style={[styles.label, { color: text }]}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableUserData.last_name || userData?.last_name || ''}
                        onChangeText={(val) => handleChange('last_name', val)}
                        placeholder="Enter your last name"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={[styles.label, { color: text }]}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableUserData.username || userData?.username || ''}
                        onChangeText={(val) => handleChange('username', val)}
                        placeholder="Enter your username"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={[styles.label, { color: text }]}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableUserData.email || userData?.email || ''}
                        onChangeText={(val) => handleChange('email', val)}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={[styles.label, { color: text }]}>About Me:</Text>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        value={editableUserData.user_description || userData?.user_description || ''}
                        onChangeText={(val) => handleChange('user_description', val)}
                        placeholder="Enter your profile description"
                        multiline
                        placeholderTextColor="#aaa"
                    />

                    <Text style={[styles.label, { color: text }]}>Telegram ID:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableUserData.tg_id || userData?.tg_id || ''}
                        onChangeText={(val) => handleChange('tg_id', val)}
                        placeholder="Enter your Telegram ID"
                        placeholderTextColor="#aaa"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSaveChanges}
                    disabled={isSaving}
                >
                    <Text style={styles.saveButtonText}>{isSaving ? 'Pending...' : 'Save Changes'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createButton} onPress={() => router.push(CREATE_MEETUPS)}>
                    <Text style={styles.createButtonText}>Create Meetup</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </>
        );
    } else {
        content = (
            <>
                <View style={styles.avatarContainer}>
                    {photoUri && <Image source={{ uri: photoUri }} style={styles.profileImage} />}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>Name:</Text>
                        <ThemedText>{userData?.first_name || 'N/A'}</ThemedText>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>Last Name:</Text>
                        <ThemedText>{userData?.last_name || 'N/A'}</ThemedText>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>Username:</Text>
                        <ThemedText>{userData?.username || 'N/A'}</ThemedText>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>Email:</Text>
                        <ThemedText>{userData?.email || 'N/A'}</ThemedText>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>About:</Text>
                        <ThemedText>{userData?.user_description || 'N/A'}</ThemedText>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={[styles.label, { color: text }]}>Telegram ID:</Text>
                        <ThemedText>{userData?.tg_id || 'N/A'}</ThemedText>
                    </View>
                </View>
            </>
        );
    }

    return (
        <BackgroundView>
            <ScrollView contentContainerStyle={styles.container}>
                {content}
            </ScrollView>

            {/* Модальное окно выхода */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: headerFooter }]}>
                        <ThemedText>Are you sure you want to log out?</ThemedText>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleLogout} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </BackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10
    },
    uploadButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    infoContainer: {
        width: '100%',
        maxWidth: 400
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top'
    },
    infoBlock: {
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#1c8139',
        paddingVertical: 10,
        paddingLeft: 86,
        width: '80%',
        borderRadius: 8,
        marginTop: 15
    },
    disabledButton: {
        opacity: 0.6
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16
    },
    createButton: {
        backgroundColor: '#3a6ff7',
        paddingVertical: 10,
        width: '80%',
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center'
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    logoutButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 10,
        paddingHorizontal: 105,
        width: '80%',
        borderRadius: 8,
        marginTop: 30
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        height: 350,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20
    },
    confirmButton: {
        backgroundColor: '#FF4500',
        padding: 10,
        borderRadius: 5,
        width: 70,
        alignItems: 'center'
    },
    confirmButtonText: {
        color: '#fff'
    },
    cancelButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        width: 70,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#fff'
    },
    titleContainer: {
        padding: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});