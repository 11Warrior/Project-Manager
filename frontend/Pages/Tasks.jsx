import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import RightPanel from "./RightPanel";
import { useParams } from 'react-router-dom';

const Tasks = () => {
  const { data: authUser } = useQuery({ queryKey: ['getAuthUser'] });
  const { groupId } = useParams();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    assignedTo: "",
    taskname: ""
  });

  const [comments, setComments] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCommentChange = (e, taskId) => {
    setComments(prev => ({
      ...prev,
      [taskId]: e.target.value
    }));
  };

const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['allTasks', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/allTasks/${groupId}`, {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: !!groupId
  });

  const assignTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${groupId}/createTasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to assign task");
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['allTasks', groupId] });
      setFormData({ assignedTo: "", taskname: "" });
    } catch (error) {
      console.log(error)
      console.error(error);
    }
  };

  const addComment = async (taskId, groupId) => {
    const commentText = comments[taskId];
    if (!commentText?.trim()) return;

    try {
      const res = await fetch(`/api/tasks/${groupId}/comment/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: commentText })
      });

      if (!res.ok) throw new Error("Failed to add comment");

      await res.json();
      setComments(prev => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-start gap-8 m-10 bg-zinc-900 min-h-screen overflow-hidden">
      <div className="w-2/3 flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="assignedTo">Assign to:</label>
          <input
            type="text"
            name="assignedTo"
            placeholder="Username"
            className="input input-info mt-2"
            value={formData.assignedTo}
            onChange={handleInputChange}
          />

          <label htmlFor="taskname" className="mt-4">Task:</label>
          <textarea
            name="taskname"
            placeholder="Task details..."
            className="textarea textarea-secondary mt-2 resize-none"
            onChange={handleInputChange}
            value={formData.taskname}
          ></textarea>

          <button
            className="text-white bg-green-600 hover:bg-green-700 w-32 h-10 mt-4 rounded-lg tracking-tight p-2 cursor-pointer"
            onClick={assignTask}
          >
            Assign Task
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>
          {isLoading ? (
            <p className="text-gray-300">Loading tasks...</p>
          ) : (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-gray-400">No tasks assigned yet.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="bg-gray-800 text-white p-4 rounded-md shadow-md">
                    <p className="font-bold text-lg">📝 {task.taskname}</p>
                    <p className="text-sm text-gray-400">
                      Assigned to: <span className="text-green-400">@{task.assignedTo?.userName}</span>
                    </p>
                    <div className='flex bg-zinc-900 mt-2 p-2 rounded-lg justify-between'>
                      <input
                        type="text"
                        name="text"
                        className="rounded-lg bg-white text-black w-200 p-2"
                        value={comments[task._id] || ""}
                        onChange={(e) => handleCommentChange(e, task._id)}
                      />
                      <button
                        className='p-2 bg-green-400 rounded-lg ml-2 cursor-pointer'
                        onClick={() => addComment(task._id, groupId)}
                      >
                        Comment
                      </button>
                    </div>
                    <div className=' rounded-lg text-black mt-1 p-2 '>
                      {
                        task.comments.length === 0 ? "No comments added..." : (
                        <div className='flex flex-col gap-1'>{
                          task.comments.map((comment) => (
                            <div key={comment._id} className='p-2 mt-2'>
                              <p className='space-y-2  bg-white rounded-lg p-1 '>{comment.text} <span><br /> By <span className='text-emerald-600'>@{authUser?.userName}</span></span></p>
                            </div>
                          ))
                          }
                        </div>
                        )
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 bg-zinc-900">
        <RightPanel />
      </div>
    </div>
  );
};

export default Tasks;
