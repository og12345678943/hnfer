'use client';

import { useState } from 'react';
import { withAuth } from '../utils/protectedRoute';
import { 
  Briefcase, MapPin, Clock, DollarSign, Search, 
  Filter, Building, Users, Star, ExternalLink 
} from 'lucide-react';

function Jobs({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  
  // Mock job data - in real app, this would come from an API
  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 days ago',
      description: 'We are looking for a Senior Frontend Developer to join our growing team...',
      requirements: ['React', 'TypeScript', 'Node.js'],
      applicants: 45,
      featured: true
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '1 week ago',
      description: 'Join our product team to drive innovation and growth...',
      requirements: ['Product Strategy', 'Analytics', 'Leadership'],
      applicants: 23,
      featured: false
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80k - $100k',
      posted: '3 days ago',
      description: 'Create beautiful and intuitive user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      applicants: 67,
      featured: false
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$110k - $150k',
      posted: '5 days ago',
      description: 'Help us scale our infrastructure and improve deployment processes...',
      requirements: ['AWS', 'Docker', 'Kubernetes'],
      applicants: 34,
      featured: true
    }
  ]);

  const jobTypes = [
    { id: 'all', label: 'All Jobs' },
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    { id: 'remote', label: 'Remote' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = jobTypeFilter === 'all' || 
                       job.type.toLowerCase().includes(jobTypeFilter.toLowerCase()) ||
                       (jobTypeFilter === 'remote' && job.location.toLowerCase().includes('remote'));
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover opportunities that match your skills and aspirations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Job Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title or company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {jobTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
              job.featured 
                ? 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900/50' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    {job.featured && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                    {job.salary}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Posted {job.posted}
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{job.applicants} applicants</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Save Job
                  </button>
                  <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or check back later for new opportunities
          </p>
        </div>
      )}
    </div>
  );
}

export default withAuth(Jobs);