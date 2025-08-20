// Analytics.jsx - Analytics Dashboard Component

import { useState } from 'react';
import { TrendingUp, Users, Eye, Calendar, BarChart3, PieChart } from 'lucide-react';
import './Analytics.css';

function Analytics({ userInfo }) {
  // Mock analytics data
  const [timeFilter, setTimeFilter] = useState('month');
  
  const analyticsData = {
    overview: {
      totalViews: 1250,
      totalApplications: 89,
      totalHires: 12,
      activeJobs: 5
    },
    trends: {
      viewsChange: '+23%',
      applicationsChange: '+15%',
      hiresChange: '+2',
      responseRate: '68%'
    },
    topJobs: [
      { title: 'Senior Frontend Developer', views: 456, applications: 23 },
      { title: 'Marketing Manager', views: 321, applications: 18 },
      { title: 'UX Designer', views: 287, applications: 15 }
    ],
    monthlyData: [
      { month: 'Jan', applications: 25, views: 340 },
      { month: 'Feb', applications: 35, views: 450 },
      { month: 'Mar', applications: 29, views: 390 }
    ]
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1>Analytics & Insights</h1>
        <p>Track your hiring performance and job metrics</p>
        
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
          <div className="analytics-metric-icon">
            <Eye size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{analyticsData.overview.totalViews}</span>
            <span className="analytics-metric-label">Total Views</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.viewsChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon">
            <Users size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{analyticsData.overview.totalApplications}</span>
            <span className="analytics-metric-label">Applications</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.applicationsChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon">
            <Calendar size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{analyticsData.overview.totalHires}</span>
            <span className="analytics-metric-label">Successful Hires</span>
            <span className="analytics-metric-change positive">{analyticsData.trends.hiresChange}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="analytics-metric-content">
            <span className="analytics-metric-number">{analyticsData.trends.responseRate}</span>
            <span className="analytics-metric-label">Response Rate</span>
            <span className="analytics-metric-change neutral">Stable</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="analytics-chart-card">
          <h3>Monthly Trends</h3>
          <div className="analytics-chart-placeholder">
            <BarChart3 size={48} />
            <p>Chart visualization would go here</p>
            <small>Applications and Views over time</small>
          </div>
        </div>

        <div className="analytics-chart-card">
          <h3>Top Performing Jobs</h3>
          <div className="analytics-top-jobs">
            {analyticsData.topJobs.map((job, index) => (
              <div key={index} className="analytics-job-item">
                <div className="analytics-job-info">
                  <span className="analytics-job-title">{job.title}</span>
                  <div className="analytics-job-stats">
                    <span>{job.views} views</span>
                    <span>•</span>
                    <span>{job.applications} applications</span>
                  </div>
                </div>
                <div className="analytics-job-bar">
                  <div 
                    className="analytics-job-progress"
                    style={{ width: `${(job.applications / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="analytics-insights">
        <div className="analytics-insight-card">
          <h4>💡 Quick Insights</h4>
          <ul>
            <li>Your "Senior Frontend Developer" position gets the most attention</li>
            <li>Applications increased by 15% this month</li>
            <li>Best posting days: Tuesday and Wednesday</li>
            <li>Average time to hire: 18 days</li>
          </ul>
        </div>

        <div className="analytics-insight-card">
          <h4>📈 Recommendations</h4>
          <ul>
            <li>Consider posting similar tech roles for better reach</li>
            <li>Update job descriptions with trending keywords</li>
            <li>Respond to applications within 2-3 days for better conversion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analytics;