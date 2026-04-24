import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-[#1C2B3A]">My Profile</h1>
        <p className="text-sm text-[#7A8FA6] mt-1">Manage your personal information and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1A6FB5] to-[#00C896]"></div>
        
        <div className="px-8 pb-8 pt-16 relative">
          {/* Avatar */}
          <div className="absolute -top-12 border-4 border-white w-24 h-24 bg-[#1C2B3A] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md">
            {initials}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#1C2B3A]">{user.name}</h2>
            <p className="text-[#7A8FA6] mb-6">{user.role}</p>

            <div className="space-y-6 max-w-lg">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A6FB5] shadow-sm">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Full Name</p>
                  <p className="text-[#1C2B3A] font-medium mt-0.5">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A6FB5] shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Email Address</p>
                  <p className="text-[#1C2B3A] font-medium mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A6FB5] shadow-sm">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Account Role</p>
                  <p className="text-[#1C2B3A] font-medium mt-0.5">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
