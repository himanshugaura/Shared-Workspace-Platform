import { User } from "@/types/entity.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ViewProfileState {
    user: User | null;
}
const initialState : ViewProfileState = {
    user: null,
};

const viewProfileSlice = createSlice({
    name: 'viewProfile',
    initialState,
    reducers: {
        setViewProfile: (state : ViewProfileState, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearViewProfile: (state : ViewProfileState) => {
            state.user = null;
        },
    },
});

export const { setViewProfile, clearViewProfile } = viewProfileSlice.actions;
export default viewProfileSlice.reducer;