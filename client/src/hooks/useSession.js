import { useState, useEffect } from 'react';

const STORAGE_KEY = 'plancraft_session_id';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useSession() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let current = localStorage.getItem(STORAGE_KEY);
    if (!current) {
      current = generateUUID();
      localStorage.setItem(STORAGE_KEY, current);
    }
    setSessionId(current);
  }, []);

  return sessionId;
}
