// App.jsx
import { useSelector, useDispatch } from 'react-redux';
import { addCar, removeCar, setCars } from './slices/carSlice';
import { setUser, setLoading } from './slices/authSlice';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  onAuthStateChanged 
} from './firebase';
import { Login, LogoutButton } from './Auth';
import './App.css';

const Info = () => {
  const data = useSelector((state) => state.car.cars);
  const dispatch = useDispatch();

  const handleRemoveCar = async (id) => {
    try {
      await deleteDoc(doc(db, 'cars', id));
      dispatch(removeCar(id));
    } catch (error) {
      console.error('Error removing car:', error);
    }
  };

  const updatedData = data.map((car) => ({
    ...car,
    cost: car.price * car.refuledLiters,
    consumption: (car.refuledLiters / car.kilometers) * 100,
  }));

  const totalCost = updatedData.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div>
      {updatedData.length === 0 ? (
        <p>No car data available. Add some cars below.</p>
      ) : (
        <div>
          {updatedData.map((car) => (
            <div key={car.id}>
              <h2>{car.name}</h2>
              <p>Date: {car.date}</p>
              <p>Kilometers: {car.kilometers}</p>
              <p>Refueled Liters: {car.refuledLiters}</p>
              <p>Price: {car.price}</p>
              <p>Cost: {car.cost.toFixed(2)}</p>
              <p>Consumption: {car.consumption.toFixed(2)} L/100 km</p>
              <button onClick={() => handleRemoveCar(car.id)}>Remove</button>
            </div>
          ))}
          <h3>Total Cost: {totalCost.toFixed(2)}</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={updatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumption" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};


const NewSeason = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector(state => state.auth);

  const addCarHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = event.target;
      const name = form.name.value;
      const date = form.date.value;
      const kilometers = parseFloat(form.kilometers.value);
      const refuledLiters = parseFloat(form.refuledLiters.value);
      const price = parseFloat(form.price.value);

      if (isNaN(kilometers) || isNaN(refuledLiters) || isNaN(price)) {
        alert('Please enter valid numbers');
        return;
      }

      const docRef = await addDoc(collection(db, 'cars'), {
        userId: user.uid,
        name,
        date,
        kilometers,
        refuledLiters,
        price,
      });

      dispatch(addCar({
        id: docRef.id,
        name,
        date,
        kilometers,
        refuledLiters,
        price,
      }));

      form.reset();
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add car data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Add New Car Data</h2>
      <form onSubmit={addCarHandler}>
        <div>
          <label>Season</label>
          <input type="text" name="name" required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" name="date" required />
        </div>
        <div>
          <label>Kilometers</label>
          <input type="number" name="kilometers" step="0.01" required />
        </div>
        <div>
          <label>Refueled Liters</label>
          <input type="number" name="refuledLiters" step="0.01" required />
        </div>
        <div>
          <label>Price</label>
          <input type="number" name="price" step="0.01" required />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Car'}
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        setFetchingData(true);
        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const cars = [];
        querySnapshot.forEach((doc) => {
          const carData = doc.data();
          
          let dateValue = carData.date;
          if (dateValue && typeof dateValue.toDate === 'function') {
            dateValue = dateValue.toDate().toISOString().split('T')[0]; 
          }
          
          cars.push({
            id: doc.id,
            name: carData.name,
            date: dateValue,
            kilometers: carData.kilometers,
            refuledLiters: carData.refuledLiters,
            price: carData.price,
          });
        });
        
        dispatch(setCars(cars));
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setFetchingData(false);
      }
    };
    
    if (user) {
      fetchUserCars();
    }
  }, [user, dispatch]);

  if (fetchingData) {
    return <div>Loading your car data...</div>;
  }

  return (
    <div className="dashboard">
      <div className="user-header">
        <h2>Welcome, {user.email}</h2>
        <LogoutButton />
      </div>
      <Info />
      <NewSeason />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
        }));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Car Consumption</h1>
      <div className="app-container">
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
    </div>

  );
};

export default App;