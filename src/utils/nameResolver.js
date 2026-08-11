export function resolveMemberName(record, type = "from", members = []) {
  if (!record) return "N/A";

  const isFrom = type === "from";

  // 1. Direct name field candidates
  const candidateNames = isFrom
    ? [
        record.fromName,
        record.fromMemberName,
        record.fromUserName,
        record.from_name,
        record.from_member_name,
        record.from_user_name,
        typeof record.fromUser === "string" ? record.fromUser : record.fromUser?.name || record.fromUser?.fullName,
        typeof record.fromMember === "string" ? record.fromMember : record.fromMember?.name || record.fromMember?.fullName,
        record.giverName,
        record.from,
      ]
    : [
        record.toName,
        record.toMemberName,
        record.toUserName,
        record.to_name,
        record.to_member_name,
        record.to_user_name,
        typeof record.toUser === "string" ? record.toUser : record.toUser?.name || record.toUser?.fullName,
        typeof record.toMember === "string" ? record.toMember : record.toMember?.name || record.toMember?.fullName,
        record.receiverName,
        record.to,
      ];

  for (const name of candidateNames) {
    if (typeof name === "string" && name.trim().length > 0) {
      return name.trim();
    }
  }

  // 2. Foreign key lookup in members array
  const candidateIds = isFrom
    ? [record.fromUserId, record.fromMemberId, record.fromId, record.from_user_id, record.from_member_id, record.giverId]
    : [record.toUserId, record.toMemberId, record.toId, record.to_user_id, record.to_member_id, record.receiverId];

  for (const id of candidateIds) {
    if (id && Array.isArray(members)) {
      const match = members.find((m) => m.id === id || m.uid === id || m.ridNo === id);
      if (match) {
        const foundName = match.fullName || match.name || match.displayName;
        if (foundName && foundName.trim().length > 0) {
          return foundName.trim();
        }
      }
    }
  }

  return "N/A";
}

export function resolveMemberId(record, type = "from") {
  if (!record) return null;
  const isFrom = type === "from";
  const candidateIds = isFrom
    ? [record.fromUserId, record.fromMemberId, record.fromId, record.from_user_id, record.from_member_id, record.giverId]
    : [record.toUserId, record.toMemberId, record.toId, record.to_user_id, record.to_member_id, record.receiverId];

  for (const id of candidateIds) {
    if (id) return id;
  }
  return null;
}
