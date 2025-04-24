import HomePage from '../Pages/HomePage'
import LoginPage from '../Pages/LoginPage'
import SignUp from '../Pages/SignUp'
import Tasks from '../Pages/Tasks'
import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

function App() {
  const { data: loggedUser, isLoading } = useQuery({
    queryKey: ['getAuthUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/getAuthUser', {
          method: 'GET',
          credentials: 'include'
        })
        const data = await res.json()
        if (data.error) return null
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        return data
      } catch (error) {
        console.log('Error in getAuthUser query', error)
      }
    },
    retry: false
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-warning"></span>
      </div>
    )
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={loggedUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks/:groupId"
          element={loggedUser ? <Tasks /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!loggedUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!loggedUser ? <SignUp /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  )
}

export default App
