import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginSubmit, isPending } = useMutation({
    mutationFn: async ({ userName, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Login API Error:", data);
        throw new Error(data.message || "Login failed");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({queryKey: ['getAuthUser']})
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending login data: ", formData);
    loginSubmit(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className=" rounded-lg px-8 pt-8 pb-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Username</label>
          <input
            type="text"
            name="userName"
            placeholder="sample_ok"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 "
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 "
            />
            <span
              className="absolute right-3 top-2 text-sm text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-violet-600 hover:bg-purple-600 text-black cursor-pointer font-semibold py-2 rounded transition-colors duration-200"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
