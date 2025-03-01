import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constant/Colors';

export function useThemeColors() {
	const { theme } = useTheme();
	return Colors[theme]; // Возвращает объект с цветами для текущей темы
}
