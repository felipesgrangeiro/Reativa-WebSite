export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatarInitials: string;
};

export type ClinicMembership = {
  clinicId: string;
  clinicName: string;
  plan: string;
};

export type AuthContext = {
  user: UserProfile;
  clinic: ClinicMembership;
};
