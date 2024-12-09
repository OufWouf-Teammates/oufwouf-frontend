import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { email: null, token: null },
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
        state.value = { email: action.payload.email, token: action.payload.accessToken }; // Réinitialiser l'état
        state.isLoggedIn = true;
    },
    disconnectUser: (state) => {
        state.value = { email: null, token: null }; // Réinitialiser l'état
        state.isLoggedIn = false;
    },
    reset: () => initialState, // Réinitialise l'état
  },
});

export const { connectUser, disconnectUser, reset } = userSlice.actions;
export default userSlice.reducer;
