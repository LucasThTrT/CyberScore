import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchVulnerabilities } from '../services/notion';
import { computeLeaderboard, computeScoreTimeline, SEVERITY_POINTS } from '../utils/scoring';

const REFRESH_INTERVAL = 60 * 1000;
const VulnerabilitiesContext = createContext(null);
const PERIOD_STORAGE_KEY = 'pentester-dashboard-period';

const PERIODS = {
  '2w': { label: '2 semaines', days: 14 },
  '1m': { label: '1 mois', days: 30 },
  '2m': { label: '2 mois', days: 60 },
  '6m': { label: '6 mois', days: 180 },
  '1y': { label: '1 an', days: 365 },
};

export function VulnerabilitiesProvider({ children }) {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newAwards, setNewAwards] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    if (typeof window === 'undefined') return '1m';
    const saved = window.localStorage.getItem(PERIOD_STORAGE_KEY);
    return saved && PERIODS[saved] ? saved : '1m';
  });

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PERIOD_STORAGE_KEY, selectedPeriod);
    }
  }, [selectedPeriod]);

  const leaderboard = useMemo(() => computeLeaderboard(vulnerabilities), [vulnerabilities]);
  const scoreTimeline = useMemo(() => computeScoreTimeline(vulnerabilities), [vulnerabilities]);
  const filteredVulnerabilities = useMemo(() => {
    const windowDays = PERIODS[selectedPeriod]?.days ?? 30;
    const minDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    return vulnerabilities.filter((item) => {
      const itemDate = new Date(item.date);
      if (Number.isNaN(itemDate.getTime())) return false;
      return itemDate >= minDate;
    });
  }, [vulnerabilities, selectedPeriod]);
  const filteredLeaderboard = useMemo(
    () => computeLeaderboard(filteredVulnerabilities),
    [filteredVulnerabilities]
  );
  const filteredScoreTimeline = useMemo(
    () => computeScoreTimeline(filteredVulnerabilities),
    [filteredVulnerabilities]
  );

  const value = {
    vulnerabilities,
    leaderboard,
    scoreTimeline,
    filteredVulnerabilities,
    filteredLeaderboard,
    filteredScoreTimeline,
    loading,
    refreshing,
    error,
    lastUpdated,
    newAwards,
    selectedPeriod,
    periodOptions: Object.entries(PERIODS).map(([value, meta]) => ({ value, label: meta.label })),
    setSelectedPeriod,
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
