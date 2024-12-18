//import { requestAPI as baseRequestAPI } from '@jupyterlab/services';

/**
 * Wrapper for making API requests to the backend.
 * @param endpoint The API endpoint to call.
 * @param init The request options.
 */
export async function requestAPI<T>(
  endpoint: string,
  init: RequestInit
): Promise<T> {
  // Get the XSRF token from cookie
  const xsrfToken = document.cookie.split('; ')
    .find(row => row.startsWith('_xsrf'))
    ?.split('=')[1];

  // Add headers including XSRF token
  const headers = {
    'Content-Type': 'application/json',
    'X-XSRFToken': xsrfToken || '',
    ...init.headers
  };

  // Add _xsrf to the body for POST requests
  let body = init.body;
  if (init.method === 'POST' && typeof body === 'string') {
    const bodyData = JSON.parse(body);
    body = JSON.stringify({ ...bodyData, _xsrf: xsrfToken });
  }

  const response = await fetch(`/turboline-ai/${endpoint}`, {
    ...init,
    headers,
    body
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}\n${error}`);
  }
  const data = await response.json();
  return data.code || (data as any) as T;
}

