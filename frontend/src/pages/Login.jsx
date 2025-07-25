import axios from "axios";
import { useState } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
  
    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email,
          password,
          
        },{
          withCredentials: true,
        }
      );
      if(response.status === 200) navigate("/dashboard");
      
    } catch (error) {
      alert("Invalid email or password");
        console.log(error);
      
    }
    
    
  };

  return (
    <>
      <nav className="text-5xl text-[#2D2D2D] font-extrabold text-center mt-3 text-shadow-[#8B8B8B]-lg/20 drop-shadow-lg ">
        Splitzy
      </nav>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center max-w-sm  p-4 rounded-md border-2 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px] border border-white/30 ">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl text-[#2D2D2D] font-bold text-center">
              Login
            </h1>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded-md border border-gray-300 mt-10 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none "
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
            <button
              className="w-full p-2  bg-[#6C4AB6] text-white rounded-lg"
              onClick={handleLogin}
            >
              Login
            </button>
            <a href="/signup" onClick={()=>navigate("/signup")} className="text-sm text-[#6C4AB6]">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
