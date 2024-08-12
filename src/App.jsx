import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import Form from './components/Form';
import List from './components/List';
import Balance from './components/Balance';
import MonthlyList from './components/MonthlyList';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
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

    // Kiểm tra ngân sách sau khi thêm giao dịch
    const newTotal = calculateTotal(selectedView);
    
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

  const handleViewChange = (newView) => {
    setSelectedView(newView);

    // Kiểm tra xem tháng đã có ngân sách chưa, nếu chưa thì lấy giá trị hiện tại
    if (!budget[newView] && newView.length === 7 && newView.includes('-')) { 
      setBudget(prevBudget => ({
        ...prevBudget,
        [newView]: budget[selectedView]
      }));
    }

    // Kiểm tra ngân sách sau khi chuyển đổi chế độ xem
    const totalExpense = calculateTotal(newView);
    
  };

  const handleBudgetChange = (newBudget) => {
    setBudget(parseFloat(newBudget) || 0);
    setIsEditingBudget(false);
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
    setTransactions([]);
  };

  const handleDeleteLastExpense = () => {
    setTransactions(prevTransactions => {
      if (prevTransactions.length > 0) {
        return prevTransactions.slice(0, -1); 
      }
      return prevTransactions; 
    });
  };

  // Tạo danh sách tháng đã có chi tiêu
  const expenseMonths = Array.from(new Set(transactions.map(transaction => {
    const date = new Date(transaction.date);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  })));

  const handleMonthButtonClick = (month) => {
    setSelectedView(month);
  };

  // Sử dụng useEffect để cập nhật List sau khi budget thay đổi
  useEffect(() => {
    // Lúc này budget đã được cập nhật
  }, [budget]);

  const selectedMonthBudget = budget[selectedView] || 0;

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản Lý Chi Tiêu Cho Sinh Viên</h1>

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
      
      
      <h2>Lịch sử chi tiêu theo tháng:</h2>
      <div className="flex flex-wrap mb-4">
        {expenseMonths.map((month) => (
          <button
            key={month}
            className={`mr-2 mb-2 px-4 py-2 rounded-full ${
              selectedView === month ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleMonthButtonClick(month)}
          >
            {month}
          </button>
        ))}
      </div>

      <Form onAddTransaction={addTransaction} />

  <List
    transactions={transactions}
    selectedView={selectedView}
    onDelete={handleDeleteTransaction}
    budget={selectedMonthBudget}
  />

<Balance
  budget={budget}
  transactions={transactions}
  onBudgetChange={handleBudgetChange}
  isEditingBudget={isEditingBudget}
  setIsEditingBudget={setIsEditingBudget}
  onDeleteExpense={handleDeleteLastExpense} 
/>

<MonthlyList monthlyExpenses={monthlyExpenses} />

<button
  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
  onClick={handleDeleteAllData}
>
  Xóa tất cả dữ liệu
</button>


<footer className="text-center mt-8 text-gray-600">
  Created by AndyAnh174 and team 9 Summer Code Camp
</footer>
</div>
);
}

export default App;