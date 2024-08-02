import React from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const List = ({ transactions, selectedView, onDelete, budget }) => {
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date); 

    if (selectedView === 'all') {
      return true;
    } else if (selectedView.length === 7 && selectedView.includes('-')) { 
      const transactionMonth = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return transactionMonth === selectedView;
    } else if (selectedView === 'month') {
      const today = new Date();
      return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    } else if (selectedView === 'week') {
      const today = new Date();
      const firstDayOfCurrentWeek = startOfWeek(today);
      const lastDayOfCurrentWeek = endOfWeek(today);
      return isWithinInterval(transactionDate, { start: firstDayOfCurrentWeek, end: lastDayOfCurrentWeek });
    } else if (selectedView === 'year') {
      const today = new Date();
      return transactionDate.getFullYear() === today.getFullYear();
    }

    return true; 
  });
  return (
    <div>
       <h2 className="text-2xl font-bold mb-4">Danh sách giao dịch</h2>

{selectedView !== 'all' && selectedView.length === 7 && selectedView.includes('-') && ( 
  <div className="mb-4">
    <span className="font-bold">Ngân sách tháng {selectedView}:</span> {budget} VND
  </div>
)}
      <ul>
        {filteredTransactions.map((transaction) => (
          <li key={transaction.id} className="mb-2 border-b pb-2">
            <div className="flex justify-between items-center"> 
              <div>
                <p className="font-bold">{transaction.description}</p>
                <p className="text-gray-600">{format(new Date(transaction.date), 'dd/MM/yyyy')}</p>
              </div>
              <div className="flex items-center"> 
                <div className={`${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}{transaction.amount} VND
                </div>
                <button 
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => onDelete(transaction.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
            {transaction.note && <p className="text-gray-500 mt-1">{transaction.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;