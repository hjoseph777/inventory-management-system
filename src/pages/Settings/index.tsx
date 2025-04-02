import React from 'react';

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-container">
        <div className="settings-section">
          <h2>User Preferences</h2>
          <form>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select id="language" defaultValue="en">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select id="theme" defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <button type="submit">Save Preferences</button>
          </form>
        </div>
        
        <div className="settings-section">
          <h2>System Settings</h2>
          <form>
            <div className="form-group">
              <label htmlFor="lowStockThreshold">Low Stock Threshold (%)</label>
              <input type="number" id="lowStockThreshold" defaultValue={20} min={1} max={100} />
            </div>
            
            <div className="form-group">
              <label htmlFor="notifications">Enable Notifications</label>
              <input type="checkbox" id="notifications" defaultChecked />
            </div>
            
            <button type="submit">Update Settings</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
