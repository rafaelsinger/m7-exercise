import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from './services/apiService';
import './NurseDetails.css';

const NurseDetails = () => {
    const { nurseId } = useParams();
    const [preferences, setPreferences] = useState<unknown[] | null>(null);

    useEffect(() => {
      const fetchPreferences = async () => {
        const preferences = await api.default.getNursePreferences(Number(nurseId));
        setPreferences(preferences);
      }
  
      fetchPreferences().catch(console.error);
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const { dayOfWeek, type, preferenceStrength } = event.target;

        const dayOfWeekValue = dayOfWeek.value;
        const typeValue = type.value;
        const preferenceStrengthValue = preferenceStrength.value;

        await api.default.setPreference(dayOfWeekValue, typeValue, preferenceStrengthValue, Number(nurseId));

        window.location.reload();
    }

    return (
        <>
            <h2>Nurse {nurseId}</h2>
            <h3>Add Preference:</h3>
                <form onSubmit={handleSubmit} className='preferenceForm'>
                    <label htmlFor='dayOfWeek'>Day Of Week</label>
                    <select name='dayOfWeek'>
                        <option value='Monday'>Monday</option>
                        <option value='Tuesday'>Tuesday</option>
                        <option value='Wednesday'>Wednesday</option>
                        <option value='Thursday'>Thursday</option>
                        <option value='Friday'>Friday</option>
                        <option value='Saturday'>Saturday</option>
                        <option value='Sunday'>Sunday</option>
                    </select>

                    <label htmlFor='type'>Time</label>
                    <select name='type'>
                        <option value='day'>Day</option>
                        <option value='night'>Night</option>
                    </select>

                    <label htmlFor='preferenceStrength'>Preference Strength</label>
                    <input name='preferenceStrength' type='range' min='1' max='5'></input>

                    <button type="submit" className='formSubmit'>Submit</button>
                </form>
            <h3>Current Preferences:</h3>
                <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Day of Week</th>
                        <th>Time (Day/Night)</th>
                        <th>Preference Strength (1-5)</th>
                    </tr>
                </thead>
                    <tbody>
                        {preferences && (preferences.map((preference: any) => (
                        <tr key={preference.id}>
                            <td>{preference.id}</td>
                            <td>{preference.dayOfWeek}</td>
                            <td>{preference.type}</td>
                            <td>{preference.preferenceStrength}</td>
                        </tr>
                        )))}
                    </tbody>
                </table>
            <Link to="/">Go Back</Link>
        </>
    )
}

export default NurseDetails
