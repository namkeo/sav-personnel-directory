
import React, { useState, useEffect, useMemo } from 'react';
import { parsePersonnelExcel } from './utils/excelParser';
import { Employee, PersonnelData } from './types';
import FileUpload from './components/FileUpload';
import QueryForm from './components/QueryForm';
import ResultDisplay from './components/ResultDisplay';
import Fireworks from './components/Fireworks';

type AppView = 'upload' | 'search' | 'result';

const App: React.FC = () => {
  const [personnelData, setPersonnelData] = useState<PersonnelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('upload');

  // Search state
  const [selectedUnit, setSelectedUnit] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [searchResult, setSearchResult] = useState<Employee | null>(null);

  // Broadcast Channel for secondary screen - use ref to avoid recreation
  const channelRef = React.useRef<BroadcastChannel | null>(null);

  // Determine if this instance is the display screen
  const isDisplayMode = window.location.search.includes('mode=display');

  // Initialize BroadcastChannel once
  useEffect(() => {
    channelRef.current = new BroadcastChannel('sav_personnel_sync');
    
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!channelRef.current) return;

    // Listen for messages from the main screen
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'UPDATE_RESULT') {
        setSearchResult(data);
        if (isDisplayMode) setView('result');
      } else if (type === 'RESET') {
        setSearchResult(null);
        if (isDisplayMode) setView('upload');
      } else if (type === 'SYNC_DATA') {
        setPersonnelData(data);
        if (isDisplayMode) setView('upload');
      }
    };

    channelRef.current.onmessage = handleMessage;
  }, [isDisplayMode]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parsePersonnelExcel(file);
      setPersonnelData(data);
      setSelectedUnit('');
      setSerialNumber('');
      setSearchResult(null);
      
      // Sync dữ liệu với màn hình trình chiếu
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'SYNC_DATA', data: data });
      }
      
      setView('search');
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!personnelData) return;
    
    // Tìm nhân viên theo đơn vị và số thứ tự (trim để loại bỏ khoảng trắng)
    const found = personnelData.employees.find(
      (emp) => emp.unit === selectedUnit && emp.serial === serialNumber.trim()
    );
    
    console.log('Search - Unit:', selectedUnit, 'Serial:', serialNumber.trim());
    console.log('Found employee:', found);
    
    // CHỈ gửi dữ liệu sang màn hình trình chiếu, KHÔNG hiển thị trên màn hình điều khiển
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'UPDATE_RESULT', data: found || null });
    }
    
    // Reset form sau khi tra cứu
    setSerialNumber('');
  };

  const handleBackToSearch = () => {
    setView('search');
  };

  const handleReset = () => {
    setPersonnelData(null);
    setSearchResult(null);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'RESET' });
    }
    setView('upload');
  };

  const openSecondaryScreen = async () => {
    try {
      // Kiểm tra xem trình duyệt có hỗ trợ Window Placement API không
      if ('getScreenDetails' in window) {
        // @ts-ignore - Window Placement API
        const screenDetails = await window.getScreenDetails();
        
        // Tìm màn hình thứ 2 (external screen)
        const externalScreen = screenDetails.screens.find((s: any) => !s.isPrimary) || screenDetails.screens[0];
        
        // Mở window fullscreen trên màn hình thứ 2
        const width = externalScreen.availWidth;
        const height = externalScreen.availHeight;
        const left = externalScreen.availLeft;
        const top = externalScreen.availTop;
        
        window.open(
          window.location.pathname + '?mode=display',
          '_blank',
          `left=${left},top=${top},width=${width},height=${height},fullscreen=yes`
        );
      } else {
        // Fallback: Mở window ở vị trí offset (giả định màn hình 2 ở bên phải)
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        // Offset sang phải (giả sử màn hình 2 ở bên phải màn hình 1)
        const left = screenWidth + 100;
        const top = 0;
        const width = screenWidth;
        const height = screenHeight;
        
        window.open(
          window.location.pathname + '?mode=display',
          '_blank',
          `left=${left},top=${top},width=${width},height=${height}`
        );
      }
    } catch (error) {
      console.error('Error opening secondary screen:', error);
      // Fallback to simple window
      window.open(window.location.pathname + '?mode=display', '_blank', 'width=1920,height=1080');
    }
  };

  // If in display mode, we show a simplified immersive UI
  if (isDisplayMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <Fireworks />
        <div className="relative z-10 w-full max-w-4xl animate-fadeIn">
          {searchResult ? (
            <ResultDisplay employee={searchResult} hasSearched={true} />
          ) : (
            <div className="text-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/vi/4/42/Logo_Ki%E1%BB%83m_to%C3%A1n_nh%C3%A0_n%C6%B0%E1%BB%9Bc_Vi%E1%BB%87t_Nam.jpg" 
                alt="SAV Logo" 
                className="h-32 mx-auto mb-8 rounded-2xl shadow-2xl border-4 border-white/10"
              />
              <h1 className="text-4xl font-bold text-white mb-4 tracking-widest uppercase">Màn hình Trình chiếu</h1>
              <p className="text-blue-400 text-xl animate-pulse">Đang chờ lệnh từ hệ thống điều khiển...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${view === 'result' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Show fireworks on main result view too */}
      {view === 'result' && <Fireworks />}

      {/* Header */}
      <header className={`${view === 'result' ? 'bg-blue-900/40 backdrop-blur-md border-b border-white/10' : 'bg-blue-800'} text-white shadow-lg shrink-0 relative z-20 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-1.5 rounded-lg">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/vi/4/42/Logo_Ki%E1%BB%83m_to%C3%A1n_nh%C3%A0_n%C6%B0%E1%BB%9Bc_Vi%E1%BB%87t_Nam.jpg" 
                  alt="SAV Logo" 
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">LỰA CHỌN NHÂN SỰ KIỂM TOÁN NHÀ NƯỚC</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={openSecondaryScreen}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Mở màn hình trình chiếu
              </button>
              {personnelData && (
                <button 
                  onClick={handleReset}
                  className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tải tệp mới
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm">
              <p className="font-bold">Đã xảy ra lỗi</p>
              <p>{error}</p>
            </div>
          )}

          {view === 'upload' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hệ thống Dữ liệu Nhân sự</h2>
                <p className="text-slate-500">Vui lòng tải lên tệp Excel danh sách nhân sự để bắt đầu</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <FileUpload onFileLoaded={handleFileUpload} isLoading={isLoading} />
              </div>
            </div>
          )}

          {view === 'search' && personnelData && (
            <div className="animate-slideInRight max-w-xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Tra cứu & Điều khiển</h2>
                <p className="text-slate-500 text-sm">Kết quả sẽ tự động hiển thị trên màn hình trình chiếu</p>
                <p className="text-emerald-600 text-xs font-semibold mt-2">✓ Hãy mở màn hình trình chiếu trước khi tra cứu</p>
              </div>
              <QueryForm
                units={personnelData.units}
                selectedUnit={selectedUnit}
                serialNumber={serialNumber}
                onUnitChange={setSelectedUnit}
                onSerialChange={setSerialNumber}
                onSearch={handleSearch}
              />
            </div>
          )}


        </div>
      </main>

      {/* Footer */}
      <footer className={`shrink-0 border-t ${view === 'result' ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-white'} py-4 relative z-10 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`${view === 'result' ? 'text-white/40' : 'text-slate-400'} text-xs`}>© 2024 KIỂM TOÁN NHÀ NƯỚC VIỆT NAM. Bảng điều khiển quản lý.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
