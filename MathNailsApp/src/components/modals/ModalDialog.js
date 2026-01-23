import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import { darkThemeComponents, lightThemeComponents } from '../../../assets/styles/StylesComponents';
import SwipeableModal from '../ui/SwipeableModal';
import CloseModal from '../ui/CloseModal';
import ButtonSpecial from '../ui/ButtonSpecial';

const ModalDialog = ({ visible, onClose, onEdit, onDelete, appointmentData }) => {

    const themeContext = useTheme();
    const theme = themeContext?.theme || 'light';
    const styles = theme === 'dark' ? darkThemeComponents : lightThemeComponents;

    // Проверка на наличие appointmentData и соответствующих данных
    const appointment = appointmentData &&
        appointmentData.workDone &&
        appointmentData.selectedDate && // check for selectedDate existence
        appointmentData.workDone[appointmentData.selectedDate] &&
        appointmentData.workDone[appointmentData.selectedDate][appointmentData.selectedIndex];

    return (
        <SwipeableModal visible={visible} onClose={onClose} styles={styles} theme={theme}>
            <CloseModal onPress={() => { onClose(); }} />
            <View>
                {appointment && (
                    <Text style={[styles.text, { fontSize: 20, lineHeight: 35 }]}>
                        {/* Вывод информации о выбранном приеме */}
                        {appointment.formattedDate && <Text>{appointment.formattedDate} {'\n'}</Text>}
                        {appointment.service?.name && <Text>{appointment.service.name} {'\n'}</Text>}
                        {appointment.cost && <Text>Цена: {appointment.cost}€ {'\n'}</Text>}
                        {appointment.paymentMethod && <Text>Метод оплаты: {appointment.paymentMethod} {'\n'}</Text>}
                        {appointment.person && <Text>Кто принял оплату: {appointment.person} {'\n'}</Text>}
                        {appointment.notes && <Text>Чаевые: {appointment.notes} {'\n'}</Text>}
                        {appointment.clientName && <Text>Имя клиента: {appointment.clientName} {'\n'}</Text>}
                        {appointment.comments && <Text>Комментарий: {appointment.comments} {'\n'}</Text>}
                    </Text>
                )}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <ButtonSpecial
                    title="Изменить"
                    onPress={onEdit}
                    textStyle={{ fontSize: 20 }}
                />
                <ButtonSpecial
                    title="Удалить"
                    style={{ backgroundColor: "red" }}
                    textStyle={{ fontSize: 20, backgroundColor: "red" }}
                    onPress={onDelete}
                />
            </View>
        </SwipeableModal>
    );
};

export default ModalDialog;
