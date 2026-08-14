import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MemberForm from "../components/members/MemberForm";
import { useMembers } from "../context/MembersContext";
import { emptyMember } from "../data/membersData";

export default function MemberFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, getMemberById, addMember, updateMember, loading } = useMembers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const existingMember = isEdit ? getMemberById(id) : null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isEdit && !existingMember) {
    return (
      <div className="space-y-4">
        <Link
          to="/members"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
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

  const initialData = isEdit
    ? existingMember
    : {
        ...emptyMember,
        joiningDate: new Date().toISOString().slice(0, 10),
      };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateMember(existingMember.uid, formData, formData.profileImage);
        navigate(`/members/${existingMember.uid}`);
      } else {
        const uid = await addMember(formData, formData.profileImage);
        navigate(`/members/${uid}`);
      }
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Failed to save member. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/members/${existingMember.uid}` : "/members");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEdit ? `/members/${existingMember.uid}` : "/members"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Profile" : "Back to Members"}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-secondary">
          {isEdit ? "Edit Member" : "Add Member"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isEdit
            ? `Update details for ${existingMember.fullName}`
            : "Fill in the member's details to add them to RMBF Erode United"}
        </p>
      </div>

      <MemberForm
        initialData={initialData}
        members={members}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Member" : "Save Member"}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
