import { createSlice } from '@reduxjs/toolkit';

const carSlice = createSlice({
  name: 'car',
  initialState: { cars: [] },
  reducers: {
    addCar(state, action) {
      const content = action.payload;
      state.cars.push({
        id: content.id || Math.random(), 
        name: content.name,
        date: content.date,
        kilometers: content.kilometers,
        refuledLiters: content.refuledLiters,
        price: content.price,
      });
    },
    setCars(state, action) {
      state.cars = action.payload;
    },
    removeCar(state, action) {
      const id = action.payload;
      state.cars = state.cars.filter(car => car.id !== id);
    },
  },
});

export const { addCar, setCars, removeCar } = carSlice.actions;
export default carSlice.reducer;