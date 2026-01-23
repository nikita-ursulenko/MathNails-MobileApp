import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeProvider';

const CloseModal = ({ onPress }) => {
    return (
        <TouchableOpacity
            className="absolute z-10 top-12 right-5"
            onPress={onPress}
        >
            <AntDesign name="closecircle" size={40} color="red" />
        </TouchableOpacity>
    );
};

export default CloseModal;
