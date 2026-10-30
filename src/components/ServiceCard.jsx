const SERVICE_NAMES = {
  inventory: 'Inventario',
  orders: 'Pedidos',
  payments: 'Pagos',
};

const DANGER_THRESHOLD = 15;

export default function ServiceCard({ summary }) {
  const { serviceId, totalCalls, errorRate, avgDurationMs } = summary;
  const inDanger = errorRate > DANGER_THRESHOLD;

  return (
    <article className={inDanger ? 'card danger' : 'card'}>
      <header className="card-header">
        <h2>{SERVICE_NAMES[serviceId] ?? serviceId}</h2>
        {inDanger && <span className="badge">Servicio con problemas</span>}
      </header>
      <dl className="stats">
        <div>
          <dt>Total de llamadas</dt>
          <dd>{totalCalls}</dd>
        </div>
        <div>
          <dt>Tasa de éxito</dt>
          <dd>{(100 - errorRate).toFixed(1)}%</dd>
        </div>
        <div>
          <dt>Tiempo promedio</dt>
          <dd>{Math.round(avgDurationMs)} ms</dd>
        </div>
      </dl>
    </article>
  );
}
