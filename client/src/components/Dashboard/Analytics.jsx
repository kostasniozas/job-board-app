// Analytics.jsx - Enhanced Analytics Dashboard with Real Data

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Calendar, BarChart3, PieChart, Target, Award } from 'lucide-react';
import './Analytics.css';

function Analytics({ userInfo }) {
  const [timeFilter, setTimeFilter] = useState('month');
  const [animatedValues, setAnimatedValues] = useState({
    totalViews: 0,
    totalApplications: 0,
    totalHires: 0,
    responseRate: 0
  });

  // Real data calculated from existing mock data (as if from other components)
  const calculateRealData = () => {
    // This would normally come from props or context, but using realistic mock data
    const jobsData = [
      { id: 1, title: 'Senior Frontend Developer', views: 156, applicants: 23, status: 'active', createdAt: '2024-02-15' },
      { id: 2, title: 'Marketing Manager', views: 89, applicants: 18, status: 'active', createdAt: '2024-02-10' },
      { id: 3, title: 'UX Designer', views: 203, applicants: 31, status: 'closed', createdAt: '2024-01-20' }
    ];

    const candidatesData = [
      { status: 'pending', appliedFor: 'Senior Frontend Developer', appliedDate: '2024-02-20' },
      { status: 'approved', appliedFor: 'Marketing Manager', appliedDate: '2024-02-18' },
      { status: 'rejected', appliedFor: 'UX Designer', appliedDate: '2024-02-15' },
      { status: 'pending', appliedFor: 'Senior Frontend Developer', appliedDate: '2024-02-22' }
    ];

    const totalViews = jobsData.reduce((sum, job) => sum + job.views, 0);
    const totalApplications = jobsData.reduce((sum, job) => sum + job.applicants, 0);
    const totalHires = candidatesData.filter(c => c.status === 'approved').length;
    const responseRate = Math.round((totalHires / totalApplications) * 100);

    return {
      overview: {
        totalViews,
        totalApplications,
        totalHires,
        activeJobs: jobsData.filter(j => j.status === 'active').length,
        responseRate: `${responseRate}%`
      },
      trends: {
        viewsChange: '+23%',
        applicationsChange: '+15%',
        hiresChange: totalHires > 0 ? `+${totalHires}` : '0',
        responseRateChange: responseRate > 50 ? 'Good' : 'Needs Improvement'
      },
      topJobs: jobsData
        .sort((a, b) => b.applicants - a.applicants)
        .slice(0, 3)
        .map(job => ({
          title: job.title,
          views: job.views,
          applications: job.applicants,
          conversionRate: Math.round((job.applicants / job.views) * 100)
        })),
      weeklyData: [
        { day: 'Mon', applications: 8, views: 45 },
        { day: 'Tue', applications: 12, views: 67 },
        { day: 'Wed', applications: 15, views: 78 },
        { day: 'Thu', applications: 10, views: 52 },
        { day: 'Fri', applications: 7, views: 34 },
        { day: 'Sat', applications: 3, views: 18 },
        { day: 'Sun', applications: 2, views: 12 }
      ]
    };
  };

  const analyticsData = calculateRealData();

  // Animated counter effect
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        totalViews: Math.round(analyticsData.overview.totalViews * easeOutQuart),
        totalApplications: Math.round(analyticsData.overview.totalApplications * easeOutQuart),
        totalHires: Math.round(analyticsData.overview.totalHires * easeOutQuart),
        responseRate: Math.round(parseInt(analyticsData.overview.responseRate) * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [timeFilter]);

  // Simple bar chart component
  const WeeklyChart = () => {
    const maxApplications = Math.max(...analyticsData.weeklyData.map(d => d.applications));
    
    return (
      <div className="analytics-weekly-chart">
        <div className="analytics-chart-bars">
          {analyticsData.weeklyData.map((day, index) => (
            <div key={day.day} className="analytics-chart-bar-container">
              <div 
                className="analytics-chart-bar"
                style={{ 
                  height: `${(day.applications / maxApplications) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
                title={`${day.day}: ${day.applications} applications`}
              ></div>
              <span className="analytics-chart-label">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="analytics-chart-title">Daily Applications This Week</div>
      </div>
    );
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-header-content">
          <h1>Analytics & Insights</h1>
          <p>Track your hiring performance and job metrics</p>
        </div>
        
        <div className="analytics-time-filter">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="analytics-select"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <div className="analytics-metric-card">
          <div className="analytics-metric-icon views">
            <Eye size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{animatedValues.totalViews.toLocaleString()}</span>
            <span className="analytics-metric-label">Total Views</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.viewsChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon applications">
            <Users size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{animatedValues.totalApplications}</span>
            <span className="analytics-metric-label">Applications</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.applicationsChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon hires">
            <Award size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{animatedValues.totalHires}</span>
            <span className="analytics-metric-label">Successful Hires</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.hiresChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon response">
            <Target size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{animatedValues.responseRate}%</span>
            <span className="analytics-metric-label">Success Rate</span>
            <span className={`analytics-metric-change ${animatedValues.responseRate > 50 ? 'positive' : 'neutral'}`}>
              {analyticsData.trends.responseRateChange}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="analytics-chart-card">
          <h3>Weekly Application Trends</h3>
          <WeeklyChart />
        </div>

        <div className="analytics-chart-card">
          <h3>Top Performing Jobs</h3>
          <div className="analytics-top-jobs">
            {analyticsData.topJobs.map((job, index) => (
              <div key={index} className="analytics-job-item">
                <div className="analytics-job-rank">#{index + 1}</div>
                <div className="analytics-job-info">
                  <span className="analytics-job-title">{job.title}</span>
                  <div className="analytics-job-stats">
                    <span>{job.views} views</span>
                    <span>•</span>
                    <span>{job.applications} applications</span>
                    <span>•</span>
                    <span className="analytics-conversion">{job.conversionRate}% rate</span>
                  </div>
                </div>
                <div className="analytics-job-bar">
                  <div 
                    className="analytics-job-progress"
                    style={{ 
                      width: `${(job.applications / Math.max(...analyticsData.topJobs.map(j => j.applications))) * 100}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Insights */}
      <div className="analytics-insights">
        <div className="analytics-insight-card">
          <h4>
            <TrendingUp size={18} />
            Performance Highlights
          </h4>
          <ul>
            <li>Your <strong>"{analyticsData.topJobs[0]?.title}"</strong> position is your top performer</li>
            <li>Applications increased by <strong>15%</strong> this month</li>
            <li>Best posting days: <strong>Tuesday and Wednesday</strong></li>
            <li>Average response time: <strong>2.3 days</strong></li>
          </ul>
        </div>

        <div className="analytics-insight-card">
          <h4>
            <Target size={18} />
            Smart Recommendations
          </h4>
          <ul>
            <li>Consider posting more <strong>tech roles</strong> - they get 40% more views</li>
            <li>Your success rate is <strong>{analyticsData.overview.responseRate}</strong> - 
                {parseInt(analyticsData.overview.responseRate) > 50 ? ' excellent work!' : ' room for improvement'}
            </li>
            <li>Post jobs on <strong>Tuesday mornings</strong> for maximum visibility</li>
            <li>Update job descriptions with <strong>trending keywords</strong></li>
          </ul>
        </div>

        <div className="analytics-insight-card">
          <h4>
            <BarChart3 size={18} />
            Quick Stats
          </h4>
          <div className="analytics-quick-stats-grid">
            <div className="analytics-quick-stat">
              <span className="analytics-stat-number">{analyticsData.overview.activeJobs}</span>
              <span className="analytics-stat-label">Active Jobs</span>
            </div>
            <div className="analytics-quick-stat">
              <span className="analytics-stat-number">{Math.round(analyticsData.overview.totalViews / analyticsData.overview.activeJobs)}</span>
              <span className="analytics-stat-label">Avg Views/Job</span>
            </div>
            <div className="analytics-quick-stat">
              <span className="analytics-stat-number">2.3</span>
              <span className="analytics-stat-label">Days to Respond</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;