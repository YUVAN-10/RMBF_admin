import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  SquarePen,
  User,
  Users,
  GraduationCap,
  MapPin,
  Briefcase,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { useMembers } from "../context/MembersContext";
import MemberAvatar from "../components/members/MemberAvatar";
import MemberStatusBadge from "../components/members/MemberStatusBadge";
import { ProfileSection, ProfileField } from "../components/members/ProfileSection";
import { formatDate } from "../utils/formatDate";

function memberLabel(members, uid) {
  const member = members.find((m) => m.uid === uid);
  return member ? `${member.ridNo} - ${member.fullName}` : "—";
}

function ChildrenList({ title, children }) {
  if (!Array.isArray(children) || children.length === 0) return null;
  return (
    <div className="sm:col-span-2">
      <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{title}</dt>
      <div className="space-y-2">
        {children.map((child, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-bg p-3 text-sm sm:grid-cols-4"
          >
            <div>
              <p className="text-xs text-text-secondary">Name</p>
              <p className="text-text">{child.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">DOB</p>
              <p className="text-text">{formatDate(child.dob) || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Blood</p>
              <p className="text-text">{child.blood || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Qualification</p>
              <p className="text-text">{child.qualification || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const { members, getMemberById, loading } = useMembers();
  const member = getMemberById(id);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <Link
          to="/members"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Member not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/members"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Members
      </Link>

      {/* Profile header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <MemberAvatar name={member.fullName} image={member.profileImage} size="lg" />
            <div>
              <h1 className="text-xl font-semibold text-text">{member.fullName}</h1>
              <p className="text-sm text-text-secondary">{member.ridNo}</p>
              <div className="mt-2">
                <MemberStatusBadge status={member.status} />
              </div>
            </div>
          </div>

          <Link
            to={`/members/${member.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <SquarePen size={16} />
            Edit Member
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSection title="Personal Information" icon={User}>
          <ProfileField label="Full Name" value={member.fullName} />
          <ProfileField label="Date of Birth" value={formatDate(member.dateOfBirth)} />
          <ProfileField label="Blood Group" value={member.bloodGroup} />
          <ProfileField label="Phone" value={member.phone} />
          <ProfileField label="Email" value={member.email} />
        </ProfileSection>

        <ProfileSection title="Education" icon={GraduationCap}>
          <ProfileField label="Education" value={member.education} full />
        </ProfileSection>

        <ProfileSection title="Address" icon={MapPin}>
          <ProfileField label="Address" value={member.address} full />
        </ProfileSection>

        <ProfileSection title="Business Information" icon={Briefcase}>
          <ProfileField label="Company Name" value={member.companyName} />
          <ProfileField label="Business Type" value={member.businessType} />
          <ProfileField label="Business Address" value={member.businessAddress} full />
          <ProfileField label="Office Number" value={member.officeNo} />
          <ProfileField label="Website" value={member.websiteUrl} />
          <ProfileField label="Social Media" value={member.socialMedia} full />
          <ProfileField label="Business Start Date" value={formatDate(member.businessStartDate)} />
          <ProfileField label="Experience (years)" value={member.experienceYears} />
          <ProfileField label="Business Expertise" value={member.businessExpertise} full />
          <ProfileField label="Why should someone buy from you?" value={member.whyBuyFromYou} full />
          <ProfileField label="About Business" value={member.aboutBusiness} full />
          <ProfileField label="Business Mission" value={member.businessMission} full />
          <ProfileField label="Business Vision" value={member.businessVision} full />
          <ProfileField label="Flyer" value={member.flyer} />
        </ProfileSection>

        <ProfileSection title="Membership Information" icon={IdCard}>
          <ProfileField label="RID Number" value={member.ridNo} />
          <ProfileField label="Joining Date" value={formatDate(member.joiningDate)} />
          <ProfileField label="Status" value={member.status} />
        </ProfileSection>

        <ProfileSection title="Team & Sponsorship" icon={ShieldCheck}>
          <ProfileField label="Power Team" value={member.powerTeam} />
          <ProfileField label="Position" value={member.position} />
          <ProfileField label="Director" value={member.director} />
          <ProfileField label="Coordinator" value={member.coordinator} />
          <ProfileField label="Introduced By" value={memberLabel(members, member.introducedBy)} />
          <ProfileField label="Authenticated By" value={memberLabel(members, member.authenticatedBy)} />
        </ProfileSection>

        <ProfileSection title="Family Information" icon={Users}>
          <ProfileField label="Father's Name" value={member.fatherName} />
          <ProfileField label="Member Qualification" value={member.memberQualification} />
          <ProfileField label="Wife Name" value={member.wifeName} />
          <ProfileField label="Wife DOB" value={formatDate(member.wifeDob)} />
          <ProfileField label="Wife Blood Group" value={member.wifeBloodGroup} />
          <ProfileField label="Wife Qualification" value={member.wifeQualification} />
          <ChildrenList title="Sons" children={member.sons} />
          <ChildrenList title="Daughters" children={member.daughters} />
        </ProfileSection>
      </div>
    </div>
  );
}
