import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// USER
import User from "./components/User";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import CompletedTodo from "./components/CompletedTodo";
import AuthLayout from "./components/AuthLayout";
import ForgetPassword from "./components/ForgetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/user"
          element={
            <AuthLayout>
              <User />
            </AuthLayout>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route
          path="/user/todo/complete"
          element={
            <AuthLayout>
              <CompletedTodo />
            </AuthLayout>
          }
        />

        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
