import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      alert("Please fill all the fields");
      return;
    }
    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/users/register`,
        {
         username: userName,
          email,
          password,
        },{
          withCredentials: true,
        }
      );
      if (response) {
        // Check if user was redirected from invite page
        const from = location.state?.from;
        if (from) {
          navigate(from);
        } else {
          navigate("/dashboard");
        }
      }
      
    } catch (error) {
      alert("Invalid email or password");
      console.log(error.response.message);
    }
  };

  return (
    <>
      <h1 className="text-5xl text-[#2D2D2D] font-extrabold text-center mt-3 text-shadow-[#8B8B8B]-lg/20 drop-shadow-lg ">
        Splitzy
      </h1>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center max-w-sm  p-4 rounded-md border-2 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px] border border-white/30">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl text-[#2D2D2D] font-bold text-center">
              Sign Up
            </h1>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 rounded-md border border-gray-300 mt-5 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none "
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded-md border border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full p-2  bg-[#6C4AB6] text-white rounded-lg"
              onClick={handleRegister}
            >
              Sign Up
            </button>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login", { state: location.state });
              }}
              className="text-sm text-[#6C4AB6]"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
