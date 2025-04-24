import React from 'react';
import "../../styles/dashboard.css";

const Settings = () => {
  return (
    <div className="settings-page" style={{ background: '#f6f8fa', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="dashboard-section" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#263238', marginBottom: 18, borderBottom: '1px solid #eceff1', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-icons" style={{ fontSize: 22, color: '#1976d2' }}>person</span>
            User Preferences
          </h2>
          <form className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 0 }}>
            <div className="form-group">
              <label htmlFor="language" className="form-label">Language</label>
              <select id="language" defaultValue="en" className="form-select">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="theme" className="form-label">Theme</label>
              <select id="theme" defaultValue="light" className="form-select">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-icons" style={{ fontSize: 18 }}>save</span>
                Save Preferences
              </button>
            </div>
          </form>
        </div>
        <div className="dashboard-section">
          <h2 style={{ fontSize: 20, color: '#263238', marginBottom: 18, borderBottom: '1px solid #eceff1', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-icons" style={{ fontSize: 22, color: '#1976d2' }}>settings</span>
            System Settings
          </h2>
          <form className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 0 }}>
            <div className="form-group">
              <label htmlFor="lowStockThreshold" className="form-label">Low Stock Threshold (%)</label>
              <input type="number" id="lowStockThreshold" defaultValue={20} min={1} max={100} className="form-control" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="notifications" defaultChecked style={{ marginRight: 8 }} />
              <label htmlFor="notifications" className="form-label" style={{ margin: 0 }}>Enable Notifications</label>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-icons" style={{ fontSize: 18 }}>update</span>
                Update Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
