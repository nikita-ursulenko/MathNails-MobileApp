import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import DataBase from '../../../data/data';
import { useTheme } from '../../../context/ThemeProvider';
import SwipeableModal from '../ui/SwipeableModal';
import Button from '../ui/Button';
import { getColors, typography, spacing, borderRadius, shadows } from '../../theme';

const EntryModal = ({ visible, onClose, onAdd, onEdit, appointmentData, isAddMode }) => {
    const [service, setService] = useState('');
    const [cost, setCost] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bar');
    const [notes, setNotes] = useState('');
    const [clientName, setClientName] = useState('');
    const [comments, setComments] = useState('');
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    // UI States
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showSelectedPicker, setShowSelectedPicker] = useState(false);
    const [payWithBar, setPayWithBar] = useState(true);
    const [payWithCard, setPayWithCard] = useState(false);
    const [person, setPerson] = useState('');

    const { theme } = useTheme();
    const colors = getColors(theme);

    // Initial load
    useEffect(() => {
        const today = new Date();
        setDate(today);
        setFormattedDate(formatDate(today));
        loadServices();
    }, []);

    // Watch for visibility or data changes to reset/populate form
    useEffect(() => {
        if (visible) {
            if (isAddMode) {
                handleClearInput();
            } else if (appointmentData && appointmentData.selectedDate) {
                // Edit mode population
                const appointment = appointmentData.workDone[appointmentData.selectedDate][appointmentData.selectedIndex];
                if (appointment) {
                    setService(appointment.service);
                    setSelectedService(appointment.service.id);
                    setCost(appointment.cost.toString());
                    handlePayMethod(appointment.paymentMethod);
                    setPerson(appointment.person);
                    setNotes(appointment.notes);
                    setClientName(appointment.clientName);
                    setComments(appointment.comments);
                    setFormattedDate(appointment.formattedDate || appointmentData.selectedDate);
                    setDate(new Date(appointment.date));
                }
            }
        }
    }, [visible, isAddMode, appointmentData]);

    // Load services when picker is opened
    useEffect(() => {
        if (showSelectedPicker) {
            loadServices();
        }
    }, [showSelectedPicker]);

    const loadServices = () => {
        DataBase.Services.getAllServices()
            .then((data) => setServices(data))
            .catch((error) => console.error('Error loading services:', error));
    };

    const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `${dd}.${mm}.${yy}`;
    };

    const handleClearInput = () => {
        const today = new Date();
        setDate(today);
        setFormattedDate(formatDate(today));
        setSelectedService(null);
        setService('');
        setCost('');
        setPaymentMethod('Bar');
        setPerson('');
        setPayWithBar(true);
        setPayWithCard(false);
        setNotes('');
        setClientName('');
        setComments('');
    };

    const handlePayMethod = (method) => {
        if (method === 'Bar') {
            setPayWithBar(true);
            setPayWithCard(false);
            setPaymentMethod('Bar');
        } else {
            setPayWithBar(false);
            setPayWithCard(true);
            setPaymentMethod('Card');
        }
    };

    const onChangeDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setFormattedDate(formatDate(currentDate));
    };

    const togglePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const handleSubmit = async () => {
        const data = {
            service,
            cost,
            paymentMethod,
            person,
            notes,
            clientName,
            comments,
            date: isAddMode ? date : date.toISOString(), // Keep consistent logic
            formattedDate
        };

        if (!service || !service.name) {
            alert('Пожалуйста, выберите услугу');
            return;
        }

        if (isAddMode) {
            await onAdd(data);
        } else {
            await onEdit(data);
        }

        onClose();
        handleClearInput();
    };

    const Label = ({ children, style }) => (
        <Text style={{
            fontSize: typography.fontSize.caption,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
            marginLeft: spacing.xs,
            ...style
        }}>{children}</Text>
    );

    const Input = (props) => (
        <TextInput
            {...props}
            style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: typography.fontSize.body,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: spacing.base,
                ...props.style
            }}
            placeholderTextColor={colors.textTertiary}
        />
    );

    return (
        <SwipeableModal
            visible={visible}
            onClose={() => { onClose(); handleClearInput(); }}
            theme={theme}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                <Text style={{ fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.extrabold, color: colors.text }}>
                    {isAddMode ? "Новая запись" : "Изменить запись"}
                </Text>
                <TouchableOpacity onPress={() => { onClose(); handleClearInput(); }}>
                    <Ionicons name="close-circle" size={28} color={colors.textTertiary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
                {showDatePicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, width: '90%', ...shadows.lg }}>
                                <DateTimePicker
                                    textColor={colors.text}
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => onChangeDate(selectedDate)}
                                />
                                <Button
                                    title="Подтвердить"
                                    variant="primary"
                                    onPress={() => { togglePicker(); }}
                                    style={{ marginTop: spacing.md }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                <Label>Дата</Label>
                <TouchableOpacity onPress={togglePicker}>
                    <Input
                        editable={false}
                        value={formattedDate}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                <Label>Категория</Label>
                <View style={{ flexDirection: 'row', marginBottom: spacing.base, backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.xs, borderWidth: 1, borderColor: colors.border }}>
                    <TouchableOpacity
                        onPress={() => {
                            setService(prev => ({ ...prev, category: 'Manicure' }));
                            setSelectedService(null);
                        }}
                        style={{ flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: (service?.category === 'Manicure' || !service?.category) ? colors.primary : 'transparent', borderRadius: borderRadius.sm }}
                    >
                        <Text style={{ color: (service?.category === 'Manicure' || !service?.category) ? colors.textInverse : colors.textSecondary, fontWeight: typography.fontWeight.semibold }}>Маникюр</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setService(prev => ({ ...prev, category: 'Pedicure' }));
                            setSelectedService(null);
                        }}
                        style={{ flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: service?.category === 'Pedicure' ? colors.primary : 'transparent', borderRadius: borderRadius.sm }}
                    >
                        <Text style={{ color: service?.category === 'Pedicure' ? colors.textInverse : colors.textSecondary, fontWeight: typography.fontWeight.semibold }}>Педикюр</Text>
                    </TouchableOpacity>
                </View>

                {showSelectedPicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, width: '90%', ...shadows.lg }}>
                                <Text style={{ fontSize: typography.fontSize.h4, fontWeight: typography.fontWeight.bold, color: colors.text, marginBottom: spacing.md, textAlign: 'center' }}>Выберите услугу</Text>
                                <Picker
                                    selectedValue={selectedService}
                                    onValueChange={(itemValue) => {
                                        setSelectedService(itemValue);
                                        const selected = services.find(s => s.id === itemValue);
                                        if (selected) {
                                            setService(selected);
                                            setCost(selected.cost.toString());
                                        }
                                    }}>
                                    <Picker.Item label="--- Выберите ---" value={null} color={colors.textTertiary} />
                                    {services
                                        .filter(s => {
                                            const activeCat = (service?.category || 'Manicure');
                                            return (s.category || 'Manicure') === activeCat;
                                        })
                                        .map((s, index) => (
                                            <Picker.Item key={index} label={`${s.name} (${s.cost}€)`} value={s.id} color={colors.text} />
                                        ))
                                    }
                                </Picker>
                                <Button
                                    title={"Подтвердить"}
                                    variant="primary"
                                    onPress={() => {
                                        setShowSelectedPicker(false);
                                    }}
                                    style={{ marginTop: spacing.md }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                <Label>Услуга</Label>
                <TouchableOpacity onPress={() => setShowSelectedPicker(true)}>
                    <Input
                        editable={false}
                        placeholder="Нажмите для выбора"
                        value={service ? service.name : ''}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                <Label>Стоимость (€)</Label>
                <Input
                    placeholder="0.00"
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="numeric"
                />

                <Label>Метод оплаты</Label>
                <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: spacing.md,
                            borderRadius: borderRadius.md,
                            backgroundColor: payWithBar ? 'rgba(34, 197, 94, 0.1)' : colors.surface,
                            borderWidth: 1,
                            borderColor: payWithBar ? '#22C55E' : colors.border,
                            gap: spacing.sm
                        }}
                        onPress={() => handlePayMethod('Bar')}
                    >
                        <MaterialCommunityIcons
                            name={payWithBar ? 'cash-check' : 'cash'}
                            size={20}
                            color={payWithBar ? '#166534' : colors.textTertiary}
                        />
                        <Text style={{ fontWeight: typography.fontWeight.semibold, color: payWithBar ? '#166534' : colors.textSecondary }}>Наличные</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: spacing.md,
                            borderRadius: borderRadius.md,
                            backgroundColor: payWithCard ? 'rgba(59, 130, 246, 0.1)' : colors.surface,
                            borderWidth: 1,
                            borderColor: payWithCard ? '#3B82F6' : colors.border,
                            gap: spacing.sm
                        }}
                        onPress={() => handlePayMethod('Card')}
                    >
                        <MaterialCommunityIcons
                            name={payWithCard ? 'credit-card-check' : 'credit-card'}
                            size={20}
                            color={payWithCard ? '#1E40AF' : colors.textTertiary}
                        />
                        <Text style={{ fontWeight: typography.fontWeight.semibold, color: payWithCard ? '#1E40AF' : colors.textSecondary }}>Терминал</Text>
                    </TouchableOpacity>
                </View>

                <Label>Имя клиента</Label>
                <Input
                    placeholder="Напр. Мария"
                    value={clientName}
                    onChangeText={setClientName}
                />

                <Label>Кто принял оплату</Label>
                <Input
                    placeholder="Напр. Салон"
                    value={person}
                    onChangeText={setPerson}
                />

                <Label>Чаевые (€)</Label>
                <Input
                    placeholder="0.00"
                    value={notes}
                    onChangeText={setNotes}
                    keyboardType="numeric"
                />

                <Label>Комментарии</Label>
                <Input
                    placeholder="..."
                    value={comments}
                    onChangeText={setComments}
                    multiline={true}
                    style={{ height: 80, textAlignVertical: 'top' }}
                />

                <Button
                    title={isAddMode ? "Добавить запись" : "Сохранить изменения"}
                    variant="primary"
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.md }}
                />
            </ScrollView>
        </SwipeableModal>
    );
};

export default EntryModal;
