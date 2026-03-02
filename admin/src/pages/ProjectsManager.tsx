import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, Upload, Image as ImageIcon, ExternalLink, Github } from 'lucide-react';
import { projectsAPI, uploadAPI } from '../api/api';
import { toast } from 'react-toastify';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    client_name: '',
    industry: '',
    project_type: '',
    image_url: '',
    gallery_urls: '',
    technologies: '',
    features: '',
    challenges: '',
    solutions: '',
    project_url: '',
    github_url: '',
    is_active: true,
    is_featured: false,
    display_order: 0
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await projectsAPI.delete(deleteId);
      toast.success('Project deleted successfully');
      setDeleteId(null);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEditClick = (project) => {
    setModalMode('edit');
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description || '',
      description: project.description || '',
      client_name: project.client_name || '',
      industry: project.industry || '',
      project_type: project.project_type || '',
      image_url: project.image_url || '',
      gallery_urls: project.gallery_urls?.join('\n') || '',
      technologies: project.technologies?.join(', ') || '',
      features: project.features?.join('\n') || '',
      challenges: project.challenges?.join('\n') || '',
      solutions: project.solutions?.join('\n') || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      is_active: project.is_active,
      is_featured: project.is_featured,
      display_order: project.display_order || 0
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
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
      const result = await uploadAPI.uploadImage(file, 'projects');
      setFormData({ ...formData, image_url: result.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        gallery_urls: formData.gallery_urls.split('\n').filter(url => url.trim()),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        features: formData.features.split('\n').filter(f => f.trim()),
        challenges: formData.challenges.split('\n').filter(c => c.trim()),
        solutions: formData.solutions.split('\n').filter(s => s.trim())
      };

      if (modalMode === 'add') {
        await projectsAPI.create(data);
        toast.success('Project created successfully');
      } else if (editingId) {
        await projectsAPI.update(editingId, data);
        toast.success('Project updated successfully');
      }

      setShowModal(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1>Projects Portfolio</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage your project portfolio and case studies</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalMode('add');
              setFormData({
                title: '', slug: '', short_description: '', description: '', client_name: '',
                industry: '', project_type: '', image_url: '', gallery_urls: '', technologies: '',
                features: '', challenges: '', solutions: '', project_url: '', github_url: '',
                is_active: true, is_featured: false, display_order: 0
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add Project
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchProjects}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Project</th>
                <th>Client</th>
                <th>Type</th>
                <th>Links</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100?text=No+Image';
                        }}
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                        <ImageIcon size={20} style={{ color: '#94a3b8' }} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{project.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.short_description?.substring(0, 50)}...</div>
                  </td>
                  <td>
                    <div style={{ color: '#334155' }}>{project.client_name || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{project.project_type || 'General'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }} title="Project Link">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ color: '#334155' }} title="GitHub Link">
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    {project.is_active ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(project)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(project.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No projects found
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
              <h3>{modalMode === 'add' ? 'New Project' : 'Edit Project'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Image Upload */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Project Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {formData.image_url ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={formData.image_url} 
                          alt="Preview"
                          style={{ width: '128px', height: '128px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '4px', background: '#ef4444', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ width: '128px', height: '128px', borderRadius: '8px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#f97316';
                          e.currentTarget.style.background = '#fff7ed';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Upload size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Upload Image</span>
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
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </button>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Max size: 5MB. Formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="form-group span-2">
                  <label className="form-label">Project Title *</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E-commerce Platform"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input
                    className="form-input"
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <input
                    className="form-input"
                    value={formData.project_type}
                    onChange={e => setFormData({ ...formData, project_type: e.target.value })}
                    placeholder="Web Development, Mobile App, etc."
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Short Description</label>
                  <input
                    className="form-input"
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief project overview"
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Full Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed project description"
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Technologies (comma separated)</label>
                  <input
                    className="form-input"
                    value={formData.technologies}
                    onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project URL</label>
                  <input
                    className="form-input"
                    value={formData.project_url}
                    onChange={e => setFormData({ ...formData, project_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    className="form-input"
                    value={formData.github_url}
                    onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Featured</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Project' : 'Update Project')}
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
              <h3>Delete Project</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this project? This action cannot be undone.</p>
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
