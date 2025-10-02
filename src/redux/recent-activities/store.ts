import { createSlice } from "@reduxjs/toolkit";
import { getRecentActivitiesByLandlord, createRecentActivity } from "./action";

interface Activity {
  id: string;
  type: string;
  message: string;
  date_created: string;
  landlord: string;
}

interface RecentActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: RecentActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

const recentActivitiesSlice = createSlice({
  name: "recentActivities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentActivitiesByLandlord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivitiesByLandlord.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload || [];
      })
      .addCase(getRecentActivitiesByLandlord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default recentActivitiesSlice.reducer;
