export const applicationStatusLabel: Record<string, string> = {
  PENDING: "รอตรวจสอบ",
  REVIEWING: "กำลังพิจารณา",
  INTERVIEW: "นัดสัมภาษณ์",
  OFFERED: "เสนองาน",
  REJECTED: "ไม่ผ่านการคัดเลือก",
  HIRED: "ได้รับการว่าจ้าง",
  RETURNED: "ตีกลับให้แก้ไข",
};

export const languageLevelLabel: Record<string, string> = {
  NONE: "-",
  BASIC: "พื้นฐาน",
  INTERMEDIATE: "ปานกลาง",
  ADVANCED: "ดี",
  FLUENT: "คล่องแคล่ว",
};

export const jobStatusLabel: Record<string, string> = {
  OPEN: "เปิดรับสมัคร",
  CLOSED: "ปิดรับสมัคร",
};

export const employmentTypeLabel: Record<string, string> = {
  FULL_TIME: "งานประจำ",
  PART_TIME: "พาร์ทไทม์",
  CONTRACT: "สัญญาจ้าง",
  INTERNSHIP: "ฝึกงาน",
};

export const userRoleLabel: Record<string, string> = {
  SUPER_ADMIN: "ผู้ดูแลระบบสูงสุด",
  ADMIN: "ผู้ดูแลระบบ",
  HR: "ฝ่ายบุคคล",
  APPLICANT: "ผู้สมัคร",
};

export const documentCategoryLabel: Record<string, string> = {
  RESUME: "เรซูเม่",
  PORTFOLIO: "ผลงาน",
  CERTIFICATE: "ใบรับรอง",
  OTHER: "อื่นๆ",
};
