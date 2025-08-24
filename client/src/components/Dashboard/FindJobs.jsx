// FindJobs.jsx - Updated με Job Details Modal

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Heart, 
  Building2, 
  Send,
  Eye,
  X,
  CheckCircle,
  Calendar,
  Users,
  Award,
  Target
} from 'lucide-react';
import './FindJobs.css';

function FindJobs({ userInfo }) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [savedJobs, setSavedJobs] = useState(new Set([2, 4])); // Mock saved jobs
  
  // Modal states - UNIQUE
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // NEW
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock job data (enhanced με περισσότερες λεπτομέρειες)
  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
     logo: 'TC',
      location: 'Athens, Greece',
      salary: '€45,000 - €65,000',
      type: 'Full-time',
      category: 'Technology',
      postedDate: '2025-08-20',
      description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for developing high-quality web applications using modern frameworks.',
      requirements: ['3+ years React experience', 'TypeScript knowledge', 'Team player', 'Problem solving skills'],
      benefits: ['Health Insurance', 'Remote Work Options', 'Learning Budget', 'Flexible Hours'],
      // NEW: Enhanced details
      fullDescription: 'Join our dynamic team as a Senior React Developer! We are building next-generation web applications that serve thousands of users daily. You will work with cutting-edge technologies including React 18, TypeScript, and modern state management solutions. Our development team follows agile methodologies and emphasizes clean code, testing, and continuous integration.',
      responsibilities: [
        'Develop and maintain React-based web applications',
        'Collaborate with UX/UI designers to implement responsive designs',
        'Write clean, maintainable, and well-tested code',
        'Participate in code reviews and technical discussions',
        'Mentor junior developers and share knowledge'
      ],
      companyInfo: {
        size: '50-100 employees',
        industry: 'Technology',
        founded: '2018',
        website: 'https://techcorp.com'
      },
      applicationDeadline: '2025-09-15',
      experienceLevel: 'Senior Level (5+ years)'
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      company: 'CreativeMedia Inc',
    logo: 'CM',
      location: 'Thessaloniki, Greece',
      salary: '€35,000 - €45,000',
      type: 'Full-time',
      category: 'Marketing',
      postedDate: '2025-08-18',
      description: 'Join our marketing team to drive digital campaigns and grow our online presence. Perfect opportunity for a creative marketer.',
      requirements: ['Google Ads certification', 'Social media expertise', 'Analytics skills', 'Creative thinking'],
      benefits: ['Creative Environment', 'Campaign Bonuses', 'Professional Growth', 'Modern Office'],
      fullDescription: 'Lead digital marketing initiatives for our growing creative agency. You will manage multi-channel campaigns, analyze performance metrics, and develop innovative marketing strategies. Work with a passionate team of creatives and strategists to deliver exceptional results for our clients.',
      responsibilities: [
        'Develop and execute digital marketing campaigns',
        'Manage social media presence across multiple platforms',
        'Analyze campaign performance and optimize for ROI',
        'Collaborate with creative team on content development',
        'Stay updated with latest marketing trends and tools'
      ],
      companyInfo: {
        size: '20-50 employees',
        industry: 'Marketing & Advertising',
        founded: '2020',
        website: 'https://creativemedia.gr'
      },
      applicationDeadline: '2025-09-10',
      experienceLevel: 'Mid Level (3-5 years)'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
     logo: 'DS',
      location: 'Remote',
      salary: '€40,000 - €55,000',
      type: 'Remote',
      category: 'Design',
      postedDate: '2025-08-19',
      description: 'Create exceptional user experiences for our clients. Work with cutting-edge design tools and collaborate with international teams.',
      requirements: ['Figma/Sketch proficiency', 'Portfolio required', 'User research experience', 'Attention to detail'],
      benefits: ['Flexible Hours', 'Creative Freedom', 'International Projects', 'Latest Design Tools'],
      fullDescription: 'Design beautiful and intuitive user interfaces for web and mobile applications. You will work with international clients and collaborate with developers to bring designs to life. We value creativity, user-centered design, and continuous learning.',
      responsibilities: [
        'Create wireframes, prototypes, and high-fidelity designs',
        'Conduct user research and usability testing',
        'Collaborate with developers to ensure design implementation',
        'Maintain and evolve design systems',
        'Present design concepts to clients and stakeholders'
      ],
      companyInfo: {
        size: '10-20 employees',
        industry: 'Design & Creative',
        founded: '2019',
        website: 'https://designstudiopro.com'
      },
      applicationDeadline: '2025-09-20',
      experienceLevel: 'Mid Level (2-4 years)'
    },
    {
      id: 4,
      title: 'Python Backend Developer',
      company: 'DataFlow Systems',
     logo: 'DF',
      location: 'Athens, Greece',
      salary: '€50,000 - €70,000',
      type: 'Full-time',
      category: 'Technology',
      postedDate: '2025-08-21',
      description: 'Build scalable backend systems using Python and modern frameworks. Work on challenging data processing projects with big data.',
      requirements: ['Python expertise', 'Django/FastAPI experience', 'Database knowledge', 'API design'],
      benefits: ['Stock Options', 'Training Programs', 'Modern Tech Stack', 'Career Growth'],
      fullDescription: 'Join our backend team to build robust, scalable systems that process millions of data points daily. You will work with modern Python frameworks, cloud technologies, and contribute to architecture decisions that impact our platform\'s future.',
      responsibilities: [
        'Design and implement RESTful APIs',
        'Optimize database queries and performance',
        'Implement data processing pipelines',
        'Ensure code quality through testing and reviews',
        'Collaborate with frontend teams and DevOps'
      ],
      companyInfo: {
        size: '100-200 employees',
        industry: 'Data & Analytics',
        founded: '2016',
        website: 'https://dataflow.com'
      },
      applicationDeadline: '2025-09-25',
      experienceLevel: 'Senior Level (5+ years)'
    },
    {
      id: 5,
      title: 'Sales Representative',
      company: 'SalesForce Greece',
    logo: 'SF',
      location: 'Athens, Greece',
      salary: '€25,000 - €40,000 + Commission',
      type: 'Full-time',
      category: 'Sales',
      postedDate: '2025-08-17',
      description: 'Drive revenue growth by building relationships with new clients. Excellent opportunity for ambitious sales professionals.',
      requirements: ['Sales experience', 'Communication skills', 'Goal-oriented', 'Client relationship management'],
      benefits: ['High Commission', 'Sales Training', 'Career Advancement', 'Company Car'],
      fullDescription: 'Accelerate your sales career with Greece\'s leading sales organization. You will manage a portfolio of enterprise clients, develop new business opportunities, and exceed revenue targets while building long-term relationships.',
      responsibilities: [
        'Generate new business through prospecting and networking',
        'Manage and grow existing client relationships',
        'Present product demonstrations and proposals',
        'Negotiate contracts and close deals',
        'Collaborate with marketing team on lead generation'
      ],
      companyInfo: {
        size: '200+ employees',
        industry: 'Sales & Business Development',
        founded: '2015',
        website: 'https://salesforce.gr'
      },
      applicationDeadline: '2025-09-05',
      experienceLevel: 'Entry to Mid Level (1-3 years)'
    }
  ];

  // Filter and sort jobs (same as before)
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === '' || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    
    const matchesSalary = salaryFilter === 'all' || 
      (salaryFilter === 'entry' && parseInt(job.salary.split(' - ')[0].replace(/[^\d]/g, '')) < 35000) ||
      (salaryFilter === 'mid' && parseInt(job.salary.split(' - ')[0].replace(/[^\d]/g, '')) >= 35000 && parseInt(job.salary.split(' - ')[0].replace(/[^\d]/g, '')) < 55000) ||
      (salaryFilter === 'senior' && parseInt(job.salary.split(' - ')[0].replace(/[^\d]/g, '')) >= 55000);
    
    const matchesType = jobTypeFilter === 'all' || 
      job.type.toLowerCase() === jobTypeFilter.toLowerCase();
    
    return matchesSearch && matchesLocation && matchesCategory && matchesSalary && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'salary_high':
        return parseInt(b.salary.split(' - ')[1].replace(/[^\d]/g, '')) - 
               parseInt(a.salary.split(' - ')[1].replace(/[^\d]/g, ''));
      case 'salary_low':
        return parseInt(a.salary.split(' - ')[0].replace(/[^\d]/g, '')) - 
               parseInt(b.salary.split(' - ')[0].replace(/[^\d]/g, ''));
      case 'company':
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  // Handle functions
  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // NEW: Handle view details
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleConfirmApply = () => {
    console.log('Applied to:', selectedJob.title);
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const formatDateFull = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="findjobs-container">
      {/* Header - Same as before */}
      <div className="findjobs-header">
        <div className="findjobs-hero">
          <h1>Find Your Dream Job</h1>
          <p>Discover opportunities that match your skills and aspirations</p>
        </div>

        <div className="findjobs-search-section">
          <div className="findjobs-search-row">
            <div className="findjobs-search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="findjobs-search-input"
              />
            </div>
            
            <div className="findjobs-location-box">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="findjobs-location-input"
              />
            </div>
          </div>

          <div className="findjobs-filters-row">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="findjobs-filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
              className="findjobs-filter-select"
            >
              <option value="all">All Salaries</option>
              <option value="entry">€20k - €35k (Entry)</option>
              <option value="mid">€35k - €55k (Mid)</option>
              <option value="senior">€55k+ (Senior)</option>
            </select>

            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="findjobs-filter-select"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header - Same as before */}
      <div className="findjobs-results-header">
        <h2>{sortedJobs.length} Jobs Found</h2>
        <div className="findjobs-sort">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="findjobs-sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="salary_high">Salary: High to Low</option>
            <option value="salary_low">Salary: Low to High</option>
            <option value="company">Company A-Z</option>
          </select>
        </div>
      </div>

      {/* Job List - Same structure */}
      <div className="findjobs-job-list">
        {sortedJobs.length === 0 ? (
          <div className="findjobs-empty-state">
            <Search size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or browse all available positions.</p>
          </div>
        ) : (
          sortedJobs.map(job => (
            <div key={job.id} className="findjobs-job-card">
              <div className="findjobs-card-header">
                <div className="findjobs-company-info">
                  <div className="findjobs-company-logo">{job.logo}</div>
                  <div className="findjobs-job-details">
                    <h3 className="findjobs-job-title">{job.title}</h3>
                    <p className="findjobs-company-name">{job.company}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className={`findjobs-save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                  title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                >
                  <Heart 
                    size={20} 
                    fill={savedJobs.has(job.id) ? '#e74c3c' : 'none'} 
                    color={savedJobs.has(job.id) ? '#e74c3c' : '#7A85C1'} 
                  />
                </button>
              </div>

              <div className="findjobs-job-meta">
                <span className="findjobs-meta-item">
                  <MapPin size={14} />
                  {job.location}
                </span>
                <span className="findjobs-meta-item">
                  <DollarSign size={14} />
                  {job.salary}
                </span>
                <span className="findjobs-meta-item">
                  <Briefcase size={14} />
                  {job.type}
                </span>
                <span className="findjobs-meta-item">
                  <Clock size={14} />
                  {formatDate(job.postedDate)}
                </span>
              </div>

              <p className="findjobs-job-description">{job.description}</p>

              <div className="findjobs-requirements">
                <strong>Requirements:</strong>
                <div className="findjobs-requirement-tags">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <span key={index} className="findjobs-requirement-tag">{req}</span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="findjobs-requirement-more">+{job.requirements.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="findjobs-benefits">
                <strong>Benefits:</strong>
                <div className="findjobs-benefit-tags">
                  {job.benefits.map((benefit, index) => (
                    <span key={index} className="findjobs-benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>

              <div className="findjobs-card-actions">
                <button 
                  onClick={() => handleApply(job)}
                  className="findjobs-apply-btn"
                >
                  <Send size={16} />
                  Apply Now
                </button>
                {/* ✅ UPDATED: View Details button */}
                <button 
                  onClick={() => handleViewDetails(job)}
                  className="findjobs-view-btn"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal - Same as before */}
      {showApplyModal && selectedJob && (
        <div className="findjobs-apply-modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="findjobs-apply-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="findjobs-apply-modal-header">
              <h3 className="findjobs-apply-modal-title">Apply for Position</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="findjobs-apply-modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="findjobs-apply-modal-body">
              <div className="findjobs-apply-modal-job-info">
                <h4 className="findjobs-apply-modal-job-title">{selectedJob.title}</h4>
                <p className="findjobs-apply-modal-job-details">{selectedJob.company}</p>
                <p className="findjobs-apply-modal-job-details">{selectedJob.location} • {selectedJob.salary}</p>
              </div>
              
              <div className="findjobs-apply-modal-info">
                <p className="findjobs-apply-modal-info-text"><strong>Ready to apply?</strong></p>
                <p className="findjobs-apply-modal-info-text">You'll be redirected to complete your application with your profile information.</p>
                <ul className="findjobs-apply-modal-benefits-list">
                  <li className="findjobs-apply-modal-benefit-item">✓ Your profile will be automatically filled</li>
                  <li className="findjobs-apply-modal-benefit-item">✓ You can add a custom cover letter</li>
                  <li className="findjobs-apply-modal-benefit-item">✓ Application will be sent directly to the employer</li>
                </ul>
              </div>
            </div>
            
            <div className="findjobs-apply-modal-footer">
              <button 
                onClick={() => setShowApplyModal(false)}
                className="findjobs-apply-modal-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmApply}
                className="findjobs-apply-modal-confirm-btn"
              >
                Continue Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="findjobs-details-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="findjobs-details-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="findjobs-details-modal-header">
              <div className="findjobs-details-header-info">
                <div className="findjobs-details-company-logo">{selectedJob.logo}</div>
                <div>
                  <h2 className="findjobs-details-job-title">{selectedJob.title}</h2>
                  <p className="findjobs-details-company-name">{selectedJob.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="findjobs-details-modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="findjobs-details-modal-body">
              {/* Job Overview */}
              <div className="findjobs-details-section">
                <div className="findjobs-details-overview">
                  <div className="findjobs-details-meta-grid">
                    <div className="findjobs-details-meta-item">
                      <MapPin size={18} />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="findjobs-details-meta-item">
                      <DollarSign size={18} />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="findjobs-details-meta-item">
                      <Briefcase size={18} />
                      <span>{selectedJob.type}</span>
                    </div>
                    <div className="findjobs-details-meta-item">
                      <Award size={18} />
                      <span>{selectedJob.experienceLevel}</span>
                    </div>
                    <div className="findjobs-details-meta-item">
                      <Calendar size={18} />
                      <span>Posted {formatDate(selectedJob.postedDate)}</span>
                    </div>
                    <div className="findjobs-details-meta-item">
                      <Target size={18} />
                      <span>Apply by {formatDateFull(selectedJob.applicationDeadline)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="findjobs-details-section">
                <h3>About This Role</h3>
                <p className="findjobs-details-description">{selectedJob.fullDescription}</p>
              </div>

              {/* Responsibilities */}
              <div className="findjobs-details-section">
                <h3>Key Responsibilities</h3>
                <ul className="findjobs-details-list">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="findjobs-details-section">
                <h3>Requirements</h3>
                <div className="findjobs-details-tags">
                  {selectedJob.requirements.map((req, index) => (
                    <span key={index} className="findjobs-details-requirement-tag">{req}</span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="findjobs-details-section">
                <h3>What We Offer</h3>
                <div className="findjobs-details-tags">
                  {selectedJob.benefits.map((benefit, index) => (
                    <span key={index} className="findjobs-details-benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="findjobs-details-section">
                <h3>About {selectedJob.company}</h3>
                <div className="findjobs-details-company-grid">
                  <div className="findjobs-details-company-item">
                    <Users size={16} />
                    <span>{selectedJob.companyInfo.size}</span>
                  </div>
                  <div className="findjobs-details-company-item">
                    <Building2 size={16} />
                    <span>{selectedJob.companyInfo.industry}</span>
                  </div>
                  <div className="findjobs-details-company-item">
                    <Calendar size={16} />
                    <span>Founded {selectedJob.companyInfo.founded}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="findjobs-details-modal-footer">
              <button
                onClick={() => handleSaveJob(selectedJob.id)}
                className={`findjobs-details-save-btn ${savedJobs.has(selectedJob.id) ? 'saved' : ''}`}
              >
                <Heart 
                  size={18} 
                  fill={savedJobs.has(selectedJob.id) ? '#e74c3c' : 'none'} 
                  color={savedJobs.has(selectedJob.id) ? '#e74c3c' : '#7A85C1'} 
                />
                {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save Job'}
              </button>
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleApply(selectedJob);
                }}
                className="findjobs-details-apply-btn"
              >
                <Send size={18} />
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindJobs;