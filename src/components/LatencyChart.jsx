import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';
import { getLogs } from '../api';
import usePolling from '../usePolling';
import './panels.css';

const WINDOW = 20;
const SERIES = [
  { id: 'inventory', name: 'Inventario', color: '#38bdf8' },
  { id: 'orders', name: 'Pedidos', color: '#a78bfa' },
  { id: 'payments', name: 'Pagos', color: '#f59e0b' },
];

// One row per call index 1..WINDOW; each service's last calls are right-aligned, oldest first.
function toChartRows(items) {
  const rows = Array.from({ length: WINDOW }, (_, i) => ({ call: i + 1 }));
  for (const { id } of SERIES) {
    const durations = items
      .filter((entry) => entry.serviceId === id)
      .slice(0, WINDOW)
      .map((entry) => entry.durationMs)
      .reverse();
    const offset = WINDOW - durations.length;
    durations.forEach((ms, i) => { rows[offset + i][id] = ms; });
  }
  return rows;
}

export default function LatencyChart({ refreshKey }) {
  const { data, error } = usePolling(() => getLogs({ size: 100 }), [refreshKey], 3000);
  const items = data?.items ?? [];

  return (
    <section className="panel">
      <h2 className="panel-title">Tiempo de respuesta (últimas 20 llamadas por servicio)</h2>
      {error && <p className="panel-error">No se pudieron cargar las llamadas.</p>}
      {items.length === 0 ? (
        <p className="panel-empty">Aún no hay llamadas. Pulsa «Simular carga».</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={toChartRows(items)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #2a2f3a)" />
            <XAxis dataKey="call" />
            <YAxis unit=" ms" />
            <Tooltip labelFormatter={(n) => `Llamada ${n}`} formatter={(v) => `${v} ms`} />
            <Legend />
            {SERIES.map((s) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.name}
                stroke={s.color}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
