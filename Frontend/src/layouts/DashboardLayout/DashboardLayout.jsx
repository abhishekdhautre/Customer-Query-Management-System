import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Aurora from '../../components/Aurora/Aurora.jsx';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.aurora}>
        <Aurora
          colorStops={['#5227FF', '#B497CF', '#7cff67']}
          blend={0.6}
          amplitude={1.2}
          speed={0.4}
        />
      </div>
      <Navbar />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
