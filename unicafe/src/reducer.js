// reducer.js

const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
  totalReviews: 0,
  allRatings: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return {
        ...state,
        good: state.good + 1,
        totalReviews: state.totalReviews + 1,
        allRatings: [...state.allRatings, 1],
      };
    case 'OK':
      return {
        ...state,
        ok: state.ok + 1,
        totalReviews: state.totalReviews + 1,
        allRatings: [...state.allRatings, 0],
      };
    case 'BAD':
      return {
        ...state,
        bad: state.bad + 1,
        totalReviews: state.totalReviews + 1,
        allRatings: [...state.allRatings, -1],
      };
    case 'ZERO':
      return initialState;
    default:
      return state;
  }
};

export default reducer;
