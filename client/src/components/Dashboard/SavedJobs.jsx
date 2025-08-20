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
  Bookmark
} from 'lucide-react';
import './SavedJobs.css';

const SavedJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_saved');
  const [savedJobs, setSavedJobs] = useState(new Set([1, 2, 3, 4, 5])); // Track which jobs are saved

  // Mock saved jobs data
  const mockSavedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      logo: '🏢',
      location: 'Athens, Greece',
      salary: '€45,000 - €65,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for developing high-quality web applications using modern frameworks.',
      requirements: ['3+ years React experience', 'TypeScript knowledge', 'Team player'],
      postedDate: '2025-08-15',
      savedDate: '2025-08-16',
      urgency: 'high',
      benefits: ['Health Insurance', 'Remote Work', 'Learning Budget']
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      logo: '✨',
      location: 'Remote',
      salary: '€40,000 - €55,000',
      type: 'Remote',
      category: 'Design',
      description: 'Create exceptional user experiences for our clients. Work with cutting-edge design tools and collaborate with international teams.',
      requirements: ['Figma/Sketch proficiency', 'Portfolio required', 'User research experience'],
      postedDate: '2025-08-13',
      savedDate: '2025-08-14',
      urgency: 'medium',
      benefits: ['Flexible Hours', 'Creative Freedom', 'International Projects']
    },
    {
      id: 3,
      title: 'Python Backend Developer',
      company: 'DataFlow Systems',
      logo: '⚡',
      location: 'Athens, Greece',
      salary: '€50,000 - €70,000',
      type: 'Full-time',
      category: 'Technology',
      description: 'Build scalable backend systems using Python and modern frameworks. Work on challenging data processing projects with big data.',
      requirements: ['Python expertise', 'Django/FastAPI experience', 'Database knowledge'],
      postedDate: '2025-08-18',
      savedDate: '2025-08-18',
      urgency: 'high',
      benefits: ['Stock Options', 'Training Programs', 'Modern Tech Stack']
    },
    {
      id: 4,
      title: 'Digital Marketing Manager',
      company: 'CreativeMedia Inc',
      logo: '🎨',
      location: 'Thessaloniki, Greece',
      salary: '€35,000 - €45,000',
      type: 'Full-time',
      category: 'Marketing',
      description: 'Join our marketing team to drive digital campaigns and grow our online presence. Perfect opportunity for a creative marketer.',
      requirements: ['Google Ads certification', 'Social media expertise', 'Analytics skills'],
      postedDate: '2025-08-10',
      savedDate: '2025-08-12',
      urgency: 'low',
      benefits: ['Creative Environment', 'Campaign Bonuses', 'Professional Growth']
    },
    {
      id: 5,
      title: 'Financial Analyst',
      company: 'FinanceHub Greece',
      logo: '💼',
      location: 'Athens, Greece',
      salary: '€38,000 - €52,000',
      type: 'Full-time',
      category: 'Finance',
      description: 'Analyze financial data and provide insights to support business decisions. Work with senior management team.',
      requirements: ['Finance degree', 'Excel proficiency', 'Analytical mindset'],
      postedDate: '2025-08-08',
      savedDate: '2025-08-10',
      urgency: 'medium',
      benefits: ['Performance Bonus', 'Professional Certification', 'Career Development']
    }
  ];

  const categories = ['all', 'Technology', 'Design', 'Marketing', 'Finance', 'Sales', 'HR'];
  const sortOptions = [
    { value: 'date_saved', label: 'Recently Saved' },
    { value: 'date_posted', label: 'Recently Posted' },
    { value: 'salary_high', label: 'Salary: High to Low' },
    { value: 'salary_low', label: 'Salary: Low to High' },
    { value: 'company', label: 'Company A-Z' }
  ];

  // Filter and sort jobs
  const filteredJobs = mockSavedJobs
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

  const handleUnsaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    newSavedJobs.delete(jobId);
    setSavedJobs(newSavedJobs);
  };

  const handleApplyJob = (jobId) => {
    alert(`Applied to job ${jobId}! You will be redirected to the application form.`);
  };

  const getUrgencyConfig = (urgency) => {
    const configs = {
      high: { color: '#e74c3c', bg: '#fdedec', text: 'Apply Soon' },
      medium: { color: '#f39c12', bg: '#fef9e7', text: 'Good Match' },
      low: { color: '#27ae60', bg: '#eafaf1', text: 'No Rush' }
    };
    return configs[urgency] || configs.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
      {/* Header */}
      <div className="savedjobs-header">
        <div className="savedjobs-title">
          <h2>Saved Jobs</h2>
          <p>Manage your bookmarked job opportunities ({filteredJobs.length} saved)</p>
        </div>

        {/* Controls */}
        <div className="savedjobs-controls">
          <div className="savedjobs-search">
            <Search className="savedjobs-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="savedjobs-search-input"
            />
          </div>

          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="savedjobs-select"
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
            className="savedjobs-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="savedjobs-stats">
        <div className="savedjobs-stat-item">
          <Bookmark className="savedjobs-stat-icon" size={20} />
          <div>
            <span className="savedjobs-stat-number">{filteredJobs.length}</span>
            <span className="savedjobs-stat-label">Saved Jobs</span>
          </div>
        </div>
        <div className="savedjobs-stat-item">
          <Clock className="savedjobs-stat-icon" size={20} />
          <div>
            <span className="savedjobs-stat-number">
              {filteredJobs.filter(job => job.urgency === 'high').length}
            </span>
            <span className="savedjobs-stat-label">Apply Soon</span>
          </div>
        </div>
        <div className="savedjobs-stat-item">
          <Building2 className="savedjobs-stat-icon" size={20} />
          <div>
            <span className="savedjobs-stat-number">
              {new Set(filteredJobs.map(job => job.company)).size}
            </span>
            <span className="savedjobs-stat-label">Companies</span>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="savedjobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="savedjobs-empty">
            <Heart size={48} />
            <h3>No saved jobs found</h3>
            <p>Start saving jobs you're interested in to see them here.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const urgencyConfig = getUrgencyConfig(job.urgency);
            
            return (
              <div key={job.id} className="savedjobs-card">
                {/* Card Header */}
                <div className="savedjobs-card-header">
                  <div className="savedjobs-company-info">
                    <div className="savedjobs-company-logo">{job.logo}</div>
                    <div>
                      <h4 className="savedjobs-job-title">{job.title}</h4>
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
                      onClick={() => handleUnsaveJob(job.id)}
                      className="savedjobs-unsave-btn"
                      title="Remove from saved"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Job Meta */}
                <div className="savedjobs-meta">
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
                </div>

                {/* Description */}
                <p className="savedjobs-description">{job.description}</p>

                {/* Requirements */}
                <div className="savedjobs-requirements">
                  <strong>Key Requirements:</strong>
                  <div className="savedjobs-requirement-tags">
                    {job.requirements.slice(0, 2).map((req, index) => (
                      <span key={index} className="savedjobs-requirement-tag">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 2 && (
                      <span className="savedjobs-requirement-more">
                        +{job.requirements.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="savedjobs-benefits">
                  <strong>Benefits:</strong>
                  <div className="savedjobs-benefit-tags">
                    {job.benefits.map((benefit, index) => (
                      <span key={index} className="savedjobs-benefit-tag">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="savedjobs-card-footer">
                  <div className="savedjobs-dates">
                    <span>Posted {getDaysAgo(job.postedDate)}</span>
                    <span>Saved {formatDate(job.savedDate)}</span>
                  </div>
                  
                  <div className="savedjobs-actions">
                    <button 
                      onClick={() => handleApplyJob(job.id)}
                      className="savedjobs-apply-btn"
                    >
                      <Send size={16} />
                      Apply Now
                    </button>
                    <button className="savedjobs-view-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bulk Actions */}
      {filteredJobs.length > 0 && (
        <div className="savedjobs-bulk-actions">
          <button className="savedjobs-bulk-btn primary">
            Apply to Selected Jobs
          </button>
          <button className="savedjobs-bulk-btn secondary">
            Remove All Saved
          </button>
          <button className="savedjobs-bulk-btn secondary">
            Export List
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;