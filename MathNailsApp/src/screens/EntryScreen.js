import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native';
import AddButton from '../components/ui/AddButton';
import EntryModal from '../components/modals/EntryModal';
import ModalDialog from '../components/modals/ModalDialog';
import { AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import DataBase from '../../data/data';
import moment from 'moment';
import 'moment/locale/ru';
import { useTheme } from '../../context/ThemeProvider';
import { useData } from '../../context/DataContext';
import { loadDataFromDB } from '../utils/dataHelpers';
import ScreenHeader from '../components/ui/ScreenHeader';
import { getColors, typography, spacing, borderRadius, shadows } from '../theme';
moment.locale('ru');

const ExpandableSection = ({ title, data, setSelectedDate, setSelectedIndex, setShowModal }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  const [expanded, setExpanded] = useState(false);
  const mDate = moment(title, 'DD.MM.YY');
  const dayOfWeek = mDate.format('dddd');
  const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={{
          backgroundColor: colors.surface,
          paddingVertical: spacing.base,
          paddingHorizontal: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.sm,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: borderRadius.lg,
          marginBottom: spacing.md,
        }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <View style={{
            backgroundColor: dayOfWeek.includes('суббота') || dayOfWeek.includes('воскресенье') ? '#FEE2E2' : '#E0E7FF',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginRight: 12,
          }}>
            <Text style={{
              fontWeight: '700',
              color: dayOfWeek.includes('суббота') || dayOfWeek.includes('воскресенье') ? '#991B1B' : '#3730A3',
              fontSize: 14,
            }}>
              {capitalizedDay}
            </Text>
          </View>
          <Text style={[{ fontWeight: '600', color: colors.text, fontSize: typography.fontSize.body }]}>{title}</Text>
        </View>
        <AntDesign
          name={expanded ? "up" : "down"}
          size={20}
          color={theme === 'dark' ? "#94A3B8" : "#64748B"}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={{ paddingTop: 8, paddingHorizontal: 4 }}>
          {data.map((appointment, index) => {
            const serviceName = appointment.service?.name || "Услуга";
            const cost = appointment.cost || "0";
            const isBar = (appointment.paymentMethod || '').trim().toLowerCase() === 'bar';

            return (
              <TouchableOpacity
                style={[styles.contentItem, {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
                }]}
                key={index}
                onPress={() => {
                  setSelectedDate(title);
                  setSelectedIndex(index);
                  setShowModal(true);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.body, marginBottom: spacing.xs, color: colors.text }}>
                    {serviceName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      backgroundColor: isBar ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}>
                      <Text style={{ fontSize: 12, color: isBar ? '#166534' : '#1E40AF', fontWeight: '700' }}>
                        {isBar ? 'Наличные' : 'Терминал'}
                      </Text>
                    </View>
                    {appointment.clientName && (
                      <Text style={{ fontSize: 13, color: '#64748B', marginLeft: 8 }}>
                        • {appointment.clientName}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.h4, color: colors.primary }}>
                    {cost}€
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const EntryScreen = ({ reloadMainScreen, showAddButton = true }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workDone, setWorkDone] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [appointmentData, setAppointmentData] = useState({});
  const [isAddMode, setIsAddMode] = useState(false);
  const { updateData } = useData();
  const { theme } = useTheme();
  const colors = getColors(theme);


  const loadWorkDone = async () => {
    try {
      const workDoneData = await DataBase.WorkDone.getDataFromDB();
      if (workDoneData) {
        const sortedWorkDone = Object.keys(workDoneData)
          .sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('.').map(Number);
            const [dayB, monthB, yearB] = b.split('.').map(Number);
            const dateA = new Date(2000 + yearA, monthA - 1, dayA);
            const dateB = new Date(2000 + yearB, monthB - 1, dayB);
            return dateB - dateA;
          })
          .reduce((acc, key) => {
            acc[key] = workDoneData[key];
            return acc;
          }, {});
        setWorkDone(sortedWorkDone);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadWorkDone();
  }, [reloadMainScreen]);

  // Состояние модального окна
  const openModalAdd = () => {
    setIsModalVisible(true);
    setIsAddMode(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsAddMode(false);
    if (reloadMainScreen) reloadMainScreen();
    loadWorkDone();
  };

  const handleEditItem = (selectedDate, selectedIndex) => {
    setIsModalVisible(true);
    setShowModal(false);
    setIsAddMode(false);
    setAppointmentData({
      ...appointmentData,
      selectedDate: selectedDate,
      selectedIndex: selectedIndex,
    });
  };
  //Ручное удаление данных
  const handleDeleteItem = async (date, index) => {
    console.log('Deleted item:', date, index);
    await DataBase.WorkDone.deleteItemFromDB(date, index);
    setShowModal(false);
    await updateData(loadDataFromDB);
    loadWorkDone();
  };
  const handleAdd = async (data) => {
    // Здесь вы можете использовать полученные данные
    console.log('Received data:', data);
    await DataBase.WorkDone.saveDataToDB(data);
    await updateData(loadDataFromDB);
    loadWorkDone();
  };
  // Ручное изменение
  const handleEdit = async (updatedData) => {
    try {
      await DataBase.WorkDone.updateItemInDB(appointmentData.selectedDate, appointmentData.selectedIndex, updatedData);
      await updateData(loadDataFromDB);
      loadWorkDone();
    } catch (error) {
      console.error('Failed to update data:', error);
    }
  };


  // Grouping data by months for rendering
  const groupedByMonth = Object.keys(workDone).reduce((acc, date) => {
    const monthLabel = moment(date, 'DD.MM.YY').format('MMMM YYYY');
    if (!acc[monthLabel]) acc[monthLabel] = [];
    acc[monthLabel].push(date);
    return acc;
  }, {});

  // Sort months (newest first)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
    return moment(b, 'MMMM YYYY').diff(moment(a, 'MMMM YYYY'));
  });

  const MonthlySection = ({ monthLabel, dates }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            paddingVertical: spacing.base,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
            ...shadows.sm,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
            fontSize: typography.fontSize.h4,
            textTransform: 'capitalize'
          }}>
            {monthLabel}
          </Text>
          <AntDesign
            name={isExpanded ? "up" : "down"}
            size={20}
            color={theme === 'dark' ? "#94A3B8" : "#64748B"}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={{ paddingTop: 12 }}>
            {dates
              .filter(date => workDone[date] && workDone[date].length > 0)
              .map((date) => (
                <ExpandableSection
                  key={date}
                  title={date}
                  data={workDone[date]}
                  setSelectedDate={setSelectedDate}
                  setSelectedIndex={setSelectedIndex}
                  setShowModal={setShowModal}
                />
              ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Записи" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.md }}>
          {sortedMonths.length > 0 ? (
            sortedMonths.map(month => (
              <MonthlySection
                key={month}
                monthLabel={month}
                dates={groupedByMonth[month]}
              />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: spacing['4xl'], paddingVertical: spacing['3xl'] }}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.body }}>
                Нет записей за этот период
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <EntryModal
        visible={isModalVisible}
        onClose={closeModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        isAddMode={isAddMode}
        appointmentData={{ selectedDate, selectedIndex, workDone }}
      />
      {showAddButton && <AddButton onPress={openModalAdd} />}
      <ModalDialog
        visible={showModal}
        onClose={() => { setShowModal(false); }}
        onEdit={() => handleEditItem(selectedDate, selectedIndex)}
        onDelete={() => handleDeleteItem(selectedDate, selectedIndex)}
        appointmentData={{ selectedDate, selectedIndex, workDone }}
      />
    </View>
  );
};

export default EntryScreen;