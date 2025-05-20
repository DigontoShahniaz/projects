// Auth.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';
import { setError, clearError, logout } from './slices/authSlice';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.auth);

  const handleAuth = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Authentication error:", error);
      dispatch(setError(error.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleAuth}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsSignUp(!isSignUp)} 
        className="switch-auth-mode"
      >
        {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

export const LogoutButton = () => {
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setError(error.message));
    }
  };
  
  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};