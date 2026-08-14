const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/;
const YEARS_REGEX = /^\d+$/;

// fullName, phone, and ridNo carry a `required` rule — every other field is
// optional but still format-checked when the admin does fill it in. RID No
// is never auto-generated (see MembersContext.jsx/MemberFormPage.jsx), so
// the admin must always type one.
const FIELD_RULES = {
  // Step 1 — Personal Information
  fullName: { required: "Full name is required" },
  email: {
    format: (v) => (EMAIL_REGEX.test(v) ? null : "Please enter a valid email address"),
  },
  phone: {
    required: "Phone number is required",
    format: (v) => (PHONE_REGEX.test(v) ? null : "Please enter a valid 10-digit phone number"),
  },
  dateOfBirth: {},
  bloodGroup: {},
  education: {},
  address: {},

  // Step 2 — Business Information
  companyName: {},
  businessType: {},
  businessAddress: {},
  officeNo: {},
  websiteUrl: {
    format: (v) => (URL_REGEX.test(v) ? null : "Please enter a valid website URL (https://...)"),
  },
  socialMedia: {
    format: (v) => (URL_REGEX.test(v) ? null : "Please enter a valid social media URL (https://...)"),
  },
  businessStartDate: {},
  experienceYears: {
    format: (v) => (YEARS_REGEX.test(v) ? null : "Please enter a valid number of years"),
  },
  businessExpertise: {},
  whyBuyFromYou: {},
  aboutBusiness: {},
  businessMission: {},
  businessVision: {},

  // Step 3 — Membership Information
  ridNo: { required: "RID No is required" },
  joiningDate: {},
  status: {},
  powerTeam: {},
  position: {},
  director: {},
  coordinator: {},
  introducedBy: {},
  authenticatedBy: {},

  // Step 4 — Family Information
  fatherName: {},
  memberQualification: {},
  wifeName: {},
  wifeDob: {},
  wifeBloodGroup: {},
  wifeQualification: {},
};

export const STEP_FIELDS = {
  personal: ["fullName", "email", "phone", "dateOfBirth", "bloodGroup", "education", "address"],
  business: [
    "companyName",
    "businessType",
    "businessAddress",
    "officeNo",
    "websiteUrl",
    "socialMedia",
    "businessStartDate",
    "experienceYears",
    "businessExpertise",
    "whyBuyFromYou",
    "aboutBusiness",
    "businessMission",
    "businessVision",
  ],
  membership: [
    "ridNo",
    "joiningDate",
    "status",
    "powerTeam",
    "position",
    "director",
    "coordinator",
    "introducedBy",
    "authenticatedBy",
  ],
  family: ["fatherName", "memberQualification", "wifeName", "wifeDob", "wifeBloodGroup", "wifeQualification"],
};

export function validateFields(data, fieldNames) {
  const errors = {};
  for (const field of fieldNames) {
    const rule = FIELD_RULES[field];
    if (!rule) continue;
    const value = data[field];
    const isEmpty = !value || !String(value).trim();

    if (isEmpty) {
      if (rule.required) errors[field] = rule.required;
    } else if (rule.format) {
      const formatError = rule.format(String(value).trim());
      if (formatError) errors[field] = formatError;
    }
  }
  return errors;
}
