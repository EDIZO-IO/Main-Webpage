import { useState, useEffect } from 'react';
import { servicesAPI } from '../api/api';

const CACHE_KEY = 'edizo_services_cache';
const CACHE_DURATION = 10 * 60 * 1000;

let globalCache = null;

export const useServices = (category, featured) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      if (globalCache && globalCache.data.length > 0) {
        setServices(globalCache.data);
        setLoading(false);
        
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshServices();
        }
        return;
      }

      try {
        setLoading(true);
        const response = await servicesAPI.getAll({ category, featured });
        
        globalCache = {
          data: response.data.services || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setServices(globalCache.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch services');
        setLoading(false);
      }
    };

    loadServices();
  }, [category, featured]);

  const refreshServices = async () => {
    try {
      const response = await servicesAPI.getAll({ category, featured });
      globalCache = {
        data: response.data.services || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setServices(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh services:', err);
    }
  };

  return { services, loading, error };
};

export const useService = (id) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getById(id);
        setService(response.data.service);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch service');
        setLoading(false);
      }
    };

    if (id) {
      loadService();
    }
  }, [id]);

  return { service, loading, error };
};
