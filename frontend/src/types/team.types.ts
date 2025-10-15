// src/types/team.types.ts

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string;
  email: string;
  linkedin: string;
  facebook: string;      // Changed from twitter
  instagram: string;     // Added
  bio: string;
}

export interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
}

export interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}
