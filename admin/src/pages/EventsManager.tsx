import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, Calendar, Clock, Users, MapPin, Link as LinkIcon } from 'lucide-react';
import { eventsAPI } from '../api/api';
import { toast } from 'react-toastify';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    event_type: 'Event',
    description: '',
    short_description: '',
    start_date: '',
    end_date: '',
    venue: '',
    mode: 'Online',
    registration_link: '',
    registration_deadline: '',
    max_participants: '',
    is_active: true,
    is_featured: false
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await eventsAPI.delete(deleteId);
      toast.success('Event deleted successfully');
      setDeleteId(null);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEditClick = (event) => {
    setModalMode('edit');
    setEditingId(event.id);
    setFormData({
      title: event.title,
      slug: event.slug,
      event_type: event.event_type,
      description: event.description,
      short_description: event.short_description,
      start_date: event.start_date?.split('T')[0] || '',
      end_date: event.end_date?.split('T')[0] || '',
      venue: event.venue,
      mode: event.mode,
      registration_link: event.registration_link,
      registration_deadline: event.registration_deadline?.split('T')[0] || '',
      max_participants: event.max_participants,
      is_active: event.is_active,
      is_featured: event.is_featured
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      if (modalMode === 'add') {
        await eventsAPI.create(data);
        toast.success('Event created successfully');
      } else if (editingId) {
        await eventsAPI.update(editingId, data);
        toast.success('Event updated successfully');
      }

      setShowModal(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1>Events & Webinars</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage events, webinars, and workshops</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalMode('add');
              setFormData({
                title: '', slug: '', event_type: 'Event', description: '', short_description: '',
                start_date: '', end_date: '', venue: '', mode: 'Online', registration_link: '',
                registration_deadline: '', max_participants: '', is_active: true, is_featured: false
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add Event
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
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchEvents}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Registration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{event.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{event.short_description?.substring(0, 50)}...</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{event.event_type}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>{event.mode}</span>
                  </td>
                  <td>
                    {event.registration_link ? (
                      <a href={event.registration_link} target="_blank" rel="noopener noreferrer" style={{ color: '#f97316', textDecoration: 'none' }}>
                        <LinkIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Register
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>No Link</span>
                    )}
                  </td>
                  <td>
                    {event.is_active ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(event)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(event.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No events found
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'New Event' : 'Edit Event'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group span-2">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event Title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select
                    className="form-input"
                    value={formData.event_type}
                    onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="Event">Event</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mode</label>
                  <select
                    className="form-input"
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value })}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Short Description</label>
                  <input
                    className="form-input"
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>

                <div className="form-group span-2">
                  <label className="form-label">Full Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed description"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue/Location</label>
                  <input
                    className="form-input"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Event venue or online platform"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registration Link</label>
                  <input
                    className="form-input"
                    value={formData.registration_link}
                    onChange={e => setFormData({ ...formData, registration_link: e.target.value })}
                    placeholder="https://..."
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
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Event' : 'Update Event')}
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
              <h3>Delete Event</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this event? This action cannot be undone.</p>
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
