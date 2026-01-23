import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import SwipeableModal from '../ui/SwipeableModal';
import Button from '../ui/Button';
import { getColors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const ModalDialog = ({ visible, onClose, onEdit, onDelete, appointmentData }) => {
    const { theme } = useTheme();
    const colors = getColors(theme);

    const appointment = appointmentData &&
        appointmentData.workDone &&
        appointmentData.selectedDate &&
        appointmentData.workDone[appointmentData.selectedDate] &&
        appointmentData.workDone[appointmentData.selectedDate][appointmentData.selectedIndex];

    if (!appointment) return null;

    const DetailItem = ({ icon, label, value, iconComponent: Icon = Ionicons }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}>
                <Icon name={icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.tiny, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: typography.fontWeight.bold }}>{label}</Text>
                <Text style={{ fontSize: typography.fontSize.body, color: colors.text, fontWeight: typography.fontWeight.semibold }}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SwipeableModal visible={visible} onClose={onClose} theme={theme}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
                <Text style={{ fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.extrabold, color: colors.text }}>Детали записи</Text>
                <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
                    <Ionicons name="close-circle" size={28} color={colors.textTertiary} />
                </TouchableOpacity>
            </View>

            <View style={{ marginBottom: spacing.xl }}>
                <DetailItem icon="calendar-outline" label="Дата" value={appointment.formattedDate || appointmentData.selectedDate} />
                <DetailItem icon="cut-outline" label="Услуга" value={appointment.service?.name || "Услуга"} />
                <DetailItem icon="cash-outline" label="Цена" value={`${appointment.cost}€`} />
                <DetailItem
                    icon={appointment.paymentMethod?.toLowerCase() === 'bar' ? "cash-outline" : "card-outline"}
                    label="Метод оплаты"
                    value={appointment.paymentMethod === 'Bar' ? 'Наличные' : 'Терминал'}
                />

                {appointment.clientName && (
                    <DetailItem icon="person-outline" label="Клиент" value={appointment.clientName} />
                )}

                {appointment.notes && (
                    <DetailItem icon="gift-outline" label="Чаевые" value={`${appointment.notes}€`} />
                )}

                {appointment.comments && (
                    <DetailItem icon="chatbubble-outline" label="Комментарий" value={appointment.comments} />
                )}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                    <Button
                        title="Изменить"
                        variant="secondary"
                        onPress={onEdit}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        title="Удалить"
                        variant="danger"
                        onPress={onDelete}
                    />
                </View>
            </View>
        </SwipeableModal>
    );
};

export default ModalDialog;
