import { useState } from 'react';
import Dropdown from '@/components/Dropdown';
import NotificationBanner from '@/components/NotificationBanner';
import { useSession } from 'next-auth/react';

const SettingsForm = () => {
  const { data: session, update } = useSession();
    
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
  const [emailReportIds, setEmailReportIds] = useState(session?.user?.emailReportIds);
  const [notificationsEnabled, setNotificationsEnabled] = useState(session?.user?.notificationsEnabled);
  const [theme, setTheme] = useState(session?.user?.theme);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session?.user?.id,
        updates: { emailReportIds, notificationsEnabled, theme },
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setSuccessMessage('Settings updated successfully!');
      setErrorMessage(null);

      if (update && session?.user) {
        const newSession = { ...session.user, emailReportIds, notificationsEnabled, theme };
        update(newSession);
      }
    } else {
      setErrorMessage(result.message || 'Failed to update settings. Please try again later.');
      setSuccessMessage(null);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert("This feature has not been implemented yet. Please contact us if you wish to delete your account.");
      console.log('Account deletion requested');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Settings</h2>

      {successMessage && (
        <div className="mb-4">
          <NotificationBanner type='success'>{successMessage}</NotificationBanner>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <NotificationBanner type='error'>{errorMessage}</NotificationBanner>
        </div>
      )}
        
      <form className="space-y-6">
        <div className="flex items-center justify-between">
          <span>Email report IDs on purchase</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailReportIds}
              onChange={(e) => setEmailReportIds(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Email Notification Toggle */}
        <div className="flex items-center justify-between">
          <span>Enable email notifications</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <Dropdown
            options={['Light','Dark']}
            selected={theme || 'Light'}
            onSelect={setTheme}
          />
        </div>

        <div className="grid grid-cols-2 space-x-4">        
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-medium-brown text-white rounded-md hover:opacity-75"
          >
            Save Settings
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-medium-brown text-white rounded-md hover:opacity-75"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
