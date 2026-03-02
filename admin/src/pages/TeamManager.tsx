import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, Upload, Image as ImageIcon, Mail, Phone, Linkedin, Twitter, Instagram } from 'lucide-react';
import { teamAPI, uploadAPI } from '../api/api';
import { toast } from 'react-toastify';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  email: string;
  phone: string;
  bio: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  is_active: boolean;
  display_order: number;
}

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photo_url: '',
    email: '',
    phone: '',
    bio: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    is_active: true,
    display_order: 0
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAll();
      setTeamMembers(response.data.team_members || []);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await teamAPI.delete(deleteId);
      toast.success('Team member deleted successfully');
      setDeleteId(null);
      fetchTeamMembers();
    } catch (error: any) {
      toast.error('Failed to delete team member');
    }
  };

  const handleEditClick = (member: TeamMember) => {
    setModalMode('edit');
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      photo_url: member.photo_url || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || '',
      instagram_url: member.instagram_url || '',
      is_active: member.is_active,
      display_order: member.display_order || 0
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadAPI.uploadImage(file, 'team');
      setFormData({ ...formData, photo_url: result.url });
      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        display_order: parseInt(formData.display_order.toString()) || 0
      };

      if (modalMode === 'add') {
        await teamAPI.create(data);
        toast.success('Team member added successfully');
      } else if (editingId) {
        await teamAPI.update(editingId, data);
        toast.success('Team member updated successfully');
      }

      setShowModal(false);
      fetchTeamMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save team member');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Team Members</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage your team profiles</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalMode('add');
              setFormData({
                name: '', role: '', photo_url: '', email: '', phone: '', bio: '',
                linkedin_url: '', twitter_url: '', instagram_url: '',
                is_active: true, display_order: 0
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchTeamMembers}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Social</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Photo';
                        }}
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e2e8f0' }}>
                        <ImageIcon size={20} style={{ color: '#94a3b8' }} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{member.name}</div>
                  </td>
                  <td>
                    <div style={{ color: '#334155', fontSize: '0.875rem' }}>{member.role}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {member.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <Mail size={12} />
                          {member.email}
                        </div>
                      )}
                      {member.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <Phone size={12} />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2' }} title="LinkedIn">
                          <Linkedin size={16} />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2' }} title="Twitter">
                          <Twitter size={16} />
                        </a>
                      )}
                      {member.instagram_url && (
                        <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: '#e4405f' }} title="Instagram">
                          <Instagram size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    {member.is_active ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(member)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(member.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeamMembers.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No team members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Add Team Member' : 'Edit Team Member'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Photo Upload */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Profile Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {formData.photo_url ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={formData.photo_url} 
                          alt="Preview"
                          style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photo_url: '' })}
                          style={{ position: 'absolute', top: '0px', right: '0px', padding: '4px', background: '#ef4444', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ width: '128px', height: '128px', borderRadius: '50%', border: '3px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#f97316';
                          (e.currentTarget as HTMLElement).style.background = '#fff7ed';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <Upload size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Upload Photo</span>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="btn btn-secondary"
                      >
                        {uploadingImage ? 'Uploading...' : 'Choose Photo'}
                      </button>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Max size: 5MB. Formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role/Position *</label>
                  <input
                    className="form-input"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="CEO & Founder"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@edizo.in"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Bio/Description</label>
                  <textarea
                    className="form-input"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    placeholder="Brief description about the team member..."
                  />
                </div>

                {/* Social Links */}
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.linkedin_url}
                    onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Twitter URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.twitter_url}
                    onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/johndoe"
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Instagram URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.instagram_url}
                    onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/johndoe"
                  />
                </div>

                <div className="form-group span-2" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Active</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Add Member' : 'Update Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Delete Team Member</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this team member? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
