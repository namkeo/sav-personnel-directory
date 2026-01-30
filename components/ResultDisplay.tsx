
import React from 'react';
import { Employee } from '../types';

interface ResultDisplayProps {
  employee: Employee | null;
  hasSearched: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ employee, hasSearched }) => {
  if (!hasSearched) return null;

  if (!employee) {
    return (
      <div className="bg-white/95 backdrop-blur-md border-2 border-slate-100 rounded-2xl p-12 text-center shadow-2xl max-w-lg mx-auto">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy thông tin</h3>
        <p className="text-slate-500 mb-6 text-sm">Hệ thống không tìm thấy nhân sự có STT này trong đơn vị đã chọn. Vui lòng kiểm tra lại thông tin nhập.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-[96vw] mx-auto inline-flex flex-col md:flex-row transition-all hover:scale-[1.01]">
      {/* Left Sidebar Info */}
      <div className="bg-blue-800/90 p-8 md:w-[260px] flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-indigo-900/50 pointer-events-none"></div>
        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md mb-6 border border-white/30 relative z-10 shadow-inner">
          <div className="text-5xl font-black drop-shadow-lg">{employee.serial}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Số Thứ Tự</div>
        </div>
        <div className="bg-white p-3 rounded-xl mb-4 relative z-10 shadow-lg">
          <img 
            src="https://upload.wikimedia.org/wikipedia/vi/4/42/Logo_Ki%E1%BB%83m_to%C3%A1n_nh%C3%A0_n%C6%B0%E1%BB%9Bc_Vi%E1%BB%87t_Nam.jpg" 
            alt="SAV Logo" 
            className="h-12 w-auto"
          />
        </div>
        <div className="text-xs font-semibold opacity-80 uppercase tracking-tighter relative z-10">Kiểm Toán Nhà Nước</div>
      </div>

      {/* Main Employee Details */}
      <div className="p-8 md:w-auto bg-white/60 relative w-fit">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <svg className="w-32 h-32 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="mb-2 inline-flex w-fit">
            <span className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-[0.2em] whitespace-nowrap">Người được xác minh tài sản, thu nhập năm 2026</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-red-700 mb-8 leading-tight drop-shadow-sm whitespace-nowrap">{employee.fullName}</h2>
          
          <div className="space-y-6 mt-4">
            <div className="group transition-all">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-hover:text-blue-500">Chức danh / Vị trí</label>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100/50 p-2.5 rounded-xl text-blue-700 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-blue-800 font-bold text-xl">{employee.jobTitle || 'Cán bộ'}</span>
              </div>
            </div>

            <div className="group transition-all">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-hover:text-blue-500">Đơn vị công tác</label>
              <div className="flex items-center gap-3">
                <div className="bg-slate-100/80 p-2.5 rounded-xl text-slate-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-blue-800 font-semibold text-lg">{employee.unit}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200/50 flex justify-between items-center">
            
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600/30"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600/60"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
