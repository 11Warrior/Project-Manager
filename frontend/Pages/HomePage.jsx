import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const queryClient = useQueryClient();

  const {data: authUser} = useQuery({queryKey: ['getAuthUser']})
  
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    Description: ""
  });

  const logOut = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: "POST"
      });
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ['getAuthUser'] });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    {/**Creating groups */}
const createGroup = async () => {
    if (!formData.title.trim()) return;
    try {
      const res = await fetch('/api/groups/createGroup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: formData.title, Description: formData.Description })
      });

      const data = await res.json();
      if (res.ok) {

        queryClient.invalidateQueries({ queryKey: ['groups'] });
        setFormData({ title: "" , Description: ""}); 
        alert("Group created successfully!");
      } else {
        console.log("Group creation failed", data);
      }
    } catch (error) {
      console.log("Error creating group", error);
    }
  };

const joinGroup = async (groupId) => {
  try {
    const res = await fetch(`/api/groups/joinLeaveGroup/${groupId}`, {
      method: "POST",
      credentials: 'include'
    })
    const data = await res.json();
    queryClient.invalidateQueries({queryKey: ['getAuthUser']})
    navigate(`/tasks/${groupId}`)
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    const fetchAllGroups = async () => {
    try {
      const res = await fetch('/api/groups/allGroups', {
        method: "POST",
        credentials: 'include'
      })
      if (!res.ok) console.log(res.error)
      const data = await res.json();
      console.log(data)
      setGroups(data);
    } catch (error) {
      console.log(error)
    }
  }
  fetchAllGroups()
 },[])
 
  return (
    <div className='max-w-6xl min-h-screen overflow-hidden'>
      <button 
        className='text-red-400 flex flex-11/12 mb-5 justify-between items-end cursor-pointer'
        onClick={logOut}>
        Log Out
      </button>

      <div className='CreateGroups m-5'>
        <h1 className='mb-4 text-blue-500 text-4xl tracking-tighter'>Create Groups</h1>
        <div className='flex flex-col m-4'>
            <label htmlFor="title"> Group Title :</label>
            <input 
              type="text" 
              name="title"
              placeholder="Group Name" 
              className="input input-info mt-3" 
              value={formData.title}
              onChange={handleInputChange}
            />
            <label htmlFor="title" className='mt-3'> Group Description :</label>
            <textarea type="text" name='Description' placeholder="Secondary" className="textarea textarea-secondary mt-3 resize-none" onChange={handleInputChange}  value={formData.Description } ></textarea>
        </div>
        <button 
          className='ml-2 text-white cursor-pointer bg-indigo-700 p-2 rounded-lg' 
          onClick={createGroup}>
          Create
        </button>
      </div>

      <div className='groups items-center justify-center m-20 min-h-screen'>
        <h1 className='text-3xl font-bold mb-5'>Your Groups</h1>
        <hr className='mb-10' />
        <div className="flex flex-wrap gap-6">

          {/**large cards for groups */}
          {groups.map((group) => (
          <div className="card w-96 bg-base-100 card-lg shadow-sm">
            <div className="card-body">
              <h2 className="card-title">{group.title}</h2>
              <p>{group.Description}</p>
              <div className="justify-end card-actions">
                {
                  authUser?.Joined?.includes(group._id) ? (
                    <button className="btn btn-primary bg-yellow-400 rounded-lg p-1 w-full cursor-pointer " onClick={() => navigate(`/tasks/${group._id}`)}>
                    View
                  </button>
                  ) : (
                    <button className='bg-green-600 rounded-lg p-1 w-full cursor-pointer' onClick={() => joinGroup(group._id)}>Join</button>
                  )
                }
              </div>
            </div>
          </div>
          ))
        }
        </div>
      </div>
    </div>
  );
};

export default HomePage;
