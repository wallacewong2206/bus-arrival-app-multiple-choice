import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [busStopId, setBusStopId] = useState('');
  const [busArrivalData, setBusArrivalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busStops = [{ id: '18141' }, { id: '18151' }, { id: '18161' }];

  const fetchBusArrival = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://sg-bus-arrivals.vercel.app/?id=${id}`
      );
      if (!response.ok) throw new Error('Failed to fetch bus data');
      const data = await response.json();
      if (!data.services || data.services.length === 0) {
        throw new Error('No buses arriving at this stop');
      }
      setBusArrivalData(data);
    } catch (err) {
      setError(err.message);
      setBusArrivalData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusStop = (event) => {
    const selectedId = event.target.value;
    setBusStopId(selectedId);
    if (selectedId) {
      fetchBusArrival(selectedId);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Bus Arrival App</h1>
      <div className="mb-3">
        <label htmlFor="busStopDropdown" className="form-label">
          Select a Bus Stop ID:
        </label>
        <select
          id="busStopDropdown"
          className="form-select"
          value={busStopId}
          onChange={handleSelectBusStop}
        >
          <option value="">-- Select a Bus Stop ID--</option>
          {busStops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.id}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Fetching bus arrival data...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {busArrivalData && (
        <div className="mt-4">
          <h2>Bus Stop {busArrivalData.bus_stop_id}</h2>
          <ul className="list-group">
            {busArrivalData.services.map((service) => (
              <li
                key={service.bus_no}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  <strong>Bus {service.bus_no}:</strong>
                </span>
                <span>
                  {service.next_bus_mins < 0
                    ? 'Arrived'
                    : `${service.next_bus_mins} minutes`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
