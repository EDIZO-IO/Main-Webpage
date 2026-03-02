import { useState, useEffect } from 'react';
import { projectsAPI } from '../api/api';

const CACHE_KEY = 'edizo_projects_cache';
const CACHE_DURATION = 10 * 60 * 1000;

let globalCache = null;

export const useProjects = (featured, industry) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      if (globalCache && globalCache.data.length > 0) {
        setProjects(globalCache.data);
        setLoading(false);
        
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshProjects();
        }
        return;
      }

      try {
        setLoading(true);
        const response = await projectsAPI.getAll({ featured, industry });
        
        globalCache = {
          data: response.data.projects || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setProjects(globalCache.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch projects');
        setLoading(false);
      }
    };

    loadProjects();
  }, [featured, industry]);

  const refreshProjects = async () => {
    try {
      const response = await projectsAPI.getAll({ featured, industry });
      globalCache = {
        data: response.data.projects || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setProjects(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh projects:', err);
    }
  };

  return { projects, loading, error };
};

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getById(id);
        setProject(response.data.project);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch project');
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  return { project, loading, error };
};
