import { useState } from 'react';
import { clearLogs } from '../api.js';

export default function ClearLogsButton({ onSuccess }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setPending(true);
    setFailed(false);
    try {
      await clearLogs();
      onSuccess();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="simulate">
      <button type="button" onClick={handleClick} disabled={pending}>
        {pending ? 'Limpiando...' : 'Limpiar logs'}
      </button>
      {failed && <p className="simulate-error">No se pudieron limpiar los logs</p>}
    </div>
  );
}
