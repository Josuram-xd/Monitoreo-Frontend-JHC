import { useState } from 'react';
import { simulateLoad } from '../api.js';

export default function SimulateButton({ onSuccess }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setPending(true);
    setFailed(false);
    try {
      await simulateLoad();
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
        {pending ? 'Simulando...' : 'Simular carga'}
      </button>
      {failed && <p className="simulate-error">No se pudo simular la carga</p>}
    </div>
  );
}
