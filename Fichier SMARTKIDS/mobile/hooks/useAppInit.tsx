import { useCallback } from 'react';
import useRestoreUser from './useRestoreUser';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { StackParamList } from '../navigation';
import { User } from '../src/types/user.types';

export const NOTIFICATION_PERMISSION_KEY = 'NOTIFICATION_PERMISSION_KEY';

export default function useAppInit() {
  const restoreUser = useRestoreUser();

  /**
   * Initialize the app.
   * This function is called only once when the app is loaded.
   * It's used for startup tasks like, loading the user's,
   * checking permissions...
   */
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const initApp = useCallback(async () => {
    let result : { user?: User } = {};
    /**
     * Restore the user's session.
     */
    try {
      result = await restoreUser();
    } catch (error) {}
    /*
    if(result.user) {
      navigation.replace('tab-navigator');
    } else {
      navigation.navigate('onboarding');
    }
      */

    return async () => {
      // cleanupFirebase();
    };
  }, [restoreUser, dispatch, navigation]);

  return initApp;
}
