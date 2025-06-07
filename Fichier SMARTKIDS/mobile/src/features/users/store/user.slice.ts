import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { setItemAsync } from 'expo-secure-store';

export const DRIVER_OPEN_RIDE_KEY = 'open_for_drives';
interface UserState {
  openForNewDrive: 0 | 1;
}

const initialState: UserState = {
  openForNewDrive: 1,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDriverIsOpenForDrive(state, { payload }: PayloadAction<0 | 1>) {
      state.openForNewDrive = payload;
      setItemAsync(
        DRIVER_OPEN_RIDE_KEY,
        JSON.stringify(payload ? 1 : 0),
      ).catch();
    },
  },
});

export const { setDriverIsOpenForDrive } = userSlice.actions;

export const selectDriverIsOpenForDrive = (state: RootState) => state.user.openForNewDrive;

export default userSlice.reducer;
