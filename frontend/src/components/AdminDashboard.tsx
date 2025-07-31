import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, type Tutor, type Client } from '../services/api';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table } from './ui/table';
import { Settings, Users, GraduationCap, Trash2, Edit, Save, X } from 'lucide-react';

interface AdminStats {
  tutors_count: number;
  clients_count: number;
  total_users: number;
}

const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTutor, setEditingTutor] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (isAdmin && currentUser?.email) {
      loadAdminData();
    }
  }, [isAdmin, currentUser]);

  const loadAdminData = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      const [statsResponse, tutorsResponse, clientsResponse] = await Promise.all([
        apiService.getAdminStats(currentUser.email),
        apiService.getTutors(),
        apiService.getClients(),
      ]);

      setStats(statsResponse.data);
      setTutors(tutorsResponse.data);
      setClients(clientsResponse.data);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTutor = (tutor: Tutor) => {
    setEditingTutor(tutor.id!);
    setEditData(tutor);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client.id!);
    setEditData(client);
  };

  const handleSaveTutor = async () => {
    if (!currentUser?.email || !editingTutor) return;

    try {
      await apiService.updateTutor(editingTutor, editData, currentUser.email);
      setEditingTutor(null);
      setEditData({});
      loadAdminData();
    } catch (err) {
      setError('Failed to update tutor');
      console.error(err);
    }
  };

  const handleSaveClient = async () => {
    if (!currentUser?.email || !editingClient) return;

    try {
      await apiService.updateClient(editingClient, editData, currentUser.email);
      setEditingClient(null);
      setEditData({});
      loadAdminData();
    } catch (err) {
      setError('Failed to update client');
      console.error(err);
    }
  };

  const handleDeleteTutor = async (id: number) => {
    if (!currentUser?.email || !window.confirm('Are you sure you want to delete this tutor?')) return;

    try {
      await apiService.deleteTutor(id, currentUser.email);
      loadAdminData();
    } catch (err) {
      setError('Failed to delete tutor');
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!currentUser?.email || !window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await apiService.deleteClient(id, currentUser.email);
      loadAdminData();
    } catch (err) {
      setError('Failed to delete client');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingTutor(null);
    setEditingClient(null);
    setEditData({});
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage tutors and students in the system
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Total Tutors</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.tutors_count}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Total Students</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.clients_count}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Total Users</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total_users}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tutors Table */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Tutors</h2>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Subjects</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Pay Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tutor) => (
                    <tr key={tutor.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">
                        {editingTutor === tutor.id ? (
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{tutor.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingTutor === tutor.id ? (
                          <input
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300">{tutor.email}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {tutor.subjects?.map((subject, index) => (
                            <Badge key={index} variant="secondary">{subject}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {editingTutor === tutor.id ? (
                          <input
                            type="number"
                            value={editData.pay || ''}
                            onChange={(e) => setEditData({...editData, pay: parseFloat(e.target.value)})}
                            className="w-20 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">${tutor.pay}/hr</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {editingTutor === tutor.id ? (
                            <>
                              <Button
                                onClick={handleSaveTutor}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleEditTutor(tutor)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteTutor(tutor.id!)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Clients Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Students</h2>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Subjects</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">
                        {editingClient === client.id ? (
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{client.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingClient === client.id ? (
                          <input
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300">{client.email}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {client.subjects?.map((subject, index) => (
                            <Badge key={index} variant="secondary">{subject}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {editingClient === client.id ? (
                          <input
                            type="number"
                            value={editData.budget || ''}
                            onChange={(e) => setEditData({...editData, budget: parseFloat(e.target.value)})}
                            className="w-20 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">${client.budget}/hr</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {editingClient === client.id ? (
                            <>
                              <Button
                                onClick={handleSaveClient}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleEditClient(client)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteClient(client.id!)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;