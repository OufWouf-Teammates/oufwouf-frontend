import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { email: null, refreshToken: null, accessToken: null },
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
      state.value.email = action.payload.email;
      state.value.refreshToken = action.payload.refreshToken;
      state.value.accessToken = action.payload.accessToken;
      state.isLoggedIn = true;
    },
    disconnectUser: (state) => {
      state.value = { email: null, refreshToken: null, accessToken: null }; // Réinitialiser l'état
      state.isLoggedIn = false;
    },
    reset: () => initialState, // Réinitialise l'état
  },
});

export const { connectUser, disconnectUser, reset } = userSlice.actions;
export default userSlice.reducer;
