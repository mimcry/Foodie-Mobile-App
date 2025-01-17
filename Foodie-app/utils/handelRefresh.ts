import { useAtom } from 'jotai';
import { isLoggedInAtom } from '@/hooks/authAtom';
import { router } from 'expo-router';
import { ToastAndroid } from 'react-native';
const useTokenExpiry = () => {

  const [_, setAuthenticated] = useAtom(isLoggedInAtom);

  // Handle token expiry
  const handleTokenExpiry = async () => {
    console.log('Token expired or invalid. Please log in again.');
    const res = await handleRefresh();
    if (res && res.accessToken) {
      console.log('Access token refreshed successfully:', res.accessToken);
      localStorage.setItem('access_token', res.accessToken);
    } else {
      console.log('Refresh token expired or invalid. Logging out...');
      handleLogout();
ToastAndroid.show("Session expired. Please log in again.",ToastAndroid.SHORT)
    }
  };

  // Handle refresh token request
  const handleRefresh = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      const response = await fetch('http://192.168.1.67:9002/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refresh_token }),
      });

      // Assuming the response contains the new accessToken
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push("/(auth)/signin")
  };

  return { handleTokenExpiry, handleLogout };
};

export default useTokenExpiry;
