import React, { useEffect, useRef } from 'react';
import { View, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, PanResponder, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../context/ThemeProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SwipeableModal = ({ visible, onClose, children }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const onCloseRef = useRef(onClose);
    const { theme } = useTheme();

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (visible) {
            // Сбрасываем в начальное положение (внизу экрана) и плавно выезжаем вверх
            translateY.setValue(SCREEN_HEIGHT);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                    // Легкая вибрация, когда преодолели порог закрытия
                    if (gestureState.dy > SCREEN_HEIGHT * 0.4 && gestureState.dy < SCREEN_HEIGHT * 0.42) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Если протащили на 40% высоты экрана (почти половина) или скорость движения вниз большая
                if (gestureState.dy > SCREEN_HEIGHT * 0.4 || gestureState.vy > 0.5) {
                    Animated.timing(translateY, {
                        toValue: SCREEN_HEIGHT,
                        duration: 250,
                        useNativeDriver: true,
                    }).start(() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        if (onCloseRef.current) {
                            onCloseRef.current();
                        }
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 4,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Animated.View
                        className={`absolute bottom-0 w-full h-[90%] rounded-t-3xl shadow-2xl elevation-20 ${theme === 'dark' ? 'bg-slate-800 shadow-black' : 'bg-white shadow-black'}`}
                        style={{ transform: [{ translateY }] }}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={{ flex: 1 }}
                        >
                            <View {...panResponder.panHandlers} className="w-full items-center py-3">
                                <View className={`w-9 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} />
                            </View>
                            <View className="flex-1 px-5">
                                {children}
                            </View>
                        </KeyboardAvoidingView>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SwipeableModal;
