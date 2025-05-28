import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { ClockIcon, PlayIcon, CalendarIcon } from 'lucide-react';
export function Dashboard() {
  const {
    user,
    clockIn,
    clockOut,
    getCurrentEntry
  } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentEntry = getCurrentEntry();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const isClocked = currentEntry && currentEntry.clockIn && !currentEntry.clockOut;
  return <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">{formatDate(currentTime)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current Time Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Current Time
            </h2>
          </div>
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Status
            </h2>
          </div>
          <div className="space-y-2">
            {currentEntry ? <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clock In:</span>
                  <span className="font-semibold">
                    {currentEntry.clockIn || 'Not clocked in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clock Out:</span>
                  <span className="font-semibold">
                    {currentEntry.clockOut || 'Not clocked out'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-semibold">
                    {currentEntry.totalHours.toFixed(2)}h
                  </span>
                </div>
              </> : <p className="text-gray-600">No entries for today</p>}
          </div>
        </div>
      </div>
      {/* Clock In/Out Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Time Tracking
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={clockIn} disabled={isClocked} className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-colors ${isClocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'}`}>
            <PlayIcon className="h-5 w-5 mr-2" />
            Clock In
          </button>
          <button onClick={clockOut} disabled={!isClocked} className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-colors ${!isClocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500'}`}>
            <div className="h-5 w-5 mr-2" />
            Clock Out
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {isClocked ? <span className="text-green-600 font-semibold">
                ● Currently clocked in
              </span> : <span className="text-gray-500">● Not currently clocked in</span>}
          </p>
        </div>
      </div>
    </div>;
}