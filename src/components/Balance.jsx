import React, { useState, useEffect } from 'react';

const Balance = ({ total, budget, onBudgetChange, isEditingBudget, setIsEditingBudget, transactions, onDeleteExpense }) => { 
  const [newBudget, setNewBudget] = useState(budget);
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [income, setIncome] = useState(0); 

  const handleBudgetChange = (e) => {
    setNewBudget(parseFloat(e.target.value) || 0);
  };

  const handleBudgetSubmit = () => {
    onBudgetChange(newBudget);
    setIsEditingBudget(false); 
  };

  const handleContinue = () => {
    setIsOverBudget(false); // Đóng cảnh báo nhưng không xóa chi tiêu
  };

  const handleDeleteExpenses = () => {
    onDeleteExpense(); // Gọi hàm xóa tất cả các chi tiêu
    setIsOverBudget(false); // Đóng cảnh báo sau khi xóa
  };

  useEffect(() => {
    const total = transactions.reduce((sum, transaction) => 
      transaction.type === 'expense' ? sum + transaction.amount : sum, 0
    );
    setTotalExpenses(total);

    const totalIncome = transactions.reduce((sum, transaction) => 
      transaction.type === 'income' ? sum + transaction.amount : sum, 0
    );
    setIncome(totalIncome);

    if (total > budget) {
      setIsOverBudget(true);
    } else {
      setIsOverBudget(false);
    }
  }, [transactions, budget]);

  const remainingBudget = budget - totalExpenses;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 relative">
      <h2 className="text-2xl font-bold mb-4">Tổng quan</h2>
      {isOverBudget && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
            Cảnh báo: Bạn đã chi tiêu vượt quá ngân sách!
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleContinue}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tiếp tục
            </button>
            <button
              onClick={handleDeleteExpenses}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Xóa chi tiêu
            </button>
          </div>
        </div>
      )}
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
          {totalExpenses} VND 
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
