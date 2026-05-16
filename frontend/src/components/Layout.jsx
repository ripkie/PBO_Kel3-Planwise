import Sidebar from './Sidebar';
import Topbar from './Topbar';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
