import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      
      {/* 4 Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">TỔNG SỐ XE</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">24 <span className="text-sm font-normal text-green-500">+2 xe mới</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">TOUR ĐANG CHẠY</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">TÀI XẾ SẴN SÀNG</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium">DOANH THU THÁNG MƯỜI</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">0M</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;