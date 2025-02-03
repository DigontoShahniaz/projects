import { createSlice } from '@reduxjs/toolkit'


const filterSlice = createSlice({
  name: 'filter',
  initialState: 'ALL',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

export const filterChange = (filter) => (dispatch) => {
  dispatch(filterSlice.actions.setFilter(filter))
}


export default filterSlice.reducer
