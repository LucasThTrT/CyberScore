import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchVulnerabilities } from '../services/notion';
import { computeLeaderboard, computeScoreTimeline, SEVERITY_POINTS } from '../utils/scoring';

const REFRESH_INTERVAL = 30 * 60 * 1000;
const VulnerabilitiesContext = createContext(null);

export function VulnerabilitiesProvider({ children }) {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newAwards, setNewAwards] = useState([]);

  const refresh = useCallback(async (initial = false) => {
    setError('');
    if (initial) {
      setLoading(true);
      setNewAwards([]);
    }
    else setRefreshing(true);

    try {
      const rows = await fetchVulnerabilities();
      setVulnerabilities((previousRows) => {
        if (!initial && previousRows.length > 0) {
          const previousIds = new Set(previousRows.map((item) => item.id));
          const newRows = rows.filter((item) => !previousIds.has(item.id));
          if (newRows.length > 0) {
            const awards = [...newRows]
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((item) => ({
                id: item.id,
                title: item.title,
                pentester: item.pentester,
                severity: item.severity,
                points: SEVERITY_POINTS[item.severity] || 0,
                triggerId: `${item.id}-${Date.now()}`,
              }));
            setNewAwards(awards);
          } else {
            setNewAwards([]);
          }
        }
        return rows;
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch vulnerabilities from Notion.');
    } finally {
      if (initial) setLoading(false);
      else setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh(true);
    const id = setInterval(() => refresh(false), REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  const leaderboard = useMemo(() => computeLeaderboard(vulnerabilities), [vulnerabilities]);
  const scoreTimeline = useMemo(() => computeScoreTimeline(vulnerabilities), [vulnerabilities]);

  const value = {
    vulnerabilities,
    leaderboard,
    scoreTimeline,
    loading,
    refreshing,
    error,
    lastUpdated,
    newAwards,
    manualRefresh: () => refresh(false),
  };

  return <VulnerabilitiesContext.Provider value={value}>{children}</VulnerabilitiesContext.Provider>;
}

export function useVulnerabilities() {
  const context = useContext(VulnerabilitiesContext);
  if (!context) {
    throw new Error('useVulnerabilities must be used within VulnerabilitiesProvider.');
  }
  return context;
}
