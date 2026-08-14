// Dummy member records for RMBF Erode United.
// Shaped to match the future Firestore collection: members/{memberId}
// so this module can be swapped for a Firestore query later without
// touching the components that consume it.

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const businessTypes = [
  "Manufacturing",
  "Trading",
  "Services",
  "Retail",
  "Textiles",
  "Other",
];

export const memberStatuses = ["Active", "Inactive"];

export const positions = [
  "Member",
  "Team Leader",
  "Secretary",
  "Treasurer",
  "Vice President",
  "President",
];

export const directors = [
  "Business Growth",
  "Membership Development",
  "Events & Programs",
  "Training",
  "Visitor Relations",
];

export const coordinators = [
  "R to R",
  "Contribution",
  "Training",
  "Presentation (8 min)",
  "Attendance",
  "Media",
  "Venue",
  "Power Team",
  "Greetings",
  "Testimonial",
  "Social",
  "LVH",
  "Education Slot",
  "Activities",
];

function emptyChild() {
  return { name: "", dob: "", blood: "", qualification: "" };
}

export const initialMembers = [];

export const emptyMember = {
  uid: "",
  ridNo: "",
  fullName: "",
  email: "",
  phone: "",
  bloodGroup: "",
  fatherName: "",
  education: "",
  address: "",
  profileImage: null,
  dateOfBirth: "",
  companyName: "",
  businessType: "",
  businessAddress: "",
  officeNo: "",
  websiteUrl: "",
  socialMedia: "",
  joiningDate: "",
  status: "Active",
  businessStartDate: "",
  experienceYears: "",
  businessExpertise: "",
  whyBuyFromYou: "",
  aboutBusiness: "",
  businessMission: "",
  businessVision: "",
  flyer: null,
  powerTeam: "",
  position: "",
  director: "",
  coordinator: "",
  introducedBy: "",
  authenticatedBy: "",
  memberQualification: "",
  wifeName: "",
  wifeDob: "",
  wifeBloodGroup: "",
  wifeQualification: "",
  sons: [],
  daughters: [],
  createdAt: "",
  updatedAt: "",
};

export function createEmptyChild() {
  return emptyChild();
}
