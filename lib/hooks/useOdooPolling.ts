"use client";

import { useState, useEffect, useCallback } from 'react';

// Define a generic type for the hook response
interface PollingResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to poll Odoo API data at a fixed interval.
 * @param fetcherFn - The async function to fetch data (e.g., odooAPI.getProducts)
 * @param intervalMs - Polling interval in milliseconds (default: 60000ms = 1 min)
 * @param dependencies - Dependency array to re-create the effect (optional)
 */
export function useOdooPolling<T>(
    fetcherFn: () => Promise<any>,
    intervalMs: number = 60000,
    dependencies: any[] = []
): PollingResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (isPolling = false) => {
        try {
            if (!isPolling) setLoading(true); // Don't show loading state on background polls

            const response = await fetcherFn();

            // Handle standard Odoo API response wrapper { status: "success", data: ... }
            if (response && response.status === 'success' && response.data !== undefined) {
                setData(response.data);
            } else if (response && response.error) {
                // API might return { error: "message" }
                throw new Error(response.error);
            } else {
                // Direct data or unknown format
                setData(response);
            }

            if (!isPolling) setLoading(false);
            setError(null);
        } catch (err: any) {
            console.error("Polling Error:", err);
            setError(err.message || "Failed to fetch data");
            if (!isPolling) setLoading(false);
        }
    }, [fetcherFn]); // We rely on fetcherFn being stable or wrapped in useCallback by consumer if it changes

    // Initial fetch and interval setup
    useEffect(() => {
        let isMounted = true;

        // Initial fetch
        fetchData(false);

        // Setup polling
        const intervalId = setInterval(() => {
            if (isMounted) fetchData(true);
        }, intervalMs);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalMs, ...dependencies]);

    return { data, loading, error, refetch: () => fetchData(false) };
}
