
import AsyncStorage from '@react-native-async-storage/async-storage';

// Данные для профиля
export async function updateMasterData(firstName, lastName, commissionRate) {
  const masterData = {
    firstName: firstName,
    lastName: lastName,
    commissionRate: commissionRate,
  };

  try {
    await AsyncStorage.setItem('masterData', JSON.stringify(masterData));
    console.log('Master data saved successfully.');
  } catch (error) {
    console.error('Error saving master data:', error);
  }
};

const SERVICES_STORAGE_KEY = '@services';

export default class DataBase {
  // Класс для работы с услугами
  static Services = class {
    // Функция для проверки входных данных услуги
    static validateServiceInput(serviceName, servicePrice, serviceCategory) {
      if (!serviceName && !servicePrice) {
        throw new Error('serviceName and servicePrice should not be empty.');
      } else if (!serviceName) {
        throw new Error('serviceName should not be empty.');
      } else if (!servicePrice || isNaN(servicePrice)) {
        throw new Error('servicePrice should be a valid number and should not be empty.');
      } else if (!serviceCategory) {
        throw new Error('serviceCategory should not be empty.');
      }
    }

    // Функция для добавления новой услуги
    static async addService(serviceName, servicePrice, serviceCategory) {
      try {
        this.validateServiceInput(serviceName, servicePrice, serviceCategory);
        const currentServices = await this.getAllServices();
        const maxId = currentServices.reduce((max, service) => Math.max(max, service.id), 0);
        const newId = maxId + 1;

        const newService = {
          id: newId,
          name: serviceName,
          cost: +servicePrice,
          category: serviceCategory, // 'Manicure' or 'Pedicure'
        };

        const updatedServices = [...currentServices, newService];
        await AsyncStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updatedServices));
        return updatedServices;
      } catch (error) {
        console.error('Error adding service:', error);
        throw error;
      }
    }

    // Функция для получения всех услуг из AsyncStorage
    static async getAllServices() {
      try {
        const servicesJson = await AsyncStorage.getItem(SERVICES_STORAGE_KEY);
        return servicesJson ? JSON.parse(servicesJson) : [];
      } catch (error) {
        console.error('Error getting services:', error);
        throw error;
      }
    }

    // Функция для удаления услуги по идентификатору
    static async deleteServiceById(id) {
      try {
        const currentServices = await this.getAllServices();
        const updatedServices = currentServices.filter(service => service.id !== id);
        await AsyncStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updatedServices));
        return updatedServices;
      } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
      }
    }

    // Функция для обновления услуги по идентификатору
    static async updateServiceById(id, serviceName, servicePrice, serviceCategory) {
      try {
        this.validateServiceInput(serviceName, servicePrice, serviceCategory);
        const currentServices = await this.getAllServices();
        const serviceIndex = currentServices.findIndex(service => service.id === id);

        if (serviceIndex !== -1) {
          const updatedService = {
            id,
            name: serviceName,
            cost: +servicePrice,
            category: serviceCategory,
          };
          currentServices[serviceIndex] = updatedService;
          await AsyncStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(currentServices));
          return currentServices;
        } else {
          throw new Error(`Service with id ${id} not found.`);
        }
      } catch (error) {
        console.error('Error updating service:', error);
        throw error;
      }
    }
  };

  // Класс для работы с данными
  static WorkDone = class {
    // Сохранение данных в базу данных
    static async saveDataToDB(data) {
      try {
        const formattedDate = data.formattedDate;
        const workDoneString = await AsyncStorage.getItem('workDone');
        let workDone = workDoneString ? JSON.parse(workDoneString) : {};

        if (!workDone[formattedDate]) {
          workDone[formattedDate] = [];
        }
        workDone[formattedDate].push(data);

        await AsyncStorage.setItem('workDone', JSON.stringify(workDone));
        console.log('Data saved successfully!');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }

    // Получение данных из базы данных
    static async getDataFromDB() {
      try {
        const workDoneString = await AsyncStorage.getItem('workDone');
        let workDone = workDoneString ? JSON.parse(workDoneString) : {};

        // Преобразование даты для корректной сортировки
        const sortedWorkDone = {};
        Object.keys(workDone)
          .sort((a, b) => {
            const dateA = new Date(
              parseInt(a.slice(-2)),
              parseInt(a.slice(3, 5)) - 1,
              parseInt(a.slice(0, 2))
            );
            const dateB = new Date(
              parseInt(b.slice(-2)),
              parseInt(b.slice(3, 5)) - 1,
              parseInt(b.slice(0, 2))
            );
            return dateB - dateA;
          })
          .forEach((key) => {
            sortedWorkDone[key] = workDone[key];
          });

        return sortedWorkDone;
      } catch (error) {
        console.error('Error getting data:', error);
        throw error;
      }
    }

    // Удаление элемента из базы данных
    static async deleteItemFromDB(date, index) {
      try {
        const workDoneString = await AsyncStorage.getItem('workDone');
        let workDone = workDoneString ? JSON.parse(workDoneString) : {};

        if (workDone[date] && workDone[date].length > index) {
          workDone[date].splice(index, 1);

          await AsyncStorage.setItem('workDone', JSON.stringify(workDone));
          console.log('Item deleted successfully!');
        } else {
          console.log('Item not found in the database.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }

    //Изменение данных
    static async updateItemInDB(originalDate, index, newData) {
      try {
        const workDoneString = await AsyncStorage.getItem('workDone');
        let workDone = workDoneString ? JSON.parse(workDoneString) : {};

        // Проверка, существует ли запись для исходной даты и данного индекса
        if (workDone[originalDate] && workDone[originalDate][index]) {
          // Удаление старой записи
          workDone[originalDate].splice(index, 1);
          if (workDone[originalDate].length === 0) {
            delete workDone[originalDate]; // Удаляем пустой массив для даты, если больше нет записей
          }

          // Добавление записи к новой дате
          const newDate = newData.formattedDate;
          if (!workDone[newDate]) {
            workDone[newDate] = [];
          }
          workDone[newDate].push(newData);

          // Сохранение обновленных данных
          await AsyncStorage.setItem('workDone', JSON.stringify(workDone));
          console.log('Data updated successfully!');
        } else {
          console.log('No such item to update.');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        throw error;
      }
    }

    // Очистка данных из базы данных
    static async clearDataFromDB() {
      try {
        await AsyncStorage.removeItem('workDone');
        console.log('Data cleared successfully.');
        return true;
      } catch (error) {
        console.error('Error clearing data:', error);
        return false;
      }
    }
  };
}
