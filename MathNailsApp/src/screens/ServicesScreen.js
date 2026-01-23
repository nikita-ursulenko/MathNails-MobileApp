import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import DataBase from '../../data/data';
import ButtonSpecial from '../components/ui/ButtonSpecial';
import AddButton from '../components/ui/AddButton';
import CloseModal from '../components/ui/CloseModal';
import SwipeableModal from '../components/ui/SwipeableModal';
import ScreenHeader from '../components/ui/ScreenHeader';
import { useTheme } from '../../context/ThemeProvider';
import { getColors, typography, spacing, borderRadius, shadows } from '../theme';

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

  const { theme } = useTheme();
  const colors = getColors(theme);

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
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.base,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...shadows.sm,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ ...typography.styles.h4, color: colors.text }}>{item.name}</Text>
        <Text style={{ ...typography.styles.h3, color: colors.primary, fontWeight: typography.fontWeight.bold }}>{item.cost}€</Text>
      </TouchableOpacity>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: spacing.base, paddingBottom: 80 }}
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
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: activeTab === value ? colors.primary : 'transparent'
      }}
    >
      <Text style={{
        fontWeight: typography.fontWeight.bold,
        color: activeTab === value ? colors.primary : colors.textSecondary,
        fontSize: typography.fontSize.body
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const CategoryPicker = ({ selected, onSelect }) => (
    <View style={{ flexDirection: 'row', marginBottom: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.xs, borderWidth: 1, borderColor: colors.border }}>
      <TouchableOpacity
        onPress={() => onSelect('Manicure')}
        style={{ flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: selected === 'Manicure' ? colors.primary : 'transparent', borderRadius: borderRadius.sm }}
      >
        <Text style={{ color: selected === 'Manicure' ? colors.textInverse : colors.textSecondary, fontWeight: typography.fontWeight.semibold }}>Маникюр</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelect('Pedicure')}
        style={{ flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: selected === 'Pedicure' ? colors.primary : 'transparent', borderRadius: borderRadius.sm }}
      >
        <Text style={{ color: selected === 'Pedicure' ? colors.textInverse : colors.textSecondary, fontWeight: typography.fontWeight.semibold }}>Педикюр</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SwipeableModal visible={isModalVisible} onClose={closeModalAdd} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.bold, color: colors.text }}>Новая услуга</Text>
          <TouchableOpacity onPress={closeModalAdd}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs }}>Категория</Text>
        <CategoryPicker selected={serviceCategory} onSelect={setServiceCategory} />

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs }}>Название (под-услуга)</Text>
        <TextInput
          placeholder="Напр. Гель-лак"
          placeholderTextColor="#94A3B8"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
          style={{
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.body,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs, marginTop: spacing.md }}>Цена (€)</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#94A3B8"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
          keyboardType="numeric"
          style={{
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.body,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <ButtonSpecial title="Создать услугу" onPress={handleAddService} style={{ marginTop: 32 }} />
      </SwipeableModal>

      <SwipeableModal visible={IsModalVisibleSelect} onClose={() => setIsModalVisibleSelect(false)} theme={theme}>
        {selectedService && (
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#64748B', fontWeight: '600', marginBottom: 4 }}>{selectedService.category === 'Pedicure' ? 'ПЕДИКЮР' : 'МАНИКЮР'}</Text>
            <Text style={{ fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm, textAlign: 'center', color: colors.text }}>{selectedService.name}</Text>
            <Text style={{ fontSize: typography.fontSize.display, fontWeight: typography.fontWeight.extrabold, color: colors.primary }}>{selectedService.cost}€</Text>
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

      <SwipeableModal visible={IsModalVisibleSelectChange} onClose={() => setIsModalVisibleSelectChange(false)} theme={theme}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.bold, color: colors.text }}>Изменить услугу</Text>
          <TouchableOpacity onPress={() => setIsModalVisibleSelectChange(false)}>
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Отмена</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs }}>Категория</Text>
        <CategoryPicker selected={serviceCategory} onSelect={setServiceCategory} />

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs }}>Название</Text>
        <TextInput
          placeholder="Название услуги"
          placeholderTextColor="#94A3B8"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
          style={{
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.body,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <Text style={{ fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs, marginTop: spacing.md }}>Цена (€)</Text>
        <TextInput
          placeholder="Цена услуги"
          placeholderTextColor="#94A3B8"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
          keyboardType="numeric"
          style={{
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.body,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <ButtonSpecial title="Сохранить" onPress={handleEditService} style={{ marginTop: 32 }} />
      </SwipeableModal>

      <ScreenHeader title="Услуги" subtitle="Ваш прейскурант" />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
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
