import React, { useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Building2, Heart, Send } from 'lucide-react';
import './FindJobs.css';

const FindJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Mock job data
  const jobCategories = [
    'all', 'Technology', 'Marketing', 'Sales', 'Design', 
    'Finance', 'HR', 'Healthcare', 'Education', 'Engineering'
  ];

  const salaryRanges = [
    'all', '0-30000', '30000-50000', '50000-80000', '80000+'
  ];

  const jobTypes = [
    'all', 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'
  ];

  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      location: 'Athens, Greece',
      salary: '€45,000 - €65,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for developing high-quality web applications.',
      requirements: ['3+ years React experience', 'TypeScript knowledge', 'Team player'],
      postedDate: '2 days ago',
      logo: '🏢'
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      company: 'CreativeMedia Inc',
      location: 'Thessaloniki, Greece',
      salary: '€35,000 - €45,000',
      type: 'Full-time',
      category: 'Marketing',
      description: 'Join our marketing team to drive digital campaigns and grow our online presence. Perfect opportunity for a creative marketer.',
      requirements: ['Google Ads certification', 'Social media expertise', 'Analytics skills'],
      postedDate: '1 week ago',
      logo: '🎨'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      location: 'Remote',
      salary: '€40,000 - €55,000',
      type: 'Remote',
      category: 'Design',
      description: 'Create exceptional user experiences for our clients. Work with cutting-edge design tools and collaborate with international teams.',
      requirements: ['Figma/Sketch proficiency', 'Portfolio required', 'User research experience'],
      postedDate: '3 days ago',
      logo: '✨'
    },
    {
      id: 4,
      title: 'Sales Representative',
      company: 'SalesForce Greece',
      location: 'Athens, Greece',
      salary: '€25,000 - €40,000 + Commission',
      type: 'Full-time',
      category: 'Sales',
      description: 'Drive revenue growth by building relationships with new clients. Excellent opportunity for career progression in sales.',
      requirements: ['Sales experience preferred', 'Excellent communication', 'Results-driven'],
      postedDate: '5 days ago',
      logo: '📈'
    },
    {
      id: 5,
      title: 'Python Backend Developer',
      company: 'DataFlow Systems',
      location: 'Athens, Greece',
      salary: '€50,000 - €70,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'Build scalable backend systems using Python and modern frameworks. Work on challenging data processing projects.',
      requirements: ['Python expertise', 'Django/FastAPI experience', 'Database knowledge'],
      postedDate: '1 day ago',
      logo: '⚡'
    }
  ];

  // Filter jobs based on search criteria
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationQuery === '' || 
      job.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    
    const matchesSalary = selectedSalary === 'all' || 
      (selectedSalary === '0-30000' && job.salary.includes('25,000')) ||
      (selectedSalary === '30000-50000' && (job.salary.includes('35,000') || job.salary.includes('40,000') || job.salary.includes('45,000'))) ||
      (selectedSalary === '50000-80000' && (job.salary.includes('50,000') || job.salary.includes('65,000') || job.salary.includes('70,000'))) ||
      (selectedSalary === '80000+' && job.salary.includes('80,000'));
    
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesSalary && matchesType;
  });

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleApplyJob = (jobId) => {
    alert(`Applied to job ${jobId}! You will be redirected to the application form.`);
  };

  return (
    <div className="findjobs-container">
      {/* Search Header */}
      <div className="findjobs-search-header">
        <div className="findjobs-search-title">
          <h2>Find Your Dream Job</h2>
          <p>Discover opportunities that match your skills and aspirations</p>
        </div>

        {/* Search Filters */}
        <div className="findjobs-search-filters">
          <div className="findjobs-search-row">
            <div className="findjobs-search-field">
              <Search className="findjobs-search-icon" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="findjobs-search-input"
              />
            </div>
            <div className="findjobs-search-field">
              <MapPin className="findjobs-search-icon" size={20} />
              <input
                type="text"
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="findjobs-search-input"
              />
            </div>
          </div>

          <div className="findjobs-filter-row">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="findjobs-select"
            >
              {jobCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select 
              value={selectedSalary} 
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="findjobs-select"
            >
              {salaryRanges.map(range => (
                <option key={range} value={range}>
                  {range === 'all' ? 'All Salaries' : 
                   range === '0-30000' ? '€0 - €30,000' :
                   range === '30000-50000' ? '€30,000 - €50,000' :
                   range === '50000-80000' ? '€50,000 - €80,000' :
                   '€80,000+'}
                </option>
              ))}
            </select>

            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="findjobs-select"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="findjobs-results-header">
        <h3>{filteredJobs.length} Jobs Found</h3>
        <div className="findjobs-sort">
          <span>Sort by:</span>
          <select className="findjobs-sort-select">
            <option>Most Recent</option>
            <option>Salary High to Low</option>
            <option>Salary Low to High</option>
            <option>Company A-Z</option>
          </select>
        </div>
      </div>

      {/* Job Results */}
      <div className="findjobs-results">
        {filteredJobs.length === 0 ? (
          <div className="findjobs-no-results">
            <Briefcase size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria to find more opportunities.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="findjobs-job-card">
              <div className="findjobs-job-header">
                <div className="findjobs-company-info">
                  <div className="findjobs-company-logo">{job.logo}</div>
                  <div>
                    <h4 className="findjobs-job-title">{job.title}</h4>
                    <p className="findjobs-company-name">{job.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSaveJob(job.id)}
                  className={`findjobs-save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                  title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                >
                  <Heart size={20} />
                </button>
              </div>

              <div className="findjobs-job-details">
                <div className="findjobs-job-meta">
                  <span className="findjobs-meta-item">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                  <span className="findjobs-meta-item">
                    <DollarSign size={16} />
                    {job.salary}
                  </span>
                  <span className="findjobs-meta-item">
                    <Briefcase size={16} />
                    {job.type}
                  </span>
                  <span className="findjobs-meta-item">
                    <Clock size={16} />
                    {job.postedDate}
                  </span>
                </div>

                <p className="findjobs-job-description">{job.description}</p>

                <div className="findjobs-requirements">
                  <strong>Requirements:</strong>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="findjobs-job-actions">
                <button 
                  onClick={() => handleApplyJob(job.id)}
                  className="findjobs-apply-btn"
                >
                  <Send size={18} />
                  Apply Now
                </button>
                <button className="findjobs-details-btn">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <div className="findjobs-pagination">
          <button className="findjobs-page-btn" disabled>Previous</button>
          <div className="findjobs-page-numbers">
            <button className="findjobs-page-btn active">1</button>
            <button className="findjobs-page-btn">2</button>
            <button className="findjobs-page-btn">3</button>
          </div>
          <button className="findjobs-page-btn">Next</button>
        </div>
      )}
    </div>
  );
};

export default FindJobs;