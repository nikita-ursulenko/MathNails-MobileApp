import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const getCommissionRate = async () => {
    try {
        const masterDataString = await AsyncStorage.getItem('masterData');
        const masterData = JSON.parse(masterDataString);
        return masterData && masterData.commissionRate ? masterData.commissionRate / 100 : 0.4;
    } catch (error) {
        console.error('Error loading commission rate:', error);
        return 0.4;
    }
};

export const loadDataFromDB = async () => {
    try {
        const dataString = await AsyncStorage.getItem('workDone');
        const data = JSON.parse(dataString) || {};
        const commissionRate = await getCommissionRate();

        const formattedData = Object.keys(data)
            .filter(date => data[date] && data[date].length > 0)
            .map(date => {
                let totalCost = 0,
                    totalTips = 0,
                    myBar = 0,
                    moneySalon = 0,
                    earnings = 0;

                data[date].forEach(item => {
                    const itemCost = parseFloat(item.cost || '0') || 0;
                    const itemTips = parseFloat(item.notes || '0') || 0;

                    totalCost += itemCost;
                    totalTips += itemTips;
                    earnings += itemCost * commissionRate;

                    const payment = (item.paymentMethod || '').trim().toLowerCase();
                    // Проверяем на 'bar' или 'наличные'
                    if (payment === 'bar' || payment === 'наличные') {
                        myBar += itemCost;
                    } else {
                        moneySalon += itemCost;
                    }
                });

                const netProfit = earnings + totalTips;
                const debt = myBar - earnings;
                let debtStatus;
                if (debt > 0) {
                    debtStatus = 'Долг мастера';
                } else if (debt < 0) {
                    debtStatus = 'Долг салона';
                } else {
                    debtStatus = 'Никто никому не должен';
                }

                return {
                    date,
                    cost: totalCost,
                    tips: totalTips,
                    earnings,
                    netProfit,
                    myBar,
                    moneySalon,
                    debt,
                    debtStatus,
                };
            });

        return formattedData.sort((a, b) => {
            const dateA = moment(a.date, 'DD.MM.YY');
            const dateB = moment(b.date, 'DD.MM.YY');
            return dateB - dateA;
        });
    } catch (e) {
        console.error('Failed to load data', e);
        return [];
    }
};

export const transformData = (data) => {
    const transformedData = {};
    data.forEach(item => {
        const month = moment(item.date, 'DD.MM.YY').format('MM.YYYY');
        if (!transformedData[month]) {
            transformedData[month] = [];
        }
        transformedData[month].push(item);
    });

    const result = Object.keys(transformedData)
        .map(month => ({
            label: month,
            days: transformedData[month]
        }))
        .filter(monthGroup => monthGroup.days.length > 0)
        .sort((a, b) => {
            const dateA = moment(a.label, 'MM.YYYY');
            const dateB = moment(b.label, 'MM.YYYY');
            return dateB - dateA;
        });

    return result;
};
