import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Lock, Shield, LogOut } from 'lucide-react';
import { authAPI } from '../api/api';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setFormData({
        fullName: response.data.user.full_name || '',
        email: response.data.user.email || '',
        phone: response.data.user.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/');
    setTimeout(() => window.location.reload(), 500);
  };

  const handleSaveProfile = async () => {
    try {
      await authAPI.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
        breadcrumb={[
          { label: 'Home', path: '/' },
          { label: 'Profile' }
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-orange-500/30">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.full_name || 'User'}</h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.role === 'admin' || user?.role === 'super_admin'
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  >
                    <Edit2 size={16} style={{ marginRight: '8px' }} />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-200"
                  >
                    <Lock size={16} style={{ marginRight: '8px' }} />
                    Change Password
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} style={{ marginRight: '8px' }} />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-orange-500" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`font-semibold ${user?.email_verified ? 'text-green-600' : 'text-orange-600'}`}>
                    {user?.email_verified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Status</span>
                  <span className={`font-semibold ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User size={24} className="mr-2 text-orange-500" />
                Personal Information
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    >
                      <Save size={16} style={{ marginRight: '8px' }} />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: user?.full_name || '',
                          email: user?.email || '',
                          phone: user?.phone || ''
                        });
                      }}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700"
                    >
                      <X size={16} style={{ marginRight: '8px' }} />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">{user?.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email Address</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Account Role</p>
                      <p className="font-semibold text-gray-900 capitalize">{user?.role || 'User'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password */}
            {isChangingPassword && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock size={24} className="mr-2 text-orange-500" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleChangePassword}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    >
                      <Lock size={16} style={{ marginRight: '8px' }} />
                      Change Password
                    </Button>
                    <Button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700"
                    >
                      <X size={16} style={{ marginRight: '8px' }} />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar size={24} className="mr-2 text-orange-500" />
                Account Activity
              </h3>
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Activity history will be available soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
