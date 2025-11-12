import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = getState().auth.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
        refreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Refresh failed');
    }
  }
);

export const { setCredentials, logout } = authSlice.actions; // ← DÙNG CÁCH NÀY
export default authSlice.reducer;
