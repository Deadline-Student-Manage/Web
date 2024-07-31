import React, { useState } from 'react';

const Balance = ({ total, budget, onBudgetChange, isEditingBudget, setIsEditingBudget, transactions }) => { 
  const [newBudget, setNewBudget] = useState(budget);

  const handleBudgetChange = (e) => {
    setNewBudget(parseFloat(e.target.value) || 0);
  };

  const handleBudgetSubmit = () => {
    onBudgetChange(newBudget);
    setIsEditingBudget(false); 
  };

  // Tính toán chi tiêu và thu nhập riêng
  const expenses = transactions.reduce((sum, transaction) => 
    transaction.type === 'expense' ? sum + transaction.amount : sum, 0
  );
  const income = transactions.reduce((sum, transaction) => 
    transaction.type === 'income' ? sum + transaction.amount : sum, 0
  );

  const remainingBudget = budget - expenses; 

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
      <h2 className="text-2xl font-bold mb-4">Tổng quan</h2>
      <div className="flex justify-between mb-4">
        <span className="font-bold">Ngân sách:</span>
        {isEditingBudget ? ( 
          <div>
            <input
              type="number"
              className="border rounded px-2 py-1 mr-2"
              value={newBudget}
              onChange={handleBudgetChange}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={handleBudgetSubmit}
            >
              Lưu
            </button>
          </div>
        ) : (
          <span>
            {budget} VND
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={() => setIsEditingBudget(true)} 
            >
              Chỉnh sửa
            </button>
          </span>
        )}
      </div>
      <div className="flex justify-between mb-4">
        <span className="font-bold">Đã chi tiêu:</span>
        <span className="text-red-500">
          {expenses} VND 
        </span>
      </div>

      <div className="flex justify-between mb-4">
        <span className="font-bold">Thu nhập:</span>
        <span className="text-green-500">
          {income} VND
        </span>
      </div>

      <hr />
      <div className="flex justify-between mt-4">
        <span className="font-bold">Còn lại:</span>
        <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
          {remainingBudget} VND 
        </span>
      </div>
    </div>
  );
};

export default Balance;