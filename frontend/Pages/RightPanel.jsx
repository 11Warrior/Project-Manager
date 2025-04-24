import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const RightPanel = () => {
  const { groupId } = useParams();

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/allMembers/${groupId}`, {
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error("Failed to fetch group members");
      }
      return res.json();
    },
    enabled: !!groupId 
  });

  if (isLoading) return <div className="p-4 text-gray-500">Loading members...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load members</div>;

  return (
    <div className="w-64  border-none bg-zinc-900 p-4 h-full shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-indigo-600">Group Members</h2>
      <hr className='mt-2 mb-2'/>
      <ul className="space-y-3">
        {members.map((user) => (
          <li key={user._id} className="p-2 rounded-lg bg-white">
            <p className="font-medium text-sm text-black">{user.fullName}</p>
            <p className="text-xs text-black-500 text-black">@{user.userName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightPanel;
