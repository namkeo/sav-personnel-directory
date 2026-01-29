import React from 'react';
import { Employee } from '../types';

interface FinalResultDisplayProps {
  employees: Employee[];
  onBackToSearch: () => void;
}

const FinalResultDisplay: React.FC<FinalResultDisplayProps> = ({ employees, onBackToSearch }) => {
  const groupedByUnit = employees.reduce((acc, employee) => {
    if (!acc[employee.unit]) {
      acc[employee.unit] = [];
    }
    acc[employee.unit].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-3xl border border-slate-250 p-4 md:p-8 w-full max-w-none mx-0 my-6">
      {/* Logo Kiểm toán Nhà nước */}
      <div className="text-center mb-6">
        <img 
          src="https://upload.wikimedia.org/wikipedia/vi/4/42/Logo_Ki%E1%BB%83m_to%C3%A1n_nh%C3%A0_n%C6%B0%E1%BB%9Bc_Vi%E1%BB%87t_Nam.jpg" 
          alt="Logo Kiểm toán Nhà nước" 
          className="mx-auto h-20 mb-3 object-contain"
        />
        <h2 className="text-1xl font-bold text-blue-900 mb-2">KẾT QUẢ LỰA CHỌN</h2>
        <p className="text-slate-500">Tổng cộng: <span className="font-bold text-blue-600">{employees.length}</span> người được xác minh tài sản, thu nhập năm 2026</p>
      </div>

      {/* Grid 8 cột x 5 hàng */}
      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">
        {Object.entries(groupedByUnit).map(([unit, unitEmployees]) => (
          <div key={unit} className="space-y-3">
            <div className="text-center text-blue-800 font-bold text-base">
              {unit}
            </div>
            <div className="grid grid-cols-4 gap-2 auto-rows-fr">
              {unitEmployees.map((emp, idx) => (
                <div 
                  key={`${emp.serial}-${idx}`} 
                  className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center min-h-[140px]"
                >
                  <h4 className="font-bold text-red-700 text-base mb-2 leading-tight text-center w-full px-2">{emp.fullName}</h4>
                  <p className="text-sm text-blue-800 mb-2 text-center">{emp.jobTitle}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-center gap-4">
        <button
          onClick={onBackToSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại tra cứu
        </button>
      </div>
    </div>
  );
};

export default FinalResultDisplay;
