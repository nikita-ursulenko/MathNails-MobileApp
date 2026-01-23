import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import DataBase from '../../../data/data';
import { useTheme } from '../../../context/ThemeProvider';
import { darkThemeComponents, lightThemeComponents } from '../../../assets/styles/StylesComponents';

import SwipeableModal from '../ui/SwipeableModal';
import ButtonSpecial from '../ui/ButtonSpecial';

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

    const themeContext = useTheme();
    const theme = themeContext?.theme || 'light';
    const styles = theme === 'dark' ? darkThemeComponents : lightThemeComponents;

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
                    setCost(appointment.cost);
                    handlePayMethod(appointment.paymentMethod);
                    setPerson(appointment.person);
                    setNotes(appointment.notes);
                    setClientName(appointment.clientName);
                    setComments(appointment.comments);
                    setFormattedDate(formatDate(new Date(appointment.date)));
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
        // Clearing is handled by useEffect when re-opening in Add mode, 
        // strictly speaking we don't need to clear on close, but it's safe.
        handleClearInput();
    };

    const renderServiceItems = () => {
        return services.map((service, index) => (
            <Picker.Item key={index} label={`${service.name}`} value={service.id} color={theme === 'dark' ? 'white' : 'black'} />
        ));
    };

    return (
        <SwipeableModal
            visible={visible}
            onClose={() => { onClose(); handleClearInput(); }}
            styles={styles}
            theme={theme}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 20 }}>
                <Text style={[styles.text, { fontSize: 24, fontWeight: '700' }]}>{isAddMode ? "Новая запись" : "Изменить запись"}</Text>
                <TouchableOpacity onPress={() => { onClose(); handleClearInput(); }}>
                    <AntDesign name="close" size={28} color={theme === 'dark' ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                {showDatePicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={styles.centerStyle}>
                            <View style={{ backgroundColor: theme === 'dark' ? '#1E293B' : 'white', borderRadius: 24, padding: 20, width: '90%' }}>
                                <DateTimePicker
                                    textColor={theme === 'dark' ? 'white' : 'black'}
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => onChangeDate(selectedDate)}
                                />
                                <ButtonSpecial
                                    title="Подтвердить"
                                    onPress={() => { togglePicker(); }}
                                    style={{ marginTop: 20 }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4 }]}>Дата</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    onChangeText={setFormattedDate}
                    value={formattedDate}
                    onPressIn={togglePicker}
                />

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Категория</Text>
                <View style={{ flexDirection: 'row', marginBottom: 12, backgroundColor: theme === 'dark' ? '#1E293B' : '#F1F5F9', borderRadius: 12, padding: 4 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setService(prev => ({ ...prev, category: 'Manicure' }));
                            setSelectedService(null);
                        }}
                        style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: (service?.category === 'Manicure' || !service?.category) ? '#6366F1' : 'transparent', borderRadius: 10 }}
                    >
                        <Text style={{ color: (service?.category === 'Manicure' || !service?.category) ? 'white' : '#64748B', fontWeight: '600' }}>Маникюр</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setService(prev => ({ ...prev, category: 'Pedicure' }));
                            setSelectedService(null);
                        }}
                        style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: service?.category === 'Pedicure' ? '#6366F1' : 'transparent', borderRadius: 10 }}
                    >
                        <Text style={{ color: service?.category === 'Pedicure' ? 'white' : '#64748B', fontWeight: '600' }}>Педикюр</Text>
                    </TouchableOpacity>
                </View>

                {showSelectedPicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={styles.centerStyle}>
                            <View style={{ backgroundColor: theme === 'dark' ? '#1E293B' : 'white', borderRadius: 24, padding: 20, width: '90%' }}>
                                <Text style={[styles.text, { fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' }]}>Выберите услугу</Text>
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
                                    <Picker.Item label="--- Выберите ---" value={null} color={theme === 'dark' ? '#94A3B8' : '#64748B'} />
                                    {services
                                        .filter(s => {
                                            const activeCat = (service?.category || 'Manicure');
                                            return (s.category || 'Manicure') === activeCat;
                                        })
                                        .map((s, index) => (
                                            <Picker.Item key={index} label={`${s.name} (${s.cost}€)`} value={s.id} color={theme === 'dark' ? 'white' : 'black'} />
                                        ))
                                    }
                                </Picker>
                                <ButtonSpecial
                                    title={"Подтвердить"}
                                    onPress={() => {
                                        setShowSelectedPicker(false);
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 4 }]}>Услуга</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    placeholder="Нажмите для выбора"
                    placeholderTextColor="#94A3B8"
                    value={service ? service.name : ''}
                    onPressIn={() => setShowSelectedPicker(true)}
                />

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Стоимость (€)</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="numeric"
                />

                <View style={[styles.container, { marginVertical: 20 }]}>
                    <TouchableOpacity
                        style={[styles.section, { backgroundColor: payWithBar ? 'rgba(34, 197, 94, 0.1)' : '#F1F5F9', flex: 1, marginRight: 8 }]}
                        onPress={() => handlePayMethod('Bar')}
                    >
                        <Ionicons
                            name={payWithBar ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={24}
                            color={payWithBar ? '#22C55E' : '#94A3B8'}
                        />
                        <Text style={[styles.paragraph, { color: payWithBar ? '#166534' : '#64748B' }]}>Наличные</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.section, { backgroundColor: payWithCard ? 'rgba(59, 130, 246, 0.1)' : '#F1F5F9', flex: 1, marginLeft: 8 }]}
                        onPress={() => handlePayMethod('Card')}
                    >
                        <Ionicons
                            name={payWithCard ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={24}
                            color={payWithCard ? '#3B82F6' : '#94A3B8'}
                        />
                        <Text style={[styles.paragraph, { color: payWithCard ? '#1E40AF' : '#64748B' }]}>Терминал</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4 }]}>Имя клиента</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    placeholder="Напр. Мария"
                    placeholderTextColor="#94A3B8"
                    value={clientName}
                    onChangeText={setClientName}
                />

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Кто принял оплату</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    placeholder="Напр. Салон"
                    placeholderTextColor="#94A3B8"
                    value={person}
                    onChangeText={setPerson}
                />

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Чаевые (€)</Text>
                <TextInput
                    style={[styles.text, styles.input]}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    value={notes}
                    onChangeText={setNotes}
                    keyboardType="numeric"
                />

                <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Комментарии</Text>
                <TextInput
                    style={[styles.text, styles.input, { height: 100, borderRadius: 16, paddingTop: 12 }]}
                    placeholder="..."
                    placeholderTextColor="#94A3B8"
                    value={comments}
                    onChangeText={setComments}
                    multiline={true}
                />

                <ButtonSpecial
                    style={{ marginTop: 32, marginBottom: 40 }}
                    textStyle={{ fontSize: 20 }}
                    title={isAddMode ? "Добавить" : "Сохранить изменения"}
                    onPress={handleSubmit}
                />
            </ScrollView>
        </SwipeableModal>
    );
};

export default EntryModal;
