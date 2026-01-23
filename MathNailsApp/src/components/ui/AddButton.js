import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeProvider';

const AddButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            className="absolute bottom-10 right-6 w-16 h-16 rounded-full bg-indigo-500 justify-center items-center z-50 shadow-lg shadow-indigo-500/40 elevation-10"
            onPress={onPress}
        >
            <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
    );
};

export default AddButton;
