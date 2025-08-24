import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Github,
  Linkedin,
  FileText,
  Save,
  X,
  Plus,
  Edit3,
  Check
} from 'lucide-react';
import './JobSeekerEditProfile.css';

const JobSeekerEditProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+30 69 1234 5678',
    location: 'Athens, Greece',
    dateOfBirth: '1990-05-15',
    bio: 'Passionate full-stack developer with 5+ years of experience in React, Node.js, and modern web technologies.',
    
    // Professional Information
    currentTitle: 'Senior React Developer',
    experienceLevel: 'senior',
    expectedSalary: '45000-65000',
    availability: 'immediately',
    workType: ['full-time', 'remote'],
    
    // Skills & Expertise
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    languages: [
      { name: 'Greek', level: 'native' },
      { name: 'English', level: 'fluent' },
      { name: 'German', level: 'intermediate' }
    ],
    
    // Experience
    experience: [
      {
        id: 1,
        title: 'Senior React Developer',
        company: 'TechCorp Solutions',
        startDate: '2022-01',
        endDate: 'present',
        description: 'Led frontend development team, implemented modern React patterns, improved performance by 40%.',
        technologies: ['React', 'TypeScript', 'Redux', 'AWS']
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        startDate: '2020-03',
        endDate: '2021-12',
        description: 'Built scalable web applications from scratch, managed both frontend and backend development.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Docker']
      }
    ],
    
    // Education
    education: [
      {
        id: 1,
        degree: 'Master of Science in Computer Science',
        institution: 'University of Athens',
        startDate: '2018',
        endDate: '2020',
        grade: '8.5/10',
        description: 'Specialized in Software Engineering and Artificial Intelligence.'
      },
      {
        id: 2,
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Patras',
        startDate: '2014',
        endDate: '2018',
        grade: '8.2/10',
        description: 'Strong foundation in programming, algorithms, and software development.'
      }
    ],
    
    // Certifications
    certifications: [
      {
        id: 1,
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-06',
        credentialId: 'AWS-DEV-2023-001'
      },
      {
        id: 2,
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2022-09',
        credentialId: 'META-REACT-2022'
      }
    ],
    
    // Links & Portfolio
    portfolio: 'https://johndoe.dev',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    personalWebsite: 'https://johndoe.com'
  });

  const [newSkill, setNewSkill] = useState('');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'portfolio', label: 'Portfolio & Links', icon: Globe }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: []
    };
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (id) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleSave = () => {
    console.log('Updated profile data:', profileData);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const renderPersonalTab = () => (
    <div className="jseditprofile-tab-content">
      <div className="jseditprofile-section">
        <h3>Basic Information</h3>
        <div className="jseditprofile-form-grid">
          <div className="jseditprofile-form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
        </div>
      </div>

      <div className="jseditprofile-section">
        <h3>Professional Bio</h3>
        <div className="jseditprofile-form-group">
          <label>About Me</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="jseditprofile-textarea"
            rows="4"
            placeholder="Tell employers about yourself, your experience, and what you're looking for..."
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalTab = () => (
    <div className="jseditprofile-tab-content">
      <div className="jseditprofile-section">
        <h3>Current Status</h3>
        <div className="jseditprofile-form-grid">
          <div className="jseditprofile-form-group">
            <label>Current Title</label>
            <input
              type="text"
              value={profileData.currentTitle}
              onChange={(e) => handleInputChange('currentTitle', e.target.value)}
              className="jseditprofile-input"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Experience Level</label>
            <select
              value={profileData.experienceLevel}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className="jseditprofile-select"
            >
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
              <option value="lead">Lead/Principal (8+ years)</option>
            </select>
          </div>
          <div className="jseditprofile-form-group">
            <label>Expected Salary (EUR/year)</label>
            <select
              value={profileData.expectedSalary}
              onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
              className="jseditprofile-select"
            >
              <option value="20000-30000">€20,000 - €30,000</option>
              <option value="30000-45000">€30,000 - €45,000</option>
              <option value="45000-65000">€45,000 - €65,000</option>
              <option value="65000-85000">€65,000 - €85,000</option>
              <option value="85000+">€85,000+</option>
            </select>
          </div>
          <div className="jseditprofile-form-group">
            <label>Availability</label>
            <select
              value={profileData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="jseditprofile-select"
            >
              <option value="immediately">Immediately</option>
              <option value="2weeks">2 weeks notice</option>
              <option value="1month">1 month notice</option>
              <option value="3months">3+ months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jseditprofile-section">
        <h3>Skills & Technologies</h3>
        <div className="jseditprofile-skills-container">
          <div className="jseditprofile-skills-list">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="jseditprofile-skill-tag">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="jseditprofile-skill-remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="jseditprofile-skill-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="jseditprofile-input"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button onClick={addSkill} className="jseditprofile-add-btn">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="jseditprofile-section">
        <h3>Languages</h3>
        {profileData.languages.map((lang, index) => (
          <div key={index} className="jseditprofile-language-item">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => handleArrayInputChange('languages', index, { ...lang, name: e.target.value })}
              className="jseditprofile-input"
              placeholder="Language"
            />
            <select
              value={lang.level}
              onChange={(e) => handleArrayInputChange('languages', index, { ...lang, level: e.target.value })}
              className="jseditprofile-select"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="fluent">Fluent</option>
              <option value="native">Native</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperienceTab = () => (
    <div className="jseditprofile-tab-content">
      <div className="jseditprofile-section">
        <div className="jseditprofile-section-header">
          <h3>Work Experience</h3>
          <button onClick={addExperience} className="jseditprofile-add-btn">
            <Plus size={16} />
            Add Experience
          </button>
        </div>
        
        {profileData.experience.map((exp, index) => (
          <div key={exp.id} className="jseditprofile-experience-item">
            <div className="jseditprofile-experience-header">
              <h4>Experience #{index + 1}</h4>
              <button
                onClick={() => removeExperience(exp.id)}
                className="jseditprofile-remove-btn"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="jseditprofile-form-grid">
              <div className="jseditprofile-form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  className="jseditprofile-input"
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="jseditprofile-input"
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Start Date</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="jseditprofile-input"
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>End Date</label>
                <input
                  type="month"
                  value={exp.endDate === 'present' ? '' : exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value || 'present')}
                  className="jseditprofile-input"
                />
              </div>
            </div>
            
            <div className="jseditprofile-form-group">
              <label>Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                className="jseditprofile-textarea"
                rows="3"
                placeholder="Describe your role, achievements, and responsibilities..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducationTab = () => (
    <div className="jseditprofile-tab-content">
      <div className="jseditprofile-section">
        <h3>Education & Certifications</h3>
        
        <h4>Education</h4>
        {profileData.education.map((edu, index) => (
          <div key={edu.id} className="jseditprofile-education-item">
            <div className="jseditprofile-form-grid">
              <div className="jseditprofile-form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Start Year</label>
                <input
                  type="text"
                  value={edu.startDate}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>End Year</label>
                <input
                  type="text"
                  value={edu.endDate}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}

        <h4>Certifications</h4>
        {profileData.certifications.map((cert, index) => (
          <div key={cert.id} className="jseditprofile-certification-item">
            <div className="jseditprofile-form-grid">
              <div className="jseditprofile-form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Issuer</label>
                <input
                  type="text"
                  value={cert.issuer}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Date Earned</label>
                <input
                  type="text"
                  value={cert.date}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
              <div className="jseditprofile-form-group">
                <label>Credential ID</label>
                <input
                  type="text"
                  value={cert.credentialId}
                  className="jseditprofile-input"
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="jseditprofile-tab-content">
      <div className="jseditprofile-section">
        <h3>Portfolio & Social Links</h3>
        <div className="jseditprofile-form-grid">
          <div className="jseditprofile-form-group">
            <label>Portfolio Website</label>
            <input
              type="url"
              value={profileData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              className="jseditprofile-input"
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>GitHub Profile</label>
            <input
              type="url"
              value={profileData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              className="jseditprofile-input"
              placeholder="https://github.com/username"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="jseditprofile-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="jseditprofile-form-group">
            <label>Personal Website</label>
            <input
              type="url"
              value={profileData.personalWebsite}
              onChange={(e) => handleInputChange('personalWebsite', e.target.value)}
              className="jseditprofile-input"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="jseditprofile-container">
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
          Profile updated successfully!
        </div>
      )}

      {/* ✅ UPDATED: Header with gradient background like other components */}
      <div className="jseditprofile-header">
        <div className="jseditprofile-hero">
          <h1>Edit Profile</h1>
          <p>Keep your profile updated to attract the best job opportunities</p>
        </div>
      </div>

      <div className="jseditprofile-content">
        {/* Tabs Navigation */}
        <div className="jseditprofile-tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`jseditprofile-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="jseditprofile-main">
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'professional' && renderProfessionalTab()}
          {activeTab === 'experience' && renderExperienceTab()}
          {activeTab === 'education' && renderEducationTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
        </div>
      </div>

      {/* Save Button */}
      <div className="jseditprofile-actions">
        <button onClick={handleSave} className="jseditprofile-save-btn">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default JobSeekerEditProfile;