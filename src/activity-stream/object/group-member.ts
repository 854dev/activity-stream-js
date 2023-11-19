/**
 * Group Member
 * 비표준 확장
 *
 * TODO 그룹 가입기능 구현
 * @see AsGroup
 */
type GroupMemberRole = "viewer" | "member" | "admin";

export interface AsGroupMember {
  id: string;
  actor: string;
  createdAt: string;
  role: GroupMemberRole;
}
