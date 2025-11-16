
import { MonoTypeOperatorFunction, retry, timer } from 'rxjs';

export interface WakeUpRetryOptions {
  /** Cantidad máxima de reintentos adicionales */
  maxAttempts?: number;
  /** Retraso base (en ms). Se multiplicará por el número de intento */
  baseDelayMs?: number;
}

/**
 * Reintenta peticiones HTTP cuando el backend está “dormido”.
 * Incrementa el tiempo de espera en cada intento para darle tiempo a despertar.
 */
export function wakeUpRetry<T>(options: WakeUpRetryOptions = {}): MonoTypeOperatorFunction<T> {
  const { maxAttempts = 4, baseDelayMs = 3000 } = options;
  return retry({
    count: maxAttempts,
    delay: (_error, retryCount) => timer(baseDelayMs * retryCount),
  });
}
