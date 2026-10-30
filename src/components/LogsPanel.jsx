import { Fragment, useState } from 'react';
import { getLogs } from '../api';
import usePolling from '../usePolling';
import './panels.css';

const PAGE_SIZE = 20;
const SERVICE_NAMES = { inventory: 'Inventario', orders: 'Pedidos', payments: 'Pagos' };
const STATUS_NAMES = { SUCCESS: 'Éxito', ERROR: 'Error' };

// datetime-local gives local time without zone; the API expects ISO strings
const toIso = (local) => (local ? new Date(local).toISOString() : '');

export default function LogsPanel({ refreshKey }) {
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [fromLocal, setFromLocal] = useState('');
  const [toLocal, setToLocal] = useState('');
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState(null);

  // Any filter change returns to the first page
  const onFilter = (setter) => (e) => { setter(e.target.value); setPage(0); };
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));
  const onRowKey = (id) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(id); }
  };

  const { data, error } = usePolling(
    () => getLogs({ service, status, from: toIso(fromLocal), to: toIso(toLocal), page, size: PAGE_SIZE }),
    [refreshKey, service, status, fromLocal, toLocal, page],
  );
  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <section className="panel">
      <h2 className="panel-title">Logs en tiempo real</h2>
      <div className="filters">
        <label>Servicio
          <select value={service} onChange={onFilter(setService)}>
            <option value="">Todos</option>
            {Object.entries(SERVICE_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label>Estado
          <select value={status} onChange={onFilter(setStatus)}>
            <option value="">Todos</option>
            <option value="SUCCESS">Éxito</option>
            <option value="ERROR">Error</option>
          </select>
        </label>
        <label>Desde
          <input type="datetime-local" value={fromLocal} onChange={onFilter(setFromLocal)} />
        </label>
        <label>Hasta
          <input type="datetime-local" value={toLocal} onChange={onFilter(setToLocal)} />
        </label>
      </div>

      {error && <p className="panel-error">No se pudieron cargar los logs.</p>}
      {items.length === 0 ? (
        <p className="panel-empty">Sin logs para los filtros seleccionados</p>
      ) : (
        <div className="table-wrap">
          <table className="logs-table">
            <thead>
              <tr>
                <th>ID de solicitud</th><th>Servicio</th><th>Operación</th>
                <th>Duración (ms)</th><th>Estado</th><th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <Fragment key={e.requestId}>
                  <tr
                    className="log-row"
                    tabIndex={0}
                    aria-expanded={openId === e.requestId}
                    onClick={() => toggle(e.requestId)}
                    onKeyDown={onRowKey(e.requestId)}
                  >
                    <td title={e.requestId}>{e.requestId.slice(0, 8)}</td>
                    <td>{SERVICE_NAMES[e.serviceId] ?? e.serviceId}</td>
                    <td>{e.operation}</td>
                    <td>{e.durationMs}</td>
                    <td>
                      <span className={`badge badge-${e.status.toLowerCase()}`}>
                        {STATUS_NAMES[e.status] ?? e.status}
                      </span>
                    </td>
                    <td>{new Date(e.timestamp).toLocaleTimeString()}</td>
                  </tr>
                  {openId === e.requestId && (
                    <tr className="log-detail">
                      <td colSpan={6}>
                        <p>Parámetros</p>
                        <pre>{e.params}</pre>
                        <p>Respuesta</p>
                        <pre>{e.response ?? '—'}</pre>
                        {e.error && (
                          <>
                            <p>Error</p>
                            <pre>{e.error}</pre>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pager">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Anterior
        </button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}>
          Siguiente
        </button>
      </div>
    </section>
  );
}
