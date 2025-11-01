import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import type { TeamMember } from '../../types/team.types';
import { isValidEmail } from '../../types/team.types';

// --- Robust Asset Path/URL Utility ---
function getPhotoPath(photo: string) {
  if (!photo || photo === 'N/A' || photo === '#' || photo.trim() === '') {
    return '/assets/team/No-Dp-Pics.jpeg';
  }
  if (photo.startsWith('/') || photo.startsWith('http')) {
    return photo;
  }
  return `/assets/team/${photo}`;
}

// --- Memoized Team Member Modal Component ---
const TeamMemberModal = memo<{ member: TeamMember; onClose: () => void }>(({ member, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <img
                src={getPhotoPath(member.photo)}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg'; }}
              />
              <div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-white/90 text-lg">{member.role}</p>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="p-8 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Connect</h4>
              <div className="space-y-3">
                {isValidEmail(member.email) ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <Mail size={20} className="text-gray-600 group-hover:text-red-600" />
                    </div>
                    <span className="font-medium">{member.email}</span>
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm italic">No contact information available</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
TeamMemberModal.displayName = 'TeamMemberModal';

// --- Memoized Team Member Card ---
const TeamMemberCard = memo<{ member: TeamMember; onClick: (member: TeamMember) => void }>(
  ({ member, onClick }) => {
    const handleClick = useCallback(() => { onClick(member); }, [member, onClick]);
    return (
      <div className="flex-shrink-0 w-72 mx-4">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-6 h-80 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl"
          onClick={handleClick}
        >
          <div className="relative mb-4">
            <img
              src={getPhotoPath(member.photo)}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
              loading="lazy"
              onError={e => { e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg'; }}
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <h4 className="text-xl font-bold text-gray-900 text-center mb-1">{member.name}</h4>
          <p className="text-sm text-red-600 font-medium mb-3">{member.role}</p>
          {isValidEmail(member.email) && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail size={16} />
              <span className="truncate max-w-[200px]">{member.email}</span>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4">Click to view details</p>
        </motion.div>
      </div>
    );
  }
);
TeamMemberCard.displayName = 'TeamMemberCard';

// --- Memoized Auto-Scrolling Team Gallery Component ---
const AutoScrollingGallery = memo(() => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { teamMembers, loading, error } = useTeamMembers();

  const handleMemberClick = useCallback((member: TeamMember) => { setSelectedMember(member); }, []);
  const handleCloseModal = useCallback(() => { setSelectedMember(null); }, []);
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const doubledMembers = useMemo(() => teamMembers.length > 0 ? [...teamMembers, ...teamMembers] : [], [teamMembers]);

  if (loading) {
    return (
      <div className="relative w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-16">
        <div className="text-center px-4">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Team</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  if (teamMembers.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-16">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No team members found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-12"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center mb-8 px-4 max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800">Meet Our Team</h3>
        </div>
        <div className="flex overflow-hidden">
          <motion.div
            className="flex flex-nowrap"
            animate={{ x: isPaused ? 0 : "-50%" }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            {doubledMembers.map((member, index) => (
              <TeamMemberCard
                key={`${member.id}-${index}`}
                member={member}
                onClick={handleMemberClick}
              />
            ))}
          </motion.div>
        </div>
      </div>
      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={handleCloseModal}/>
      )}
    </>
  );
});
AutoScrollingGallery.displayName = 'AutoScrollingGallery';

export default AutoScrollingGallery;
