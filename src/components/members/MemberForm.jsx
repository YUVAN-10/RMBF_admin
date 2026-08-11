import { useState } from "react";
import {
  User,
  Briefcase,
  ShieldCheck,
  Users,
  GraduationCap,
  MapPin,
  IdCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";
import FileUpload from "./FileUpload";
import DynamicPersonFields from "./DynamicPersonFields";
import MemberFormStepper from "./MemberFormStepper";
import {
  bloodGroups,
  businessTypes,
  memberStatuses,
  powerTeams,
} from "../../data/membersData";
import { useMasters } from "../../context/MastersContext";
import { validateFields, STEP_FIELDS } from "../../utils/memberValidation";

const STEPS = [
  { key: "personal", label: "Personal Information", icon: User },
  { key: "business", label: "Business Information", icon: Briefcase },
  { key: "membership", label: "Membership Information", icon: ShieldCheck },
  { key: "family", label: "Family Information", icon: Users },
];

function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
          <Icon size={16} />
        </div>
        <h2 className="text-sm font-semibold text-secondary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function fieldClasses(hasError) {
  return [
    "w-full rounded-lg border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-1",
    hasError
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border focus:border-primary focus:ring-primary",
  ].join(" ");
}

function Field({ label, error, full, required, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-text">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function MemberForm({ initialData, members = [], onSubmit, onCancel, submitLabel, isSubmitting = false }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const { masters } = useMasters();

  const stepKey = STEPS[currentStep].key;
  const isLastStep = currentStep === STEPS.length - 1;
  const memberOptions = members.filter((m) => m.uid !== formData.uid);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (dataUrl) => {
    setFormData((prev) => ({ ...prev, profileImage: dataUrl }));
  };

  const handleFlyerChange = (fileName) => {
    setFormData((prev) => ({ ...prev, flyer: fileName }));
  };

  const goToStep = (index) => {
    setErrors({});
    setCurrentStep(index);
  };

  const handleNext = () => {
    const stepErrors = validateFields(formData, STEP_FIELDS[stepKey]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    goToStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLastStep) return;

    const stepErrors = validateFields(formData, STEP_FIELDS[stepKey]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <MemberFormStepper steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {stepKey === "personal" && (
          <>
            <div className="rounded-xl border border-border bg-bg p-5">
              <h2 className="mb-4 text-sm font-semibold text-secondary">Profile Image</h2>
              <ProfileImageUpload
                image={formData.profileImage}
                onChange={handleImageChange}
                name={formData.fullName}
              />
            </div>

            <FormSection title="Personal Information" icon={User}>
              <Field label="Full Name" error={errors.fullName} required>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="e.g. Yuvan Kumar"
                  className={fieldClasses(errors.fullName)}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="name@example.com"
                  className={fieldClasses(errors.email)}
                />
              </Field>
              <Field label="Phone" error={errors.phone} required>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  placeholder="9876543210"
                  className={fieldClasses(errors.phone)}
                />
              </Field>
              <Field label="Date of Birth" error={errors.dateOfBirth}>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange("dateOfBirth")}
                  className={fieldClasses(errors.dateOfBirth)}
                />
              </Field>
              <Field label="Blood Group" error={errors.bloodGroup}>
                <select
                  value={formData.bloodGroup}
                  onChange={handleChange("bloodGroup")}
                  className={fieldClasses(errors.bloodGroup)}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </Field>
            </FormSection>

            <FormSection title="Education" icon={GraduationCap}>
              <Field label="Education" error={errors.education} full>
                <input
                  type="text"
                  value={formData.education}
                  onChange={handleChange("education")}
                  placeholder="e.g. B.E. Mechanical Engineering"
                  className={fieldClasses(errors.education)}
                />
              </Field>
            </FormSection>

            <FormSection title="Address" icon={MapPin}>
              <Field label="Address" error={errors.address} full>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={handleChange("address")}
                  className={fieldClasses(errors.address)}
                />
              </Field>
            </FormSection>
          </>
        )}

        {stepKey === "business" && (
          <>
            <FormSection title="Business Information" icon={Briefcase}>
              <Field label="Company Name" error={errors.companyName}>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange("companyName")}
                  className={fieldClasses(errors.companyName)}
                />
              </Field>
              <Field label="Business Type" error={errors.businessType}>
                <select
                  value={formData.businessType}
                  onChange={handleChange("businessType")}
                  className={fieldClasses(errors.businessType)}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Business Address" error={errors.businessAddress} full>
                <textarea
                  rows={2}
                  value={formData.businessAddress}
                  onChange={handleChange("businessAddress")}
                  className={fieldClasses(errors.businessAddress)}
                />
              </Field>
              <Field label="Office Number" error={errors.officeNo}>
                <input
                  type="tel"
                  value={formData.officeNo}
                  onChange={handleChange("officeNo")}
                  placeholder="0424-2345678"
                  className={fieldClasses(errors.officeNo)}
                />
              </Field>
              <Field label="Website" error={errors.websiteUrl}>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange("websiteUrl")}
                  placeholder="https://example.com"
                  className={fieldClasses(errors.websiteUrl)}
                />
              </Field>
              <Field label="Social Media" error={errors.socialMedia} full>
                <input
                  type="url"
                  value={formData.socialMedia}
                  onChange={handleChange("socialMedia")}
                  placeholder="https://instagram.com/yourbusiness"
                  className={fieldClasses(errors.socialMedia)}
                />
              </Field>
            </FormSection>

            <FormSection title="Business Profile" icon={Briefcase}>
              <Field label="Business Start Date" error={errors.businessStartDate}>
                <input
                  type="date"
                  value={formData.businessStartDate}
                  onChange={handleChange("businessStartDate")}
                  className={fieldClasses(errors.businessStartDate)}
                />
              </Field>
              <Field label="Experience (years)" error={errors.experienceYears}>
                <input
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleChange("experienceYears")}
                  className={fieldClasses(errors.experienceYears)}
                />
              </Field>
              <Field label="Business Expertise" error={errors.businessExpertise}>
                <input
                  type="text"
                  value={formData.businessExpertise}
                  onChange={handleChange("businessExpertise")}
                  className={fieldClasses(errors.businessExpertise)}
                />
              </Field>
              <Field label="Why should someone buy from you?" error={errors.whyBuyFromYou}>
                <textarea
                  rows={2}
                  value={formData.whyBuyFromYou}
                  onChange={handleChange("whyBuyFromYou")}
                  className={fieldClasses(errors.whyBuyFromYou)}
                />
              </Field>
              <Field label="About Business" error={errors.aboutBusiness}>
                <textarea
                  rows={2}
                  value={formData.aboutBusiness}
                  onChange={handleChange("aboutBusiness")}
                  className={fieldClasses(errors.aboutBusiness)}
                />
              </Field>
              <Field label="Business Mission" error={errors.businessMission}>
                <textarea
                  rows={2}
                  value={formData.businessMission}
                  onChange={handleChange("businessMission")}
                  className={fieldClasses(errors.businessMission)}
                />
              </Field>
              <Field label="Business Vision" error={errors.businessVision}>
                <textarea
                  rows={2}
                  value={formData.businessVision}
                  onChange={handleChange("businessVision")}
                  className={fieldClasses(errors.businessVision)}
                />
              </Field>
              <Field label="Flyer">
                <FileUpload fileName={formData.flyer} onChange={handleFlyerChange} />
              </Field>
            </FormSection>
          </>
        )}

        {stepKey === "membership" && (
          <>
            <FormSection title="Membership Information" icon={IdCard}>
              <Field label="RID Number" error={errors.ridNo}>
                <input
                  type="text"
                  value={formData.ridNo}
                  onChange={handleChange("ridNo")}
                  placeholder="RMBF011"
                  className={fieldClasses(errors.ridNo)}
                />
              </Field>
              <Field label="Joining Date" error={errors.joiningDate}>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange("joiningDate")}
                  className={fieldClasses(errors.joiningDate)}
                />
              </Field>
              <Field label="Status" error={errors.status}>
                <select
                  value={formData.status}
                  onChange={handleChange("status")}
                  className={fieldClasses(errors.status)}
                >
                  {memberStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </FormSection>

            <FormSection title="Team & Sponsorship" icon={ShieldCheck}>
              <Field label="Power Team" error={errors.powerTeam}>
                <select
                  value={formData.powerTeam}
                  onChange={handleChange("powerTeam")}
                  className={fieldClasses(errors.powerTeam)}
                >
                  <option value="">-- Select --</option>
                  {powerTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Position" error={errors.position}>
                <select
                  value={formData.position}
                  onChange={handleChange("position")}
                  className={fieldClasses(errors.position)}
                >
                  <option value="">-- Select --</option>
                  {masters.positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Director" error={errors.director}>
                <select
                  value={formData.director}
                  onChange={handleChange("director")}
                  className={fieldClasses(errors.director)}
                >
                  <option value="">-- Select --</option>
                  {masters.directors.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Coordinator" error={errors.coordinator}>
                <select
                  value={formData.coordinator}
                  onChange={handleChange("coordinator")}
                  className={fieldClasses(errors.coordinator)}
                >
                  <option value="">-- Select --</option>
                  {masters.coordinators.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Introduced By (Member)" error={errors.introducedBy}>
                <select
                  value={formData.introducedBy}
                  onChange={handleChange("introducedBy")}
                  className={fieldClasses(errors.introducedBy)}
                >
                  <option value="">-- Select Member (RID) --</option>
                  {memberOptions.map((m) => (
                    <option key={m.uid} value={m.uid}>
                      {m.ridNo} - {m.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Authenticated By (Member)" error={errors.authenticatedBy}>
                <select
                  value={formData.authenticatedBy}
                  onChange={handleChange("authenticatedBy")}
                  className={fieldClasses(errors.authenticatedBy)}
                >
                  <option value="">-- Select Member (RID) --</option>
                  {memberOptions.map((m) => (
                    <option key={m.uid} value={m.uid}>
                      {m.ridNo} - {m.fullName}
                    </option>
                  ))}
                </select>
              </Field>
            </FormSection>
          </>
        )}

        {stepKey === "family" && (
          <>
            <FormSection title="Family Information" icon={Users}>
              <Field label="Father's Name" error={errors.fatherName}>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={handleChange("fatherName")}
                  className={fieldClasses(errors.fatherName)}
                />
              </Field>
              <Field label="Member Qualification" error={errors.memberQualification}>
                <input
                  type="text"
                  value={formData.memberQualification}
                  onChange={handleChange("memberQualification")}
                  className={fieldClasses(errors.memberQualification)}
                />
              </Field>
              <Field label="Wife Name" error={errors.wifeName}>
                <input
                  type="text"
                  value={formData.wifeName}
                  onChange={handleChange("wifeName")}
                  className={fieldClasses(errors.wifeName)}
                />
              </Field>
              <Field label="Wife DOB" error={errors.wifeDob}>
                <input
                  type="date"
                  value={formData.wifeDob}
                  onChange={handleChange("wifeDob")}
                  className={fieldClasses(errors.wifeDob)}
                />
              </Field>
              <Field label="Wife Blood Group" error={errors.wifeBloodGroup}>
                <input
                  type="text"
                  value={formData.wifeBloodGroup}
                  onChange={handleChange("wifeBloodGroup")}
                  placeholder="e.g. O+"
                  className={fieldClasses(errors.wifeBloodGroup)}
                />
              </Field>
              <Field label="Wife Qualification" error={errors.wifeQualification}>
                <input
                  type="text"
                  value={formData.wifeQualification}
                  onChange={handleChange("wifeQualification")}
                  className={fieldClasses(errors.wifeQualification)}
                />
              </Field>
            </FormSection>

            <FormSection title="Children" icon={Users}>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-text">Sons</p>
                <DynamicPersonFields
                  label="Son"
                  addLabel="+ Add Son"
                  items={formData.sons}
                  onChange={(sons) => setFormData((prev) => ({ ...prev, sons }))}
                />
              </div>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-text">Daughters</p>
                <DynamicPersonFields
                  label="Daughter"
                  addLabel="+ Add Daughter"
                  items={formData.daughters}
                  onChange={(daughters) => setFormData((prev) => ({ ...prev, daughters }))}
                />
              </div>
            </FormSection>
          </>
        )}

        <div className="flex items-center justify-between border-t border-border pt-5">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePrevious}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
