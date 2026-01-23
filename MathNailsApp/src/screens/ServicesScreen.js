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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalVisibleSelect, setIsModalVisibleSelect] = useState(false);
  const [IsModalVisibleSelectChange, setIsModalVisibleSelectChange] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Manicure');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [activeTab, setActiveTab] = useState('Manicure');

  const themeContext = useTheme();
  const { theme } = themeContext;
  const styles = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    loadServices();
    if (selectedService) {
      setServiceName(selectedService.name);
      setServicePrice(selectedService.cost ? selectedService.cost.toString() : '');
      setServiceCategory(selectedService.category || 'Manicure');
    };
  }, [selectedService]);

  const loadServices = async () => {
    try {
      const allServices = await DataBase.Services.getAllServices();
      setServices(allServices);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
    }
  };

  const handleAddService = async () => {
    try {
      await DataBase.Services.addService(serviceName, servicePrice, serviceCategory);
      loadServices();
      closeModalAdd();
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteService = async () => {
    try {
      await DataBase.Services.deleteServiceById(selectedServiceId);
      await loadServices();
      setIsModalVisibleSelect(false);
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
    }
  };

  const handleEditService = async () => {
    try {
      await DataBase.Services.updateServiceById(selectedService.id, serviceName, servicePrice, serviceCategory);
      loadServices();
      setIsModalVisibleSelectChange(false);
    } catch (error) {
      console.error('Ошибка при изменении услуги:', error);
    }
  };

  const filteredServices = services.filter(s => (s.category || 'Manicure') === activeTab);

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

  const renderFlatList = () => {
    return (
      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#64748B' }}>Нет услуг в этой категории</Text>
          </View>
        )}
      />
    );
  };

  const openModalSelect = (item) => {
    if (item) {
      setSelectedServiceId(item.id);
      setSelectedService(item);
    }
    setIsModalVisibleSelect(true);
  };

  const closeModalAdd = () => {
    setIsModalVisible(false);
  };

  const openModalAdd = () => {
    setServiceName('');
    setServicePrice('');
    setServiceCategory(activeTab);
    setSelectedService(null);
    setErrorMessage('');
    setIsModalVisible(true);
  };

  const CategoryTab = ({ title, value }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(value)}
      style={{
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: activeTab === value ? '#6366F1' : 'transparent'
      }}
    >
      <Text style={{
        fontWeight: '700',
        color: activeTab === value ? '#6366F1' : '#64748B',
        fontSize: 16
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const CategoryPicker = ({ selected, onSelect }) => (
    <View style={{ flexDirection: 'row', marginBottom: 20, backgroundColor: theme === 'dark' ? '#1E293B' : '#F1F5F9', borderRadius: 12, padding: 4 }}>
      <TouchableOpacity
        onPress={() => onSelect('Manicure')}
        style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: selected === 'Manicure' ? '#6366F1' : 'transparent', borderRadius: 10 }}
      >
        <Text style={{ color: selected === 'Manicure' ? 'white' : '#64748B', fontWeight: '600' }}>Маникюр</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelect('Pedicure')}
        style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: selected === 'Pedicure' ? '#6366F1' : 'transparent', borderRadius: 10 }}
      >
        <Text style={{ color: selected === 'Pedicure' ? 'white' : '#64748B', fontWeight: '600' }}>Педикюр</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC' }]}>
      <SwipeableModal visible={isModalVisible} onClose={closeModalAdd} styles={styles} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: '700' }]}>Новая услуга</Text>
          <TouchableOpacity onPress={closeModalAdd}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 8, marginLeft: 4 }]}>Категория</Text>
        <CategoryPicker selected={serviceCategory} onSelect={setServiceCategory} />

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4 }]}>Название (под-услуга)</Text>
        <TextInput
          placeholder="Напр. Гель-лак"
          placeholderTextColor="#94A3B8"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
          style={[styles.text, styles.input]}
        />

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 4, marginLeft: 4, marginTop: 12 }]}>Цена (€)</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#94A3B8"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
          keyboardType="numeric"
          style={[styles.text, styles.input]}
        />

        <ButtonSpecial title="Создать услугу" onPress={handleAddService} style={{ marginTop: 32 }} />
      </SwipeableModal>

      <SwipeableModal visible={IsModalVisibleSelect} onClose={() => setIsModalVisibleSelect(false)} styles={styles} theme={theme}>
        {selectedService && (
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#64748B', fontWeight: '600', marginBottom: 4 }}>{selectedService.category === 'Pedicure' ? 'ПЕДИКЮР' : 'МАНИКЮР'}</Text>
            <Text style={[styles.text, { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' }]}>{selectedService.name}</Text>
            <Text style={[styles.text, { fontSize: 32, fontWeight: '800', color: '#6366F1' }]}>{selectedService.cost}€</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => { setIsModalVisibleSelect(false); setIsModalVisibleSelectChange(true) }}
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
      </SwipeableModal>

      <SwipeableModal visible={IsModalVisibleSelectChange} onClose={() => setIsModalVisibleSelectChange(false)} styles={styles} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={[styles.text, { fontSize: 24, fontWeight: '700' }]}>Изменить услугу</Text>
          <TouchableOpacity onPress={() => setIsModalVisibleSelectChange(false)}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.text, { fontSize: 14, color: '#64748B', marginBottom: 8, marginLeft: 4 }]}>Категория</Text>
        <CategoryPicker selected={serviceCategory} onSelect={setServiceCategory} />

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

      <View style={{ flex: 1 }}>
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Text style={[styles.text, { fontSize: 28, fontWeight: '800', marginBottom: 4 }]}>Услуги</Text>
          <Text style={{ color: '#64748B', fontSize: 16 }}>Ваш прейскурант</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme === 'dark' ? '#1E293B' : '#F1F5F9' }}>
          <CategoryTab title="Маникюр" value="Manicure" />
          <CategoryTab title="Педикюр" value="Pedicure" />
        </View>

        {renderFlatList()}
      </View>
      <AddButton onPress={openModalAdd} />
    </View>
  );
};
export default ServicesScreen;
