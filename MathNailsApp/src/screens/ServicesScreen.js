import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import DataBase from '../../data/data';
import ButtonSpecial from '../components/ui/ButtonSpecial';
import AddButton from '../components/ui/AddButton';
import CloseModal from '../components/ui/CloseModal';
import SwipeableModal from '../components/ui/SwipeableModal';
import { useTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../assets/styles/styles';

const ServicesScreen = () => {
  // Все переменные которые используюся по названию и логике
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalVisibleSelect, setIsModalVisibleSelect] = useState(false);
  const [IsModalVisibleSelectChange, setIsModalVisibleSelectChange] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);// ID выбранной услуги
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    loadServices();
    if (selectedService) {
      setServiceName(selectedService.name);
      setServicePrice(selectedService.cost ? selectedService.cost.toString() : '');
    };
  }, [selectedService]);

  // Загрузка услуг
  const loadServices = async () => {
    try {
      const allServices = await DataBase.Services.getAllServices();
      setServices(allServices);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
    }
  };
  // Ручное добавления сервиса
  const handleAddService = async () => {
    try {
      await DataBase.Services.addService(serviceName, servicePrice);
      loadServices(); // Обновляем список услуг после добавления новой
      closeModalAdd(); // Закрываем модальное окно
      setErrorMessage('');
    } catch (error) {
      if (error.message === 'serviceName and servicePrice should not be empty.') {
        setErrorMessage('serviceName and servicePrice')
      } else if (error.message === 'serviceName should not be empty.') {
        setErrorMessage('serviceName')
      } else if (error.message === 'servicePrice should be a valid number and should not be empty.') {
        setErrorMessage('servicePrice')
      }
    }
  };
  // Ручное удаление услуги 
  const handleDeleteService = async () => {
    try {
      // Вызываем функцию удаления услуги
      await DataBase.Services.deleteServiceById(selectedServiceId);

      // После удаления обновляем список услуг
      await loadServices();

      // Закрываем модальное окно
      setIsModalVisibleSelect(false);
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
    }
  };
  // Ручное изменение услуги
  const handleEditService = async () => {
    try {
      await DataBase.Services.updateServiceById(selectedService.id, serviceName, servicePrice);
      loadServices();
      setIsModalVisibleSelectChange(false);
    } catch (error) {
      console.error('Ошибка при изменении услуги:', error);
    }
  };
  // Рендеринг всех елементов для отображения
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => openModalSelect(item)}
        style={{
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2,
          borderWidth: 1,
          borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
        }}
      >
        <Text style={[styles.text, { fontWeight: '600', fontSize: 18 }]}>{item.name}</Text>
        <Text style={[styles.text, { fontWeight: '700', fontSize: 20, color: '#6366F1' }]}>{item.cost}€</Text>
      </TouchableOpacity>
    );
  };
  // Функция для создания FlatList
  const renderFlatList = () => {
    return (
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  // Модальное окно выбора 
  const openModalSelect = (item) => {
    if (item) {
      setSelectedServiceId(item.id);
      setSelectedService(item);
    }
    setIsModalVisibleSelect(true);
  };

  const closeModalSelect = () => {
    setIsModalVisibleSelect(false);
  };

  // Модальное окно для изменения
  const openModalChange = () => {
    setIsModalVisibleSelectChange(true);
  };

  const closeModalChange = () => {
    setIsModalVisibleSelectChange(false);
  };

  // Модальное окно добавления
  const openModalAdd = () => {
    setIsModalVisible(true);
    setErrorMessage('');
    setServiceName('');
    setServicePrice('');
  };

  const closeModalAdd = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC' }]}>
      {/* Модальное окно для добавления новой услуги */}
      <SwipeableModal visible={isModalVisible} onClose={closeModalAdd} styles={styles} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: '700' }]}>Новая услуга</Text>
          <TouchableOpacity onPress={closeModalAdd}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4 }]}>Название</Text>
        <TextInput
          placeholder="Напр. Маникюр + Гель-лак"
          placeholderTextColor="#94A3B8"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
          style={[
            styles.text,
            styles.input,
            { borderColor: errorMessage === 'serviceName' || errorMessage === 'serviceName and servicePrice' ? '#EF4444' : '#E2E8F0' },
          ]}
        />

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Цена (€)</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#94A3B8"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
          keyboardType="numeric"
          style={[
            styles.text,
            styles.input,
            { borderColor: errorMessage === 'servicePrice' || errorMessage === 'serviceName and servicePrice' ? '#EF4444' : '#E2E8F0' },
          ]}
        />

        <ButtonSpecial title="Создать услугу" onPress={handleAddService} style={{ marginTop: 32 }} />
      </SwipeableModal>

      {/* Модальное окно для выбранной услуги */}
      <SwipeableModal visible={IsModalVisibleSelect} onClose={closeModalSelect} styles={styles} theme={theme}>
        {selectedService && (
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={[styles.text, { fontSize: 24, fontWeight: '700', marginBottom: 8 }]}>{selectedService.name}</Text>
            <Text style={[styles.text, { fontSize: 32, fontWeight: '800', color: '#6366F1' }]}>{selectedService.cost}€</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => { closeModalSelect(); openModalChange() }}
            style={{ flex: 1, backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginRight: 8 }}
          >
            <Text style={{ fontWeight: '700', color: theme === 'dark' ? 'white' : '#1E293B' }}>Изменить</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteService}
            style={{ flex: 1, backgroundColor: '#FEE2E2', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginLeft: 8 }}
          >
            <Text style={{ fontWeight: '700', color: '#991B1B' }}>Удалить</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={closeModalSelect} style={{ marginTop: 20 }}>
          <Text style={{ color: '#64748B', fontWeight: '500' }}>Закрыть</Text>
        </TouchableOpacity>
      </SwipeableModal>

      {/* Модальное окно для изменения выбранной услуги */}
      <SwipeableModal visible={IsModalVisibleSelectChange} onClose={closeModalChange} styles={styles} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: '700' }]}>Изменить услугу</Text>
          <TouchableOpacity onPress={closeModalChange}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4 }]}>Название</Text>
        <TextInput
          placeholder="Название услуги"
          placeholderTextColor="#94A3B8"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
          style={[styles.text, styles.input]}
        />

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Цена (€)</Text>
        <TextInput
          placeholder="Цена услуги"
          placeholderTextColor="#94A3B8"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
          keyboardType="numeric"
          style={[styles.text, styles.input]}
        />

        <ButtonSpecial title="Сохранить" onPress={handleEditService} style={{ marginTop: 32 }} />
      </SwipeableModal>

      {/* Список услуг */}
      <View style={{ flex: 1 }}>
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={[styles.text, { fontSize: 28, fontWeight: '800', marginBottom: 4 }]}>Услуги</Text>
          <Text style={{ color: '#64748B', fontSize: 16, marginBottom: 10 }}>Ваш прейскурант</Text>
        </View>
        {renderFlatList()}
      </View>
      <AddButton onPress={openModalAdd} />
    </View>
  );
};
export default ServicesScreen;
