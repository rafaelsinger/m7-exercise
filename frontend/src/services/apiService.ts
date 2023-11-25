import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default {
  // Nurse endpoints
  getNurses: async () => {
    const { data } = await instance.get('/nurses');
    return data;
  },
  getNursePreferences: async (id: number) => {
    const { data } = await instance.get(`/nurses/preferences/${id}`);
    return data;
  },
  getNurseByShiftId: async (shiftId: number) => {
    const { data } = await instance.get(`/nurses/shifts/${shiftId}`)
    return data;
  },

  //Preference endpoints
  setPreference: async (dayOfWeek: string, type: string, preferenceStrength: number, nurseId: number) => {
    const preferences = { dayOfWeek, type, preferenceStrength, nurseId}
    const { data } = await instance.post('/nurse-shift-preferences/', preferences)
    return data;
  },

  // Shift endpoints
  getAllShifts: async () => {
    const { data } = await instance.get('/shifts');
    return data;
  },
  getShiftsByNurse: async (nurseId: number) => {
    const { data } = await instance.get(`/shifts/nurse/${nurseId}`);
    return data;
  },
  getShiftsBySchedule: async (scheduleId: number) => {
    const { data } = await instance.get(`/shifts/schedule/${scheduleId}`);
    return data;
  },
  getShiftRequirements: async () => {
    const { data } = await instance.get(`/shifts/requirements`);
    return data;
  },

  // Schedule endpoints
  generateSchedule: async (startDate: Date, endDate: Date) => {
    const { data } = await instance.post(`/schedules`, { startDate, endDate });
    return data;
  },
  getSchedules: async () => {
    const { data } = await instance.get('/schedules');
    return data;
  },
  getSchedule: async (id: number) => {
    const { data } = await instance.get(`/schedules/${id}`);
    return data;
  },
};
