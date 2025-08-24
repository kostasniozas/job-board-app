import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Building2, 
  Send, 
  X, 
  Filter,
  Bookmark,
  Eye,
  Check,
  Calendar,
  Users,
  Award,
  Target
} from 'lucide-react';
import './SavedJobs.css';

const SavedJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_saved');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [jobToRemove, setJobToRemove] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock saved jobs data - using state so we can modify it
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      logo: 'TC',
      location: 'Athens, Greece',
      salary: '€45,000 - €65,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for developing high-quality web applications using modern frameworks.',
      requirements: ['3+ years React experience', 'TypeScript knowledge', 'Team player', 'Problem solving skills'],
      benefits: ['Health Insurance', 'Remote Work Options', 'Learning Budget', 'Flexible Hours'],
      postedDate: '2025-08-15',
      savedDate: '2025-08-16',
      urgency: 'apply_soon',
      // Enhanced details for modal
      fullDescription: 'Join our dynamic team as a Senior React Developer! We are building next-generation web applications that serve thousands of users daily. You will work with cutting-edge technologies including React 18, TypeScript, and modern state management solutions.',
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
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      logo: 'DS',
      location: 'Remote',
      salary: '€40,000 - €55,000',
      type: 'Remote',
      category: 'Design',
      description: 'Create exceptional user experiences for our clients. Work with cutting-edge design tools and collaborate with international teams.',
      requirements: ['Figma/Sketch proficiency', 'Portfolio required', 'User research experience', 'Attention to detail'],
      benefits: ['Flexible Hours', 'Creative Freedom', 'International Projects', 'Latest Design Tools'],
      postedDate: '2025-08-13',
      savedDate: '2025-08-14',
      urgency: 'good_match',
      fullDescription: 'Design beautiful and intuitive user interfaces for web and mobile applications. You will work with international clients and collaborate with developers to bring designs to life.',
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
      id: 3,
      title: 'Python Backend Developer',
      company: 'DataFlow Systems',
      logo: 'DF',
      location: 'Athens, Greece',
      salary: '€50,000 - €70,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'Build scalable backend systems using Python and modern frameworks. Work on challenging data processing projects with big data.',
      requirements: ['Python expertise', 'Django/FastAPI experience', 'Database knowledge', 'API design'],
      benefits: ['Stock Options', 'Training Programs', 'Modern Tech Stack', 'Career Growth'],
      postedDate: '2025-08-18',
      savedDate: '2025-08-18',
      urgency: 'apply_soon',
      fullDescription: 'Join our backend team to build robust, scalable systems that process millions of data points daily. You will work with modern Python frameworks, cloud technologies, and contribute to architecture decisions.',
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
      id: 4,
      title: 'Digital Marketing Manager',
      company: 'CreativeMedia Inc',
      logo: 'CM',
      location: 'Thessaloniki, Greece',
      salary: '€35,000 - €45,000',
      type: 'Full-time',
      category: 'Marketing',
      description: 'Join our marketing team to drive digital campaigns and grow our online presence. Perfect opportunity for a creative marketer.',
      requirements: ['Google Ads certification', 'Social media expertise', 'Analytics skills', 'Creative thinking'],
      benefits: ['Creative Environment', 'Campaign Bonuses', 'Professional Growth', 'Modern Office'],
      postedDate: '2025-08-10',
      savedDate: '2025-08-12',
      urgency: 'no_rush',
      fullDescription: 'Lead digital marketing initiatives for our growing creative agency. You will manage multi-channel campaigns, analyze performance metrics, and develop innovative marketing strategies.',
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
      id: 5,
      title: 'Financial Analyst',
      company: 'FinanceHub Greece',
      logo: 'FH',
      location: 'Athens, Greece',
      salary: '€38,000 - €52,000',
      type: 'Full-time',
      category: 'Finance',
      description: 'Analyze financial data and provide insights to support business decisions. Work with senior management team.',
      requirements: ['Finance degree', 'Excel proficiency', 'Analytical mindset', 'Communication skills'],
      benefits: ['Performance Bonus', 'Professional Certification', 'Career Development', 'Health Insurance'],
      postedDate: '2025-08-08',
      savedDate: '2025-08-10',
      urgency: 'good_match',
      fullDescription: 'Join our finance team to provide critical insights that drive business decisions. You will work with large datasets, create financial models, and present findings to senior leadership.',
      responsibilities: [
        'Analyze financial performance and create reports',
        'Develop financial models and forecasts',
        'Support budgeting and planning processes',
        'Identify trends and provide actionable insights',
        'Collaborate with various departments on financial analysis'
      ],
      companyInfo: {
        size: '100-200 employees',
        industry: 'Financial Services',
        founded: '2017',
        website: 'https://financehub.gr'
      },
      applicationDeadline: '2025-09-12',
      experienceLevel: 'Mid Level (2-4 years)'
    }
  ]);

  const categories = ['all', 'Technology', 'Design', 'Marketing', 'Finance', 'Sales', 'HR'];
  const sortOptions = [
    { value: 'date_saved', label: 'Recently Saved' },
    { value: 'date_posted', label: 'Recently Posted' },
    { value: 'salary_high', label: 'Salary: High to Low' },
    { value: 'salary_low', label: 'Salary: Low to High' },
    { value: 'company', label: 'Company A-Z' }
  ];

  // Filter and sort jobs
  const filteredJobs = savedJobs
    .filter(job => {
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_saved':
          return new Date(b.savedDate) - new Date(a.savedDate);
        case 'date_posted':
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
  const handleRemoveJob = (job) => {
    setJobToRemove(job);
    setShowRemoveModal(true);
  };

  const confirmRemoveJob = () => {
    if (jobToRemove) {
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobToRemove.id));
      setShowRemoveModal(false);
      setJobToRemove(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleConfirmApply = () => {
    console.log('Applied to:', selectedJob.title);
    setShowApplyModal(false);
    setSelectedJob(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getUrgencyConfig = (urgency) => {
    const configs = {
      apply_soon: { color: '#e74c3c', bg: '#fdedec', text: 'Apply Soon' },
      good_match: { color: '#f39c12', bg: '#fef9e7', text: 'Good Match' },
      no_rush: { color: '#27ae60', bg: '#eafaf1', text: 'No Rush' }
    };
    return configs[urgency] || configs.good_match;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateFull = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="savedjobs-container">
      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
        }}>
          <Check size={20} />
          {jobToRemove ? 'Job removed successfully!' : 'Application submitted!'}
        </div>
      )}

      {/* ✅ UPDATED: Header with gradient background like FindJobs */}
      <div className="savedjobs-header">
        <div className="savedjobs-hero">
          <h1>Saved Jobs</h1>
          <p>Manage your bookmarked opportunities and apply when you're ready</p>
        </div>

        <div className="savedjobs-search-section">
          {/* Search and Filter */}
          <div className="savedjobs-search-row">
            <div className="savedjobs-search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="savedjobs-search-input"
              />
            </div>
          </div>

          <div className="savedjobs-filters-row">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="savedjobs-filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="savedjobs-filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="savedjobs-results-header">
        <h2>{filteredJobs.length} Saved Jobs</h2>
        <div className="savedjobs-stats-inline">
          <span className="savedjobs-stat-item">
            <Clock size={16} />
            {filteredJobs.filter(job => job.urgency === 'apply_soon').length} Apply Soon
          </span>
          <span className="savedjobs-stat-item">
            <Building2 size={16} />
            {new Set(filteredJobs.map(job => job.company)).size} Companies
          </span>
        </div>
      </div>

      {/* Job List */}
      <div className="savedjobs-job-list">
        {filteredJobs.length === 0 ? (
          <div className="savedjobs-empty-state">
            <Heart size={48} />
            <h3>No saved jobs found</h3>
            <p>Start saving jobs you're interested in to see them here.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const urgencyConfig = getUrgencyConfig(job.urgency);
            
            return (
              <div key={job.id} className="savedjobs-job-card">
                <div className="savedjobs-card-header">
                  <div className="savedjobs-company-info">
                    <div className="savedjobs-company-logo">{job.logo}</div>
                    <div className="savedjobs-job-details">
                      <h3 className="savedjobs-job-title">{job.title}</h3>
                      <p className="savedjobs-company-name">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="savedjobs-actions-header">
                    <div 
                      className="savedjobs-urgency-badge"
                      style={{ backgroundColor: urgencyConfig.bg, color: urgencyConfig.color }}
                    >
                      {urgencyConfig.text}
                    </div>
                    <button 
                      onClick={() => handleRemoveJob(job)}
                      className="savedjobs-remove-btn"
                      title="Remove from saved"
                    >
                      <Heart 
                        size={20} 
                        fill="#e74c3c" 
                        color="#e74c3c" 
                      />
                    </button>
                  </div>
                </div>

                <div className="savedjobs-job-meta">
                  <span className="savedjobs-meta-item">
                    <MapPin size={14} />
                    {job.location}
                  </span>
                  <span className="savedjobs-meta-item">
                    <DollarSign size={14} />
                    {job.salary}
                  </span>
                  <span className="savedjobs-meta-item">
                    <Briefcase size={14} />
                    {job.type}
                  </span>
                  <span className="savedjobs-meta-item">
                    <Clock size={14} />
                    Saved {getDaysAgo(job.savedDate)}
                  </span>
                </div>

                <p className="savedjobs-job-description">{job.description}</p>

                <div className="savedjobs-requirements">
                  <strong>Requirements:</strong>
                  <div className="savedjobs-requirement-tags">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="savedjobs-requirement-tag">{req}</span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="savedjobs-requirement-more">+{job.requirements.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="savedjobs-benefits">
                  <strong>Benefits:</strong>
                  <div className="savedjobs-benefit-tags">
                    {job.benefits.map((benefit, index) => (
                      <span key={index} className="savedjobs-benefit-tag">{benefit}</span>
                    ))}
                  </div>
                </div>

                <div className="savedjobs-card-actions">
                  <button 
                    onClick={() => handleApply(job)}
                    className="savedjobs-apply-btn"
                  >
                    <Send size={16} />
                    Apply Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails(job)}
                    className="savedjobs-view-btn"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Apply Modal - Same structure as FindJobs */}
      {showApplyModal && selectedJob && (
        <div className="savedjobs-apply-modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="savedjobs-apply-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="savedjobs-apply-modal-header">
              <h3 className="savedjobs-apply-modal-title">Apply for Position</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="savedjobs-apply-modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="savedjobs-apply-modal-body">
              <div className="savedjobs-apply-modal-job-info">
                <h4 className="savedjobs-apply-modal-job-title">{selectedJob.title}</h4>
                <p className="savedjobs-apply-modal-job-details">{selectedJob.company}</p>
                <p className="savedjobs-apply-modal-job-details">{selectedJob.location} • {selectedJob.salary}</p>
              </div>
              
              <div className="savedjobs-apply-modal-info">
                <p className="savedjobs-apply-modal-info-text"><strong>Ready to apply?</strong></p>
                <p className="savedjobs-apply-modal-info-text">You'll be redirected to complete your application with your profile information.</p>
                <ul className="savedjobs-apply-modal-benefits-list">
                  <li className="savedjobs-apply-modal-benefit-item">✓ Your profile will be automatically filled</li>
                  <li className="savedjobs-apply-modal-benefit-item">✓ You can add a custom cover letter</li>
                  <li className="savedjobs-apply-modal-benefit-item">✓ Application will be sent directly to the employer</li>
                </ul>
              </div>
            </div>
            
            <div className="savedjobs-apply-modal-footer">
              <button 
                onClick={() => setShowApplyModal(false)}
                className="savedjobs-apply-modal-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmApply}
                className="savedjobs-apply-modal-confirm-btn"
              >
                Continue Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal - Same structure as FindJobs */}
      {showDetailsModal && selectedJob && (
        <div className="savedjobs-details-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="savedjobs-details-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="savedjobs-details-modal-header">
              <div className="savedjobs-details-header-info">
                <div className="savedjobs-details-company-logo">{selectedJob.logo}</div>
                <div>
                  <h2 className="savedjobs-details-job-title">{selectedJob.title}</h2>
                  <p className="savedjobs-details-company-name">{selectedJob.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="savedjobs-details-modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="savedjobs-details-modal-body">
              {/* Job Overview */}
              <div className="savedjobs-details-section">
                <div className="savedjobs-details-overview">
                  <div className="savedjobs-details-meta-grid">
                    <div className="savedjobs-details-meta-item">
                      <MapPin size={18} />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="savedjobs-details-meta-item">
                      <DollarSign size={18} />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="savedjobs-details-meta-item">
                      <Briefcase size={18} />
                      <span>{selectedJob.type}</span>
                    </div>
                    <div className="savedjobs-details-meta-item">
                      <Award size={18} />
                      <span>{selectedJob.experienceLevel}</span>
                    </div>
                    <div className="savedjobs-details-meta-item">
                      <Calendar size={18} />
                      <span>Posted {getDaysAgo(selectedJob.postedDate)}</span>
                    </div>
                    <div className="savedjobs-details-meta-item">
                      <Target size={18} />
                      <span>Apply by {formatDateFull(selectedJob.applicationDeadline)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="savedjobs-details-section">
                <h3>About This Role</h3>
                <p className="savedjobs-details-description">{selectedJob.fullDescription}</p>
              </div>

              {/* Responsibilities */}
              <div className="savedjobs-details-section">
                <h3>Key Responsibilities</h3>
                <ul className="savedjobs-details-list">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="savedjobs-details-section">
                <h3>Requirements</h3>
                <div className="savedjobs-details-tags">
                  {selectedJob.requirements.map((req, index) => (
                    <span key={index} className="savedjobs-details-requirement-tag">{req}</span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="savedjobs-details-section">
                <h3>What We Offer</h3>
                <div className="savedjobs-details-tags">
                  {selectedJob.benefits.map((benefit, index) => (
                    <span key={index} className="savedjobs-details-benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="savedjobs-details-section">
                <h3>About {selectedJob.company}</h3>
                <div className="savedjobs-details-company-grid">
                  <div className="savedjobs-details-company-item">
                    <Users size={16} />
                    <span>{selectedJob.companyInfo.size}</span>
                  </div>
                  <div className="savedjobs-details-company-item">
                    <Building2 size={16} />
                    <span>{selectedJob.companyInfo.industry}</span>
                  </div>
                  <div className="savedjobs-details-company-item">
                    <Calendar size={16} />
                    <span>Founded {selectedJob.companyInfo.founded}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="savedjobs-details-modal-footer">
              <button
                onClick={() => handleRemoveJob(selectedJob)}
                className="savedjobs-details-remove-btn"
              >
                <Heart size={18} fill="#e74c3c" color="#e74c3c" />
                Remove from Saved
              </button>
              <button 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleApply(selectedJob);
                }}
                className="savedjobs-details-apply-btn"
              >
                <Send size={18} />
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && jobToRemove && (
        <div className="savedjobs-remove-modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="savedjobs-remove-modal" onClick={(e) => e.stopPropagation()}>
            <div className="savedjobs-remove-modal-header">
              <h3>Remove Saved Job</h3>
              <button 
                onClick={() => setShowRemoveModal(false)}
                className="savedjobs-modal-close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="savedjobs-remove-modal-body">
              <p>Are you sure you want to remove this job from your saved jobs?</p>
              <div className="savedjobs-remove-job-info">
                <h4>{jobToRemove.jobTitle}</h4>
                <p>{jobToRemove.company}</p>
              </div>
              <p className="savedjobs-remove-warning">You can always save it again later if you change your mind.</p>
              
              <div className="savedjobs-remove-actions">
                <button 
                  onClick={() => setShowRemoveModal(false)}
                  className="savedjobs-remove-cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRemoveJob}
                  className="savedjobs-remove-confirm-btn"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;