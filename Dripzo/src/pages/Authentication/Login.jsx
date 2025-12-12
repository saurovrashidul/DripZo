import { useForm } from "react-hook-form";
import { NavLink } from "react-router";
import SocialLogin from "../../SocialLogin/SocialLogin";
import Logo from "../../components/Logo/logo";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
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
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              placeholder="Enter your password"
            />
            {errors?.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <div className="mx-auto text-center">
            Don't have an account? <NavLink to="/register" className="hover:text-blue-600 transition-colors duration-200">Register</NavLink>
          </div>

        </form>

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
}
