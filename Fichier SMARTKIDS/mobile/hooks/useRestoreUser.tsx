import { useCallback } from 'react';
import { useLazyGetProfileQuery } from '../src/features/users/store/user.apiSlice';

export default function useRestoreUser() {
  const [getProfile] = useLazyGetProfileQuery();

  const restoreUser = useCallback(async () => {
    return await getProfile().then(async res => {
      if ('data' in res && res.data) {

        return { user: res.data.data };
      }

      return {};

    });
  }, [getProfile]);

  return restoreUser;
}
