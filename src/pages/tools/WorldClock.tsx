import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, PlusCircle, Trash2 } from 'lucide-react';
import moment from 'moment-timezone';

const defaultTimezones = [
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Asia/Kolkata',
];

const allTimezones = moment.tz.names();

const WorldClock = () => {
  const [time, setTime] = useState(moment());
  const [selectedTimezones, setSelectedTimezones] = useState(defaultTimezones);
  const [newTimezone, setNewTimezone] = useState('');
  const [meetingTime, setMeetingTime] = useState(moment().hour());

  useEffect(() => {
    const timer = setInterval(() => setTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addTimezone = () => {
    if (newTimezone && !selectedTimezones.includes(newTimezone)) {
      setSelectedTimezones([...selectedTimezones, newTimezone]);
      setNewTimezone('');
    }
  };

  const removeTimezone = (tz: string) => {
    setSelectedTimezones(selectedTimezones.filter(t => t !== tz));
  };

  const getMeetingTime = (tz: string) => {
      return moment().hour(meetingTime).minute(0).tz(tz).format('h:mm A');
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl mb-6">
                <Globe className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">World <span className="gradient-text-teal">Clock</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Keep track of time across the globe and plan your meetings.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100">
                <h2 className="text-2xl font-bold text-white mb-6">Timezones</h2>
                <div className="space-y-4">
                    {selectedTimezones.map(tz => (
                        <div key={tz} className="bg-black/20 p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-lg text-white font-semibold">{tz.replace(/_/g, ' ')}</p>
                                <p className="text-gray-400">{time.tz(tz).format('dddd, MMMM Do')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl text-teal-300 font-bold">{time.tz(tz).format('h:mm:ss A')}</p>
                                <p className="text-gray-500">{time.tz(tz).format('Z')} UTC</p>
                            </div>
                            <button onClick={() => removeTimezone(tz)} className="p-2 text-gray-500 hover:text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex space-x-2">
                    <select value={newTimezone} onChange={e => setNewTimezone(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                        <option value="">Add a timezone...</option>
                        {allTimezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
                    </select>
                    <button onClick={addTimezone} className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                        <PlusCircle />
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100">
                <h2 className="text-2xl font-bold text-white mb-6">Meeting Planner</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-600 mb-2">Your Time: {moment().hour(meetingTime).format('h:00 A')}</label>
                        <input type="range" min="0" max="23" value={meetingTime} onChange={e => setMeetingTime(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2 pt-4">
                        {selectedTimezones.map(tz => (
                            <div key={tz} className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">{tz.split('/')[1].replace(/_/g, ' ')}</span>
                                <span className="font-semibold text-white">{getMeetingTime(tz)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;


