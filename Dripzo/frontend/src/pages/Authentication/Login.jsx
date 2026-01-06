import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import SocialLogin from "../../SocialLogin/SocialLogin";
import Logo from "../../components/Logo/logo";
import useAuth from "../../contexts/useAuth";
import { useState } from "react";



export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState(""); // track password input

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  const { signIn } = useAuth();

  // where user wanted to go before login
  const from = location.state?.from || "/";


  const onSubmit = (data) => {
    const { email, password } = data;

    setLoginError(""); // clear previous error

    signIn(email, password)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error(error);

        // 🔴 handle common auth errors
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          setLoginError("Check Email Or Password Again.");
        } else if (error.code === "auth/user-not-found") {
          setLoginError("No account found with this email.");
        } else {
          setLoginError("Login failed. Please try again.");
        }
      });
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">

      {/* Logo */}
      <Logo className="mb-6" />

      {/* Login Box */}
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              placeholder="Enter your email"
            />
            {errors?.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>




          {/* Password */}
       
       {/* Password */}
<div className="relative">
  <label className="block mb-1 font-semibold">Password</label>

  <input
    type={showPassword ? "text" : "password"}
    {...register("password", { required: true })}
    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
    placeholder="Enter your password"
    onChange={(e) => setPasswordValue(e.target.value)} // 🔹 track input value
  />

  {errors?.password && (
    <p className="text-red-500 text-sm mt-1">Password is required</p>
  )}

  {/* 🔹 Show toggle only if user typed something */}
  {passwordValue && (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-9 text-gray-500 text-sm"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  )}
</div>


          {/* Login Error */}
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          {/* </div> */}




          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <div className="mx-auto text-center">
            Don't have an account? <NavLink to="/register" state={{ from: location.state?.from }} className="hover:text-blue-600 transition-colors duration-200">Register</NavLink>
          </div>

        </form>

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
}

