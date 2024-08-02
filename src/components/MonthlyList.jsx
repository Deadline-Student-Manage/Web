import React from 'react';

const MonthlyExpenseList = ({ monthlyExpenses }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
      <h2 className="text-2xl font-bold mb-4">Chi tiêu theo tháng</h2>
      <ul>
        {Object.entries(monthlyExpenses).map(([month, expense]) => (
          <li key={month} className="mb-2">
            {month}: {expense} VND
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyExpenseList;