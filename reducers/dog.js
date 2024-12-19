import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: { name: null }
}

export const dogSlice = createSlice({
  name: "dog",
  initialState,
  reducers: {
    getDogName: (state, action) => {
      state.value.name = action.payload.name
    }
  }
})

export const { getDogName } = dogSlice.actions
export default dogSlice.reducer
