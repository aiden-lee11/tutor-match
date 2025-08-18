import React, { useState, useEffect } from 'react';
import { apiService, type Client } from '../services/api';
import { Button } from './ui/button';
import ClientDetailModal from './ClientDetailModal';
import { useAuth } from '../contexts/AuthContext';

const TutorDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { currentUser, login } = useAuth();

  // Education categories
  const educationCategories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'elementary', name: 'Elementary School', icon: '🎒' },
    { id: 'middle', name: 'Middle School', icon: '📖' },
    { id: 'high', name: 'High School', icon: '🎓' },
    { id: 'college', name: 'College Application', icon: '🏛️' },
    { id: 'medical', name: 'Med School Application', icon: '⚕️' },
    { id: 'job', name: 'Job Application', icon: '💼' }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => {
        const clientSubjects = client.subjects.map(s => s.toLowerCase());
        const clientEducation = client.education?.toLowerCase() || '';
        
        switch (selectedCategory) {
          case 'elementary':
            return clientSubjects.some(subject => 
              subject.includes('elementary') || 
              subject.includes('basic') ||
              subject.includes('kindergarten') ||
              subject.includes('grade 1') || subject.includes('grade 2') || subject.includes('grade 3') ||
              subject.includes('grade 4') || subject.includes('grade 5')
            ) || clientEducation.includes('elementary');
          case 'middle':
            return clientSubjects.some(subject => 
              subject.includes('middle') || 
              subject.includes('grade 6') || subject.includes('grade 7') || subject.includes('grade 8') ||
              subject.includes('intermediate')
            ) || clientEducation.includes('middle');
          case 'high':
            return clientSubjects.some(subject => 
              subject.includes('high school') || 
              subject.includes('grade 9') || subject.includes('grade 10') || 
              subject.includes('grade 11') || subject.includes('grade 12') ||
              subject.includes('ap ') || subject.includes('advanced placement') ||
              subject.includes('ib ') || subject.includes('international baccalaureate') ||
              subject.includes('sat') || subject.includes('act') ||
              subject.includes('algebra') || subject.includes('geometry') || 
              subject.includes('calculus') || subject.includes('physics') ||
              subject.includes('chemistry') || subject.includes('biology')
            ) || clientEducation.includes('high school');
          case 'college':
            return clientSubjects.some(subject => 
              subject.includes('college') || 
              subject.includes('university') ||
              subject.includes('admission') ||
              subject.includes('application') ||
              subject.includes('essay writing') ||
              subject.includes('personal statement')
            ) || clientEducation.includes('college') || clientEducation.includes('university');
          case 'medical':
            return clientSubjects.some(subject => 
              subject.includes('mcat') || 
              subject.includes('medical') ||
              subject.includes('pre-med') ||
              subject.includes('premed') ||
              subject.includes('med school') ||
              subject.includes('anatomy') ||
              subject.includes('physiology') ||
              subject.includes('biochemistry')
            ) || clientEducation.includes('medical') || clientEducation.includes('pre-med');
          case 'job':
            return clientSubjects.some(subject => 
              subject.includes('job') || 
              subject.includes('career') ||
              subject.includes('interview') ||
              subject.includes('resume') ||
              subject.includes('professional') ||
              subject.includes('workplace')
            );
          default:
            return true;
        }
      });
      setFilteredClients(filtered);
    }
  }, [clients, selectedCategory]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClients();
      setClients(response.data);
      setFilteredClients(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleContactStudent = async (client: Client, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the detail modal
    
    if (!currentUser) {
      try {
        await login();
        // After successful login, the user can click the button again to contact
      } catch (error) {
        console.error('Login failed:', error);
        alert('Failed to sign in. Please try again.');
      }
      return;
    }

    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const subject = encodeURIComponent(`Tutoring Opportunity - ${client.name}`);
    const body = encodeURIComponent(`Hello,

I'm interested in connecting with ${client.name} for tutoring services.

Student Details:
- Name: ${client.name}
- Subjects of interest: ${client.subjects.join(', ')}
- Budget: ${formatCurrency(client.budget)}/hr
- Description: ${client.description || 'No description provided'}

Please help me get in touch with this student to discuss:
- My availability for tutoring sessions
- My experience with their subjects of interest
- Preferred meeting format (in-person/online)
- Scheduling and session details

Thank you!

Best regards,
${userName}`);

    const mailtoLink = `mailto:jonathanschiff37@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={fetchClients} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Potential Students</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Connect with students who are looking for tutoring in your subject areas.</p>
        </div>

        {/* Education Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Browse by Education Level</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {educationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        {!loading && filteredClients && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredClients.length} of {clients.length} students
              {selectedCategory !== 'all' && (
                <span> for {educationCategories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
            </p>
          </div>
        )}

        {!filteredClients || filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              {selectedCategory === 'all' 
                ? 'No students available at the moment.' 
                : `No students found for ${educationCategories.find(cat => cat.id === selectedCategory)?.name}.`
              }
            </p>
            <div className="space-y-3">
              {selectedCategory !== 'all' && (
                <Button 
                  onClick={() => setSelectedCategory('all')} 
                  variant="outline" 
                  className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                >
                  View All Students
                </Button>
              )}
              <Button onClick={fetchClients} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700 cursor-pointer flex flex-col h-full" onClick={() => handleClientClick(client)}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-semibold">
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Looking for help with</h4>
                      <div className="flex flex-wrap gap-2">
                        {client.subjects.map((subject, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Budget</h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(client.budget)}/hr
                      </p>
                    </div>

                    {client.description && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {client.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2 mt-auto">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      size="sm" 
                      onClick={(e) => handleContactStudent(client, e)}
                    >
                      {currentUser ? 'Contact Student' : 'Sign in to Contact'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); handleClientClick(client); }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8 border border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to start tutoring?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              These students are actively looking for tutors. Reach out to them to start building meaningful learning relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Update My Profile
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                View All Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TutorDashboard; 