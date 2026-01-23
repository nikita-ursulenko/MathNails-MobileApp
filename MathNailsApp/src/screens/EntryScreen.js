import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native';
import AddButton from '../components/ui/AddButton';
import EntryModal from '../components/modals/EntryModal';
import ModalDialog from '../components/modals/ModalDialog';
import { AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import DataBase from '../../data/data';
import moment from 'moment';
import 'moment/locale/ru';
//style
import { useTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../assets/styles/styles';
moment.locale('ru');

// Компонент развернутого раздела
const ExpandableSection = ({ title, data, setSelectedDate, setSelectedIndex, setShowModal, }) => {
  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

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
        style={[styles.sectionHeader, {
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 16,
        }]}
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
          <Text style={[styles.headerText, { fontWeight: '600', color: theme === 'dark' ? 'white' : '#1E293B' }]}>{title}</Text>
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
            const isBar = appointment.paymentMethod === 'Bar';

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
                  <Text style={[styles.text, { fontWeight: '600', fontSize: 16, marginBottom: 4 }]}>
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
                  <Text style={[styles.text, { fontWeight: '700', fontSize: 18, color: '#6366F1' }]}>
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

const EntryScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workDone, setWorkDone] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [appointmentData, setAppointmentData] = useState({});
  const [isAddMode, setIsAddMode] = useState(false);

  //style 
  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;


  useEffect(() => {
    const loadWorkDone = async () => {
      try {
        const workDoneData = await DataBase.WorkDone.getDataFromDB();
        if (workDoneData) {
          const sortedWorkDone = Object.keys(workDoneData)
            .sort((a, b) => new Date(b) - new Date(a))
            .reduce((acc, key) => {
              acc[key] = workDoneData[key];
              return acc;
            }, {});
          setWorkDone(sortedWorkDone);
        } else {
          console.log('No data found in the database.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadWorkDone();
  }, []);

  // Состояние модального окна
  const openModalAdd = () => {
    setIsModalVisible(true);
    setIsAddMode(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsAddMode(false);
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
    // Удаление элемента из базы данных по индексу
    // Обновление данных на экране
    console.log('Deleted item:', date, index);
    await DataBase.WorkDone.deleteItemFromDB(date, index);
    setShowModal(false);
    loadWorkDone();
  };
  // Ручное добавление данных
  const handleAdd = async (data) => {
    // Здесь вы можете использовать полученные данные
    console.log('Received data:', data);
    await DataBase.WorkDone.saveDataToDB(data);
    loadWorkDone();

  };
  // Ручное изменение
  const handleEdit = async (updatedData) => {
    try {
      await DataBase.WorkDone.updateItemInDB(appointmentData.selectedDate, appointmentData.selectedIndex, updatedData);
      loadWorkDone(); // Вызов для перезагрузки данных
    } catch (error) {
      console.error('Failed to update data:', error);
    }
  };
  // Removed CustomModal hook usage as we now use EntryModal component directly
  // Загрузка данных из ДБ
  const loadWorkDone = async () => {
    const workDoneList = await DataBase.WorkDone.getDataFromDB();
    if (workDoneList) {
      console.log('Work done:', workDoneList);
      setWorkDone(workDoneList);
    } else {
      console.log('No data found in the database.');
    }
  };

  return (
    <View style={styles.container} animationType="slide">
      <ScrollView>
        <View style={styles.container}>
          {Object.keys(workDone).map((date) => (
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
      </ScrollView>
      <EntryModal
        visible={isModalVisible}
        onClose={closeModal}
        onAdd={handleAdd}
        onEdit={handleEdit}
        isAddMode={isAddMode}
        appointmentData={{ selectedDate, selectedIndex, workDone }}
      />
      <AddButton onPress={openModalAdd} />
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