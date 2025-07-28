const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG_LOG === 'true';

function debugLog(message: string) {
  if (DEBUG_ENABLED) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG]', message);
  }
}
function errorLog(message: string) {
  if (DEBUG_ENABLED) {
    console.error('[ERROR]', message);
  }
}

export { debugLog, errorLog };
