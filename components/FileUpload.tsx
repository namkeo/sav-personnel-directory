
import React from 'react';

interface FileUploadProps {
  onFileLoaded: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, isLoading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoaded(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Tải lên danh sách nhân sự
      </h2>
      <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-slate-50">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <div className="text-slate-600">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý dữ liệu...
              </span>
            ) : (
              <>
                <p className="font-medium">Nhấp để chọn hoặc kéo thả tệp Excel</p>
                <p className="text-xs text-slate-400">Định dạng hỗ trợ: .xlsx, .xls</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
        <p className="font-semibold mb-1">Cấu trúc tệp yêu cầu:</p>
        <ul className="list-disc list-inside">
          <li>Cột A: Số La Mã (Đơn vị) hoặc Số Thứ Tự</li>
          <li>Cột B: Tên Đơn vị hoặc Họ và tên nhân viên</li>
          <li>Cột C: Chức danh</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
