import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Users from './components/Users';
import User from './components/User';

function App() {
  return (
    <div>
      <Router>
      <Header></Header>
        <Routes>
          <Route path="/login" element={<Login />}> </Route>
          <Route path="/register" element={<Register />}> </Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/user" element={<User />}></Route>
          <Route path="*" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
