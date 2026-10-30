import { useEffect, useState } from 'react';

// Calls fn now and every ms; results arriving after unmount are ignored.
export default function usePolling(fn, deps = [], ms = 3000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const run = () => {
      fn()
        .then((result) => {
          if (active) {
            setData(result);
            setError(null);
          }
        })
        .catch((err) => {
          if (active) setError(err);
        });
    };
    run();
    const id = setInterval(run, ms);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [...deps, ms]);

  return { data, error };
}
