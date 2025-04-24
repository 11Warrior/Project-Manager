import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";


const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient()
  
  const {mutate: signUpSubmit, isPending} = useMutation({
    mutationFn: async ({fullName, userName, email, password}) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
					},
          body: JSON.stringify({fullName, userName, email, password})
        })
        const data = await res.json();
        return data
        
      } catch (error) {
        console.log(error)
      }
    },
    onSuccess: () => {
      toast.success('Signed')
      queryClient.invalidateQueries({queryKey: ['getAuthUser']})
    }
  })
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpSubmit(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md  p-8 rounded-lg "
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-600">Create Account</h2>

        <div className="mb-4">
          <label className="block text-sm text-white font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="example123"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="email@example.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 transition-colors text-white py-2 rounded font-semibold mt-4"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-amber-500 font-medium hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
