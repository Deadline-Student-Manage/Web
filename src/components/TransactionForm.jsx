import React, { useState } from 'react';
import { format } from 'date-fns';

const TransactionForm = ({ onAddTransaction }) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTransaction({
      date,
      description,
      amount: parseFloat(amount) || 0,
      type,
      note,
    });
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDescription('');
    setAmount('');
    setType('expense');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
          Ngày:
        </label>
        <input
          type="date"
          id="date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Mô tả:
        </label>
        <input
          type="text"
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
          Số tiền:
        </label>
        <input
          type="number"
          id="amount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
          Loại:
        </label>
        <select
          id="type"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Chi tiêu</option>
          <option value="income">Thu nhập</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="note" className="block text-gray-700 text-sm font-bold mb-2">
          Ghi chú:
        </label>
        <textarea
          id="note"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Thêm
      </button>
    </form>
  );
};

export default TransactionForm;