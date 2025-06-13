// Barcha amaliyotlarni ajratish uchun
export enum FinanceType { Income, Expense }

export enum BudgetType { Weekly, Monthly, Yearly }

export enum PaymentType { OneTime, Monthly }

export enum DebtType { Bank, Person, Investor, Creditor }

// Kirim/chiqimlar uchun asosiy category turi
export type Category = {
    id: string;
    name: string;
    emoji: string;
    type: FinanceType; // Kirim yoki chiqim
};

// Moliyaviy tranzaksiyalar uchun type
export type Transaction = {
    id: string;
    date: Date;
    amount: number;
    category: Category;
    note?: string;
    type: FinanceType;
};

// Byujetlar uchun asosiy type
export type Budget = {
    id: string;
    name: string; // Byujet nomi
    type: BudgetType; // Haftalik, Oylik, Yillik
    amount: number; // Hozirgi byujet miqdori
    categories: Category[]; // Ushbu byujetga tegishli kategoriyalar
    parent?: Budget; // Bog'langan byujet (foiz usuli uchun)
    percentage?: number; // Agar foiz usuli bo'lsa, ulush
    limit?: number; // Byujet chegarasi
};

// Qarzlar uchun asosiy type
export type Debt = {
    id: string;
    lender: string; // Kimdan olingan
    amount: number; // Qarz miqdori
    dueDate: Date; // Qarz qaytarish muddati
    paymentType: PaymentType; // To'lov turi
    debtType: DebtType; // Qarz turi
    category: Category; // Qarzni bog'laydigan kategoriya
    note?: string;
};


// Moliyaviy boshqaruv uchun asosiy sinf
export class FinanceManager {
    private categories: Category[] = [];
    private transactions: Transaction[] = [];
    private budgets: Budget[] = [];
    private debts: Debt[] = [];
  
    // === KATEGORIYALAR BO'YICHA ===
    createCategory(name: string, emoji: string, type: FinanceType): Category {
        const newCategory: Category = { id: this.generateId(), name, emoji, type };
        this.categories.push(newCategory);
        return newCategory;
    }

    getCategory(id: string): Category {
        return this.categories.find(c => c.id === id);
    }
  
    getCategories(): Category[] {
        return this.categories;
    }
  
    // === TRANZAKSIYALAR BO'YICHA ===
    addTransaction(
        date: Date, amount: number, categoryId: string,
        note: string, type: FinanceType
    ): Transaction {
        const category = this.categories.find((c) => c.id === categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        const newTransaction: Transaction = {
            id: this.generateId(), date, amount, category, note, type,
        };

        this.transactions.push(newTransaction);
        this.updateBudgetAmounts(category, amount, type);
        return newTransaction;
    }
  
    getTransactions(): Transaction[] {
        return this.transactions;
    }
  
    // === BYUJETLAR BO'YICHA ===
    createBudget(
        name: string, type: BudgetType, categories: Category[], 
        percentage?: number, parent?: Budget
    ): Budget {
        // const relatedCategories = this.categories.filter((c) => categories.includes(c));
        const limit = parent ? (parent.amount / 100 * percentage) : 0;

        const newBudget: Budget = {
            id: this.generateId(),
            name, 
            type, 
            amount: 0,
            categories,
            parent, percentage, limit
        };

        this.budgets.push(newBudget);
        return newBudget;
    }

    findChilds(parent: Budget){
        return this.budgets.map((budget) => budget.parent.id === parent.id);
    }
  
    updateBudgetAmounts(category: Category, amount: number, type: FinanceType): void {
        this.budgets.forEach((budget) => {
            if (budget.categories.some((c) => c.id === category.id)) {
                budget.amount += type === FinanceType.Income ? amount : -amount;
            }
        });
    }
  
    getBudgets(): Budget[] {
        return this.budgets;
    }
  
    // === QARZLAR BO'YICHA ===
    addDebt(
        lender: string, amount: number, dueDate: Date, paymentType: PaymentType,
        debtType: DebtType, categoryId: string, note?: string
    ): Debt {
        const category = this.categories.find((c) => c.id === categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        const newDebt: Debt = {
            id: this.generateId(), lender, amount, dueDate, 
            paymentType, debtType, category, note,
        };
        this.debts.push(newDebt);
        return newDebt;
    }
  
    getDebts(): Debt[] {
        return this.debts;
    }
  
    // === YORDAMCHI METODLAR ===
    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}
