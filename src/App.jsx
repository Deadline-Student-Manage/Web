import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Balance from './components/Balance';
import MonthlyExpenseList from './components/MonthlyExpenseList'; // Component mới

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(1000000);
  const [selectedView, setSelectedView] = useState('month');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    setTransactions([
      ...transactions,
      { id: Date.now(), ...newTransaction },
    ]);

    const transactionMonth = new Date(newTransaction.date).getMonth();
    const transactionYear = new Date(newTransaction.date).getFullYear();
    const monthKey = `${transactionYear}-${transactionMonth}`; 

    setMonthlyExpenses(prevExpenses => ({
      ...prevExpenses,
      [monthKey]: (prevExpenses[monthKey] || 0) + newTransaction.amount
    }));
  };

  const calculateTotal = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'week':
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(0);
        endDate = new Date();
    }

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return isWithinInterval(transactionDate, { start: startDate, end: endDate });
      })
      .reduce((total, transaction) => {
        return transaction.type === 'expense'
          ? total - transaction.amount
          : total + transaction.amount;
      }, 0);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const handleDeleteAllData = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu?")) {
      setTransactions([]);
      setMonthlyExpenses({});
      localStorage.removeItem('transactions');
    }
  };

  const handleViewChange = (view) => {
    if (view === 'month') {
      // Reset ngân sách (hoặc thêm logic để người dùng tự nhập)
      setBudget(1000000); 

      // Lưu tổng chi tiêu của tháng hiện tại
      const today = new Date();
      const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
      setMonthlyExpenses(prevExpenses => ({
        ...prevExpenses,
        [currentMonthKey]: calculateTotal('month')
      }));
    }
    setSelectedView(view);
  };

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
    setIsEditingBudget(false);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Quản Lý Chi Tiêu</h1>

      <div className="flex mb-4">
      <button
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedView === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleViewChange('all')}
        >
          Tất cả
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedView === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleViewChange('month')}
        >
          Tháng
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedView === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleViewChange('week')}
        >
          Tuần
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedView === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleViewChange('year')}
        >
          Năm
        </button>
      </div>

      <TransactionList 
        transactions={transactions} 
        selectedView={selectedView}
        onDelete={handleDeleteTransaction} 
      />

      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleDeleteAllData}
      >
        Xóa tất cả dữ liệu
      </button>

      <TransactionForm onAddTransaction={addTransaction} />

      <TransactionList transactions={transactions} selectedView={selectedView} />

      <Balance
        total={calculateTotal(selectedView)}
        budget={budget}
        onBudgetChange={handleBudgetChange}
        isEditingBudget={isEditingBudget}
        setIsEditingBudget={setIsEditingBudget}
      />

      <MonthlyExpenseList monthlyExpenses={monthlyExpenses} /> 
    </div>
  );
}

export default App;