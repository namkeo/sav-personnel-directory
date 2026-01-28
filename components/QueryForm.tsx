
import React from 'react';

interface QueryFormProps {
  units: string[];
  selectedUnit: string;
  serialNumber: string;
  onUnitChange: (unit: string) => void;
  onSerialChange: (serial: string) => void;
  onSearch: () => void;
}

const QueryForm: React.FC<QueryFormProps> = ({
  units,
  selectedUnit,
  serialNumber,
  onUnitChange,
  onSerialChange,
  onSearch
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
      <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Truy vấn thông tin nhân sự
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn Đơn vị</label>
          <select
            value={selectedUnit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="">-- Chọn Đơn vị --</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nhập số thứ tự (STT)</label>
          <input
            type="text"
            placeholder="Ví dụ: 1, 2, 3..."
            value={serialNumber}
            onChange={(e) => onSerialChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>

        <button
          onClick={onSearch}
          disabled={!selectedUnit || !serialNumber}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white shadow-md transition-all active:scale-[0.98] ${
            !selectedUnit || !serialNumber
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
          }`}
        >
          Tra cứu
        </button>
      </div>
    </div>
  );
};

export default QueryForm;
