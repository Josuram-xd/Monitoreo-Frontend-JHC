import { useState } from 'react';
import LatencyChart from './components/LatencyChart.jsx';
import LogsPanel from './components/LogsPanel.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import SimulateButton from './components/SimulateButton.jsx';
import { getSummary } from './api.js';
import usePolling from './usePolling.js';

export default function App() {
  const [tick, setTick] = useState(0);
  const { data: summary, error } = usePolling(getSummary, [tick]);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Monitoreo de Microservicios</h1>
        <SimulateButton onSuccess={() => setTick((t) => t + 1)} />
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
