export const SEVERITY_POINTS = {
  low: 100,
  medium: 200,
  high: 500,
};

export function computeLeaderboard(vulnerabilities) {
  const grouped = vulnerabilities.reduce((acc, vuln) => {
    const key = vuln.pentester || 'Unassigned';
    if (!acc[key]) {
      acc[key] = { pentester: key, score: 0, count: 0 };
    }
    acc[key].score += SEVERITY_POINTS[vuln.severity] || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function computeScoreTimeline(vulnerabilities) {
  const pentesters = Array.from(new Set(vulnerabilities.map((v) => v.pentester || 'Unassigned')));
  const byDate = [...vulnerabilities].sort((a, b) => new Date(a.date) - new Date(b.date));

  const totals = pentesters.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});

  return byDate.map((vuln) => {
    const pentester = vuln.pentester || 'Unassigned';
    totals[pentester] += SEVERITY_POINTS[vuln.severity] || 0;

    return {
      date: vuln.date,
      ...totals,
    };
  });
}
