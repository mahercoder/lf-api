import { BudgetType, FinanceManager, FinanceType } from "./finance-manager";

// === SINFDAN FOYDALANISH ===
const financeManager = new FinanceManager();

// Default categories
// "Daromad"
const salaryCategory = financeManager.createCategory("Maosh", "💼", FinanceType.Income); // Ish haqi uchun
const businessProfitCategory = financeManager.createCategory("Biznes foyda", "🏢", FinanceType.Income); // Biznes foydasi uchun
const salesCategory = financeManager.createCategory("Savdo", "🛒", FinanceType.Income); // Savdo uchun
const cryptoCategory = financeManager.createCategory("Kripto", "₿", FinanceType.Income); // Kripto valyuta uchun
const freelanceCategory = financeManager.createCategory("Frilans", "💻", FinanceType.Income); // Frilans ishlari uchun

// "Xayriya"
const parentsCategory = financeManager.createCategory("Ota-ona", "👨‍👩‍👧", FinanceType.Expense); // Ota-ona uchun
const donateCategory = financeManager.createCategory("Ehson", "🙏", FinanceType.Expense); // Xayriya uchun
const partyCategory = financeManager.createCategory("Bayram", "🎉", FinanceType.Expense); // Bayram uchun
const smallTravelCategory = financeManager.createCategory("Kichik sayohat", "🚗", FinanceType.Expense); // Kichik sayohatlar uchun
const smallGatheringCategory = financeManager.createCategory("Kichik yig'in", "🍽️", FinanceType.Expense); // Yig'inlar uchun

// "Ro'zg'or"
const costCategory = financeManager.createCategory("Xarajat", "💳", FinanceType.Expense); // Xarajatlar uchun
const eatingCategory = financeManager.createCategory("Yeb-ichar", "🍔", FinanceType.Expense); // Oziq-ovqat uchun
const communalCategory = financeManager.createCategory("Kommunal", "💡", FinanceType.Expense); // Kommunal to'lovlar uchun
const transportCategory = financeManager.createCategory("Transport", "🚌", FinanceType.Expense); // Transport xarajatlari uchun
const healthCategory = financeManager.createCategory("Salomatlik", "⚕️", FinanceType.Expense); // Sog'liq uchun

// "Orzular"
const travelCategory = financeManager.createCategory("Sayohat", "✈️", FinanceType.Expense); // Sayohatlar uchun
const gadgetCategory = financeManager.createCategory("Texnika", "📱", FinanceType.Expense); // Texnikalar uchun
const clothesCategory = financeManager.createCategory("Libos", "👗", FinanceType.Expense); // Liboslar uchun

// "Jamg'arma"
const investCategory = financeManager.createCategory("Investitsiya", "📈", FinanceType.Expense); // Investitsiya uchun
const partnershipCategory = financeManager.createCategory("Sheriklik", "🤝", FinanceType.Expense); // Hamkorliklar uchun
const knowledgeCategory = financeManager.createCategory("Ilm", "📚", FinanceType.Expense); // Ilm olish uchun
const unexpectedCategory = financeManager.createCategory("Kutilmagan vaziyat", "⚠️", FinanceType.Expense); // Favqulodda holatlar uchun
const debtExpenseCategory = financeManager.createCategory("Qarz", "💸", FinanceType.Expense); // Qarz to'lash uchun
const debtIncomeCategory = financeManager.createCategory("Qarz", "💵", FinanceType.Income); // Qarz olish uchun


// Default budgets
const incomeBudget = financeManager.createBudget(
    "Daromad", BudgetType.Monthly, 
    [ salaryCategory, businessProfitCategory, salesCategory, cryptoCategory, freelanceCategory ]
);

const financialProtection = financeManager.createBudget(
    "Moliyaviy himoya", BudgetType.Monthly, [], 10, incomeBudget
);

const donateBudget = financeManager.createBudget(
    "Xayriya", BudgetType.Monthly, [parentsCategory, donateCategory], 5, incomeBudget
);

const restBudget = financeManager.createBudget(
    "Xordiq", BudgetType.Monthly, 
    [partyCategory, smallTravelCategory, smallGatheringCategory], 
    10, incomeBudget
);

const remainBudget = financeManager.createBudget(
    "Qoldiq", BudgetType.Monthly, [], 75, incomeBudget
);

const houseBudget = financeManager.createBudget(
    "Ro'zg'or", BudgetType.Monthly, 
    [costCategory, eatingCategory, communalCategory, transportCategory, healthCategory], 
    45, remainBudget
);

const companyBudget = financeManager.createBudget(
    "Kompaniya puli", BudgetType.Monthly, 
    [], 55, remainBudget
);

const dreamBudget = financeManager.createBudget(
    "Orzular", BudgetType.Monthly, 
    [travelCategory, gadgetCategory, clothesCategory], 
    20, companyBudget
);

const fundBudget = financeManager.createBudget(
    "Jamg'arma", BudgetType.Monthly,
    [
        investCategory, partnershipCategory, knowledgeCategory, 
        unexpectedCategory, debtExpenseCategory, debtIncomeCategory
    ], 
    80, companyBudget
);