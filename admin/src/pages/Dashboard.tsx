import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, RefreshCw, Users, Briefcase, FileText, FolderKanban, 
  Calendar, Star, UserCheck, TrendingUp, CheckCircle, Clock,
  DollarSign, MessageSquare, BarChart3
} from 'lucide-react';
import { 
  internshipsAPI, 
  certificatesAPI, 
  applicationsAPI,
  servicesAPI,
  projectsAPI,
  teamAPI,
  eventsAPI,
  testimonialsAPI,
  usersAPI
} from '../api/api';

interface DashboardStats {
  // Internships
  totalInternships: number;
  activeInternships: number;
  featuredInternships: number;
  
  // Services
  totalServices: number;
  activeServices: number;
  
  // Projects
  totalProjects: number;
  featuredProjects: number;
  
  // Team
  totalTeamMembers: number;
  activeTeamMembers: number;
  
  // Events
  totalEvents: number;
  upcomingEvents: number;
  
  // Testimonials
  totalTestimonials: number;
  approvedTestimonials: number;
  pendingTestimonials: number;
  averageRating: number;
  
  // Certificates
  totalCertificates: number;
  verifiedCertificates: number;
  
  // Applications
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  
  // Users
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  totalAdmins: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        internshipsRes,
        servicesRes,
        projectsRes,
        teamRes,
        eventsRes,
        testimonialsRes,
        certificatesRes,
        applicationsRes,
        usersRes
      ] = await Promise.all([
        internshipsAPI.getAll(),
        servicesAPI.getAll(),
        projectsAPI.getAll(),
        teamAPI.getAll(),
        eventsAPI.getAll(),
        testimonialsAPI.getAll(),
        certificatesAPI.getAll(),
        applicationsAPI.getAll(),
        usersAPI.getAll()
      ]);

      const internships = internshipsRes.data.internships || [];
      const services = servicesRes.data.services || [];
      const projects = projectsRes.data.projects || [];
      const teamMembers = teamRes.data.team_members || [];
      const events = eventsRes.data.events || [];
      const testimonials = testimonialsRes.data.testimonials || [];
      const certificates = certificatesRes.data.certificates || [];
      const applications = applicationsRes.data.applications || [];
      const users = usersRes.data.users || [];

      // Calculate statistics
      const now = new Date();
      
      setStats({
        // Internships
        totalInternships: internships.length,
        activeInternships: internships.filter((i: any) => i.is_active).length,
        featuredInternships: internships.filter((i: any) => i.is_featured).length,
        
        // Services
        totalServices: services.length,
        activeServices: services.filter((s: any) => s.is_active).length,
        
        // Projects
        totalProjects: projects.length,
        featuredProjects: projects.filter((p: any) => p.is_featured).length,
        
        // Team
        totalTeamMembers: teamMembers.length,
        activeTeamMembers: teamMembers.filter((t: any) => t.is_active).length,
        
        // Events
        totalEvents: events.length,
        upcomingEvents: events.filter((e: any) => new Date(e.start_date) > now).length,
        
        // Testimonials
        totalTestimonials: testimonials.length,
        approvedTestimonials: testimonials.filter((t: any) => t.is_approved).length,
        pendingTestimonials: testimonials.filter((t: any) => !t.is_approved).length,
        averageRating: testimonials.length > 0 
          ? (testimonials.reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
          : '0.0',
        
        // Certificates
        totalCertificates: certificates.length,
        verifiedCertificates: certificates.filter((c: any) => c.is_verified).length,
        
        // Applications
        totalApplications: applications.length,
        pendingApplications: applications.filter((a: any) => 
          a.application_status === 'submitted' || a.application_status === 'under_review'
        ).length,
        approvedApplications: applications.filter((a: any) => a.application_status === 'accepted').length,
        
        // Users
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.is_active).length,
        verifiedUsers: users.filter((u: any) => u.email_verified).length,
        totalAdmins: users.filter((u: any) => u.role === 'admin' || u.role === 'super_admin').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Welcome to Edizo Admin Panel - Overview of your platform</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>
          <RefreshCw size={18} /> Refresh Data
        </button>
      </div>

      {/* Main Statistics Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Internships */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
            <Briefcase size={24} color="#f97316" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalInternships || 0}</div>
            <div className="stat-label">Total Internships</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.featuredInternships || 0} featured
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalServices || 0}</div>
            <div className="stat-label">Total Services</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.activeServices || 0} active
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <FolderKanban size={24} color="#a855f7" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalProjects || 0}</div>
            <div className="stat-label">Total Projects</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.featuredProjects || 0} featured
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <UserCheck size={24} color="#22c55e" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalTeamMembers || 0}</div>
            <div className="stat-label">Team Members</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.activeTeamMembers || 0} active
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
            <Calendar size={24} color="#ec4899" />
          </div>
          <div>
            <div className="stat-value">{stats?.upcomingEvents || 0}</div>
            <div className="stat-label">Upcoming Events</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.totalEvents || 0} total events
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
            <Star size={24} color="#fbbf24" />
          </div>
          <div>
            <div className="stat-value">{stats?.averageRating || '0.0'}</div>
            <div className="stat-label">Avg Rating</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.approvedTestimonials || 0}/{stats?.totalTestimonials || 0} approved
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
            <Award size={24} color="#8b5cf6" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalCertificates || 0}</div>
            <div className="stat-label">Certificates</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.verifiedCertificates || 0} verified
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <CheckCircle size={24} color="#ef4444" />
          </div>
          <div>
            <div className="stat-value">{stats?.pendingApplications || 0}</div>
            <div className="stat-label">Pending Apps</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.approvedApplications || 0} approved
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
            <Users size={24} color="#06b6d4" />
          </div>
          <div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {stats?.totalAdmins || 0} admins
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Quick Actions</h2>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <Link to="/internships" className="btn btn-secondary">
            <Briefcase size={18} /> Manage Internships
          </Link>
          <Link to="/services" className="btn btn-secondary">
            <FileText size={18} /> Manage Services
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <FolderKanban size={18} /> Manage Projects
          </Link>
          <Link to="/team" className="btn btn-secondary">
            <UserCheck size={18} /> Manage Team
          </Link>
          <Link to="/events" className="btn btn-secondary">
            <Calendar size={18} /> Manage Events
          </Link>
          <Link to="/testimonials" className="btn btn-secondary">
            <Star size={18} /> Review Testimonials
          </Link>
          <Link to="/applications" className="btn btn-secondary">
            <CheckCircle size={18} /> View Applications
          </Link>
          <Link to="/users" className="btn btn-secondary">
            <Users size={18} /> Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Platform Overview */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            <BarChart3 size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Platform Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>Active Internships</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f97316' }}>{stats?.activeInternships || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>Active Services</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>{stats?.activeServices || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>Active Users</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#22c55e' }}>{stats?.activeUsers || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>Avg Rating</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fbbf24' }}>⭐ {stats?.averageRating || '0.0'}/5.0</span>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            <Clock size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Pending Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/applications" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ef4444' }}>Applications to Review</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending approval</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>{stats?.pendingApplications || 0}</div>
            </Link>
            <Link to="/testimonials" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fbbf24' }}>Testimonials to Approve</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending review</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24' }}>{stats?.pendingTestimonials || 0}</div>
            </Link>
            <Link to="/users" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#06b6d4' }}>Unverified Emails</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Need verification</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#06b6d4' }}>
                {(stats?.totalUsers || 0) - (stats?.verifiedUsers || 0)}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
