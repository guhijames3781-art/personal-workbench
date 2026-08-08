/**
 * 本地数据存储模块
 * 所有数据持久化到 localStorage
 */

const Storage = {
    // 存储键名
    KEYS: {
        PLANS: 'workbench_plans',
        BILLS: 'workbench_bills',
        READING: 'workbench_reading',
        BODY: 'workbench_body',
        ENGLISH: 'workbench_english',
        SETTINGS: 'workbench_settings',
        INSPIRATION: 'workbench_inspiration_favs'
    },

    // 通用获取
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    // 通用设置
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    // ===== 计划相关 =====
    getPlans() {
        return this.get(this.KEYS.PLANS, []);
    },

    addPlan(plan) {
        const plans = this.getPlans();
        const newPlan = {
            id: Date.now(),
            name: plan.name,
            date: plan.date || new Date().toISOString().split('T')[0],
            note: plan.note || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        plans.push(newPlan);
        this.set(this.KEYS.PLANS, plans);
        return newPlan;
    },

    togglePlan(id) {
        const plans = this.getPlans();
        const plan = plans.find(p => p.id === id);
        if (plan) {
            plan.completed = !plan.completed;
            this.set(this.KEYS.PLANS, plans);
        }
        return plan;
    },

    deletePlan(id) {
        const plans = this.getPlans().filter(p => p.id !== id);
        this.set(this.KEYS.PLANS, plans);
    },

    getTodayPlans() {
        const today = new Date().toISOString().split('T')[0];
        return this.getPlans().filter(p => p.date === today);
    },

    getWeekPlans(weekStart) {
        const plans = this.getPlans();
        const start = new Date(weekStart);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return plans.filter(p => {
            const d = new Date(p.date);
            return d >= start && d < end;
        });
    },

    // ===== 记账相关 =====
    getBills() {
        return this.get(this.KEYS.BILLS, []);
    },

    addBill(bill) {
        const bills = this.getBills();
        const newBill = {
            id: Date.now(),
            type: bill.type || 'expense', // expense / income
            amount: parseFloat(bill.amount) || 0,
            category: bill.category || '餐饮',
            categoryIcon: bill.categoryIcon || '🍜',
            date: bill.date || new Date().toISOString().split('T')[0],
            note: bill.note || '',
            createdAt: new Date().toISOString()
        };
        bills.push(newBill);
        this.set(this.KEYS.BILLS, bills);
        return newBill;
    },

    deleteBill(id) {
        const bills = this.getBills().filter(b => b.id !== id);
        this.set(this.KEYS.BILLS, bills);
    },

    getMonthBills(year, month) {
        const bills = this.getBills();
        return bills.filter(b => {
            const d = new Date(b.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    },

    getMonthSummary(year, month) {
        const monthBills = this.getMonthBills(year, month);
        let expense = 0;
        let income = 0;
        monthBills.forEach(b => {
            if (b.type === 'expense') {
                expense += b.amount;
            } else {
                income += b.amount;
            }
        });
        return {
            expense: expense.toFixed(2),
            income: income.toFixed(2),
            balance: (income - expense).toFixed(2)
        };
    },

    // ===== 阅读相关 =====
    getReadingRecords() {
        return this.get(this.KEYS.READING, []);
    },

    addReading(record) {
        const records = this.getReadingRecords();
        const newRecord = {
            id: Date.now(),
            bookName: record.bookName,
            duration: record.duration || 0,
            pages: record.pages || 0,
            note: record.note || '',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        records.unshift(newRecord);
        this.set(this.KEYS.READING, records);
        return newRecord;
    },

    getReadingStreak() {
        const records = this.getReadingRecords();
        if (records.length === 0) return 0;
        
        const dates = [...new Set(records.map(r => r.date))].sort().reverse();
        let streak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < dates.length; i++) {
            const recordDate = new Date(dates[i]);
            recordDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((checkDate - recordDate) / (1000 * 60 * 60 * 24));
            if (diffDays === i) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    },

    // ===== 身体数据相关 =====
    getBodyData() {
        return this.get(this.KEYS.BODY, {
            height: 165,
            weight: 55,
            gender: 'female',
            activityLevel: 'moderate'
        });
    },

    setBodyData(data) {
        const current = this.getBodyData();
        const updated = { ...current, ...data };
        this.set(this.KEYS.BODY, updated);
        return updated;
    },

    calculateBMI(height, weight) {
        if (!height || !weight) return 0;
        const h = height / 100;
        return (weight / (h * h)).toFixed(1);
    },

    getBMIStatus(bmi) {
        if (bmi < 18.5) return { text: '偏瘦', color: '#2196F3' };
        if (bmi < 24) return { text: '正常', color: '#4CAF50' };
        if (bmi < 28) return { text: '偏重', color: '#FF9800' };
        return { text: '肥胖', color: '#F44336' };
    },

    calculateBMR(height, weight, age = 25, gender = 'female') {
        // Mifflin-St Jeor 公式
        if (gender === 'male') {
            return (10 * weight + 6.25 * height - 5 * age + 5).toFixed(0);
        } else {
            return (10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);
        }
    },

    calculateTDEE(bmr, activityLevel) {
        const factors = {
            sedentary: 1.2,      // 久坐
            light: 1.375,        // 轻度活动
            moderate: 1.55,      // 中度活动
            active: 1.725,       // 高度活动
            veryActive: 1.9      // 极高活动
        };
        return (bmr * (factors[activityLevel] || 1.55)).toFixed(0);
    },

    // ===== 英语学习相关 =====
    getEnglishData() {
        const today = new Date().toISOString().split('T')[0];
        const data = this.get(this.KEYS.ENGLISH, {
            date: today,
            ieltsCompleted: false,
            vocabularyCompleted: false,
            dialogueCompleted: false,
            ieltsWords: [],
            vocabWords: [],
            dialogue: null
        });
        
        // 如果不是今天的数据，重置完成状态
        if (data.date !== today) {
            data.date = today;
            data.ieltsCompleted = false;
            data.vocabularyCompleted = false;
            data.dialogueCompleted = false;
            this.set(this.KEYS.ENGLISH, data);
        }
        
        return data;
    },

    setEnglishData(data) {
        this.set(this.KEYS.ENGLISH, data);
    },

    toggleEnglish(type) {
        const data = this.getEnglishData();
        const key = type + 'Completed';
        data[key] = !data[key];
        this.set(this.KEYS.ENGLISH, data);
        return data;
    },

    // ===== 设置相关 =====
    getSettings() {
        return this.get(this.KEYS.SETTINGS, {
            nickname: '成长中的你',
            avatar: '🌱',
            stylePreference: '通勤',
            season: 'summer',
            skinTone: 'neutral',
            bodyType: 'average',
            monthlyBudget: 3000
        });
    },

    setSettings(settings) {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        this.set(this.KEYS.SETTINGS, updated);
        return updated;
    },

    // ===== 灵感收藏 =====
    getFavorites() {
        return this.get(this.KEYS.INSPIRATION, []);
    },

    addFavorite(item) {
        const favs = this.getFavorites();
        if (!favs.find(f => f.id === item.id)) {
            favs.unshift(item);
            this.set(this.KEYS.INSPIRATION, favs);
        }
    },

    removeFavorite(id) {
        const favs = this.getFavorites().filter(f => f.id !== id);
        this.set(this.KEYS.INSPIRATION, favs);
    },

    // ===== 数据导出/清空 =====
    exportAll() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.get(key);
        });
        return JSON.stringify(data, null, 2);
    },

    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};
