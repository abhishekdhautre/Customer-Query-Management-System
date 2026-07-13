import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.dot} />
        <span className={styles.brand}>QueryFlow</span>
        {isAdmin && <span className={styles.badge}>Admin</span>}
      </div>
      <div className={styles.right}>
        {user && <span className={styles.user}>{user.name || user.username}</span>}
        <button className={styles.logout} onClick={() => { logout(); navigate('/login'); }}>
          Sign out
        </button>
      </div>
    </header>
  );
}
