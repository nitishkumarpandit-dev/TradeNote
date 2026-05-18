const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchWithAuth = async (
  endpoint: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {}
) => {
  const token = await getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merge custom headers if any
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {
        // Ignored
      }
      throw new Error(errorMsg);
    }

    // Return null on 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your internet connection.");
    }
    throw error;
  }
};
