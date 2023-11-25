
import { useEffect, useState } from 'react';
import * as api from './services/apiService';
import m7Logo from '/Logo-black.png'
import { Link } from 'react-router-dom';
import './App.css'

function App() {
  const [nurses, setNurses] = useState<unknown[] | null>(null);
  const [requirements, setRequirements] = useState<unknown[] | null>(null);
  const [schedule, setSchedule] = useState<any | null>(null);
  const [scheduleNurses, setScheduleNurses] = useState<any[]>([]);

  useEffect(() => {
    const fetchNurses = async () => {
      const nurses = await api.default.getNurses(); // TODO: this appears to be getting called twice on page load... why?
      setNurses(nurses);
    }

    fetchNurses().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRequirements = async () => {
      const requirements = await api.default.getShiftRequirements();
      setRequirements(requirements);
    }

    fetchRequirements().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRequirements = async () => {
      const schedule = await api.default.getSchedule(1);
      setSchedule(schedule);
    }

    fetchRequirements().catch(console.error);
  }, [])
 
  useEffect(() => {
    if (schedule && schedule.shifts) {
      fetchNursesForShifts(schedule.shifts).then(setScheduleNurses);
    }
  }, [schedule])

  //would change type to React.FormEvent later
  const handleScheduleCreate = async (event: any) => {
    event.preventDefault();
    const startDate: Date = event.target.startDate.value; 
    const endDate: Date = event.target.endDate.value;
    const schedule = await api.default.generateSchedule(startDate, endDate)
    alert(`Schedule ${schedule.id} has been successfully created.`);
  }

  const getSchedule = async (scheduleId: number): Promise<void> => {
    const totalSchedules = (await api.default.getSchedules()).length;

    if (scheduleId > totalSchedules) {
        scheduleId = 1; 
    } else if (scheduleId < 1) {
        scheduleId = totalSchedules; 
    }

    const schedule = await api.default.getSchedule(scheduleId);
    setSchedule(schedule);
  }

  const getNurseFromShiftId = async (shiftId: number) => {
    return await api.default.getNurseByShiftId(shiftId);
  }

  const fetchNursesForShifts = async (shifts: any) => {
    const nursePromises = shifts.map((shift: any) => getNurseFromShiftId(shift.id));
    const nurses = await Promise.all(nursePromises);
    return nurses;
};


  return (
    <>
      <div>
        <a href="https://m7health.com" target="_blank">
          <img src={m7Logo} className="logo" alt="M7 Health logo" />
        </a>
      </div>
      <h1>M7 Health scheduling exercise</h1>
      <div className="card">
        Check the README for guidance on how to complete this exercise.
        Find inspiration <a href="https://www.m7health.com/product" target="_blank">on M7's site</a>.
      </div>
      <div className='card'>
        <h2>Nurses</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {nurses && (nurses.map((nurse: any) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td><Link to={`/nurse/${nurse.id}`}>{nurse.name}</Link></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className='card'>
        <h2>Shift Requirements</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Shift</th>
              <th>Nurses required</th>
            </tr>
          </thead>
          <tbody>
            {requirements && (requirements.map((req: any) => (
              <tr key={req.dayOfWeek + "-" + req.shift}>
                <td>{req.dayOfWeek}</td>
                <td>{req.shift}</td>
                <td>{req.nursesRequired}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className='card'>
        <h2>Create New Schedule</h2>
        <form onSubmit={handleScheduleCreate} className='createScheduleForm'>
          <label htmlFor='startDate'>Start Date</label>
          <input name='startDate' type='date' />
          <label htmlFor='endDate'>End Date</label>
          <input name='endDate' type='date' />
          <button type='submit' className='formSubmit'>Create Schedule</button> 
        </form>
        <div className='scheduleHeader'>
          <button className='arrow' onClick={() => getSchedule(schedule.id - 1)}>&#8249;</button>
          <h2 className='scheduleTitle'>Schedule {schedule?.id}</h2>
          <button className='arrow' onClick={() => getSchedule(schedule.id + 1)}> &#8250; </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Nurses Assigned</th>
            </tr>
          </thead>
          <tbody>
            {/* add custom types for shift */}
            {schedule && schedule?.shifts.map((shift: any, index: number) => (
              <tr key={shift?.id}>
                <td>{shift?.date}</td>
                <td>{shift?.type}</td>
                <td>{scheduleNurses[index] ? scheduleNurses[index].name : 'Loading...'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default App
