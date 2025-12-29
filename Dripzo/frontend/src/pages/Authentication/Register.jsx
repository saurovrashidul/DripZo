import { useForm } from "react-hook-form";
import { NavLink } from "react-router";
import useAuth from "../../contexts/useAuth";
import SocialLogin from "../../SocialLogin/SocialLogin";
import Logo from "../../components/Logo/logo";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate, useLocation } from "react-router";


export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser } = useAuth();
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";


  // const onSubmit = (data) => {
  //   const { email, password } = data;

  //   createUser(email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       console.log("Registered User:", user);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const onSubmit = (data) => {
    const { name, email, password } = data;

    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        axiosSecure.post("/users", {
          name,
          email: user.email,
        });

        navigate(from, { replace: true });
      })


      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">

      {/* Logo */}
      <Logo className="mb-6" />

      {/* Register Box */}
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              placeholder="Your Name"
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

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
              {...register("password", { required: true, minLength: 6 })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              placeholder="Enter your password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm mt-1">Password should be at least 6 characters</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <div className="mx-auto text-center">
            Already have an account? <NavLink to="/login" className="hover:text-blue-600 transition-colors duration-200">Login</NavLink>
          </div>

        </form>

        {/* Social Login */}
        <SocialLogin />
      </div>
    </div>
  );
}
