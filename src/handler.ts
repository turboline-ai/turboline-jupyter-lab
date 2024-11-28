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
  const response = await fetch(`/turboline-ai/${endpoint}`, init);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}\n${error}`);
  }
  const data = await response.json();
  return data.code || (data as any) as T;
}

