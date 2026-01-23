import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';

const ButtonSpecial = ({ onPress, title, style, textStyle }) => {
    const themeContext = useTheme();
    // Safe check in case themeContext is undefined
    const theme = themeContext?.theme || 'light';

    return (
        <TouchableOpacity
            className="bg-indigo-500 py-3 px-6 rounded-xl items-center shadow-lg shadow-indigo-500/30 elevation-4"
            style={style}
            onPress={onPress}
        >
            <Text
                className={`text-lg font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-white'}`}
                style={textStyle}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default ButtonSpecial;
