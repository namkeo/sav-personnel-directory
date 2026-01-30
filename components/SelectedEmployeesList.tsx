import React from 'react';
import { Employee } from '../types';

interface SelectedEmployeesListProps {
  employees: Employee[];
  onFinish: () => void;
  onShowUnitList: (unit: string, employees: Employee[]) => void;
  onRemoveEmployee: (employee: Employee) => void;
  onExport: () => void;
}

const SelectedEmployeesList: React.FC<SelectedEmployeesListProps> = ({ employees, onFinish, onShowUnitList, onRemoveEmployee, onExport }) => {
  // Group employees by unit
  const groupedByUnit = employees.reduce((acc, employee) => {
    if (!acc[employee.unit]) {
      acc[employee.unit] = [];
    }
    acc[employee.unit].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Danh sách đã chọn ({employees.length} cán bộ)
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-4 4m4-4l4 4M5 20h14a2 2 0 002-2v-4m-18 0v4a2 2 0 002 2" />
            </svg>
            Xuất Excel
          </button>
          <button
            onClick={onFinish}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Kết thúc
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedByUnit).map(([unit, unitEmployees]) => (
          <div key={unit} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {unit}
              <span className="text-xs text-slate-500 font-normal">({unitEmployees.length} người)</span>
              </h4>
              <button
                onClick={() => onShowUnitList(unit, unitEmployees)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-semibold"
              >
                Xem danh sách
              </button>
            </div>
            <div className="space-y-2">
              {unitEmployees.map((emp, idx) => (
                <div key={`${emp.serial}-${idx}`} className="flex items-center gap-3 bg-white p-3 rounded-md border border-slate-200">
                  <div className="bg-blue-100 text-blue-800 font-bold text-sm px-3 py-1 rounded-md min-w-[60px] text-center">
                    STT {emp.serial}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{emp.fullName}</div>
                    <div className="text-xs text-slate-500">{emp.jobTitle}</div>
                  </div>
                  <button
                    onClick={() => onRemoveEmployee(emp)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-md font-semibold shadow-sm transition-all active:scale-[0.98]"
                    title="Xóa khỏi danh sách"
                    aria-label={`Xóa ${emp.fullName}`}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedEmployeesList;
