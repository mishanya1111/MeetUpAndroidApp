import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function Profile() {
	const router = useRouter();
	const { token, name, removeToken } = useAuth();
	const [showModal, setShowModal] = useState(false);
	const { headerFooter} = useThemeColors();
	const handleLogout = () => {
		removeToken();
		setShowModal(false);
	};

	return (
		<BackgroundView>
			<ThemeToggleButton />
			<ThemedText style={styles.titleContainer}>Profile</ThemedText>

			{token ? (
				<>
					<ThemedText>Hello, {name}!</ThemedText>
					<TouchableOpacity onPress={() => setShowModal(true)}>
						<ThemedText style={styles.logoutButton}>Logout</ThemedText>
					</TouchableOpacity>
				</>
			) : (
				<>
					<ThemedText>You need to log in to view your profile.</ThemedText>
					<TouchableOpacity onPress={() => router.push(SIGN_IN)}>
						<ThemedText style={styles.loginButton}>Login</ThemedText>
					</TouchableOpacity>
				</>
			)}

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
							<TouchableOpacity onPress={handleLogout}>
								<Text style={styles.confirmButton}>Yes</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => setShowModal(false)}>
								<Text style={styles.cancelButton}>No</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		padding: 20,
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	loginButton: {
		color: '#007BFF',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 10
	},
	logoutButton: {
		color: '#FF4500',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 10
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center'
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
		color: '#FF4500',
		fontSize: 16
	},
	cancelButton: {
		color: '#007BFF',
		fontSize: 16
	}
});
