import { useState } from 'react';
import ClearLogsButton from './components/ClearLogsButton.jsx';
import LatencyChart from './components/LatencyChart.jsx';
import LogsPanel from './components/LogsPanel.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import SimulateButton from './components/SimulateButton.jsx';
import { getSummary } from './api.js';
import usePolling from './usePolling.js';

export default function App() {
  const [tick, setTick] = useState(0);
  const { data: summary, error } = usePolling(getSummary, [tick]);
  const refresh = () => setTick((t) => t + 1);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Monitoreo de Microservicios</h1>
        <div className="header-actions">
          <SimulateButton onSuccess={refresh} />
          <ClearLogsButton onSuccess={refresh} />
        </div>
      </header>

      {error && (
        <div className="banner" role="alert">
          No se pudo conectar con el backend
        </div>
      )}

      <section className="cards">
        {(summary ?? []).map((service) => (
          <ServiceCard key={service.serviceId} summary={service} />
        ))}
      </section>

      <LatencyChart refreshKey={tick} />
      <LogsPanel refreshKey={tick} />
    </main>
  );
}
