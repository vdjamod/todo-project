import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// USER
import User from "./components/User";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import CompletedTodo from "./components/CompletedTodo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/signin" element={<Signin />} />
        <Route path="/user/todo/complete" element={<CompletedTodo />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
