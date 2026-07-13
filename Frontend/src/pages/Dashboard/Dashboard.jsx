import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getQueriesStats, getQueries, getMyQueries } from '../../services/queryService.js';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import styles from './Dashboard.module.css';

function StatCard({ label, value, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue} style={{ color }}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function UserDashboard() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyQueries().then(({ data }) => setQueries(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const stats = queries.reduce(
    (acc, q) => {
      const status = q.status || 'open';
      if (acc[status] !== undefined) {
        acc[status]++;
      }
      return acc;
    },
    { open: 0, 'in-progress': 0, resolved: 0, closed: 0 }
  );

  const total = queries.length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My queries</h2>
          <p className={styles.subtitle}>
            {total} total {total === 1 ? 'query' : 'queries'} submitted by you.
          </p>
        </div>
        <Link to="/submit" className={styles.cta}>New query</Link>
      </div>

      <div className={styles.stats}>
        <StatCard label="Open" value={stats.open} color="var(--info)" />
        <StatCard label="In progress" value={stats['in-progress']} color="var(--warning)" />
        <StatCard label="Resolved" value={stats.resolved} color="var(--success)" />
        <StatCard label="Closed" value={stats.closed} color="var(--text-muted)" />
      </div>

      <div className={styles.panel}>
        {queries.length === 0 ? (
          <p className={styles.empty}>Nothing here yet. <Link to="/submit">Submit your first query.</Link></p>
        ) : (
          <div className={styles.list}>
            {queries.map((q) => (
              <div key={q._id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{q.title}</span>
                  <span className={styles.rowMeta}>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.rowRight}>
                  <span className={`priority-${(q.priority || 'medium').toLowerCase()}`}>{q.priority}</span>
                  <StatusBadge status={q.status} />
                  <Link to={`/queries/${q._id}`} className={styles.viewLink}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ open: 0, 'in-progress': 0, resolved: 0, closed: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getQueriesStats().then(({ data }) => data.data).catch(() => ({ open: 0, 'in-progress': 0, resolved: 0, closed: 0 })),
      getQueries({ limit: 5, page: 1 }).then(({ data }) => data.data).catch(() => []),
    ]).then(([s, q]) => { setStats(s); setRecent(q); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Overview</h2>
          <p className={styles.subtitle}>{total} total {total === 1 ? 'query' : 'queries'} across all customers.</p>
        </div>
        <Link to="/queries/create" className={styles.cta}>New query</Link>
      </div>

      <div className={styles.stats}>
        <StatCard label="Open" value={stats.open} color="var(--info)" />
        <StatCard label="In progress" value={stats['in-progress']} color="var(--warning)" />
        <StatCard label="Resolved" value={stats.resolved} color="var(--success)" />
        <StatCard label="Closed" value={stats.closed} color="var(--text-muted)" />
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span className={styles.panelTitle}>Recent queries</span>
          <Link to="/queries" className={styles.panelLink}>View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className={styles.empty}>No queries yet.</p>
        ) : (
          <div className={styles.list}>
            {recent.map((q) => (
              <div key={q._id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{q.title}</span>
                  <span className={styles.rowMeta}>{q.customerName} · {new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.rowRight}>
                  <span className={`priority-${(q.priority || 'medium').toLowerCase()}`}>{q.priority}</span>
                  <StatusBadge status={q.status} />
                  <Link to={`/queries/${q._id}`} className={styles.viewLink}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
