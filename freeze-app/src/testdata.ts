import {
  AnnouncementMeta,
  AttachmentMeta,
  CourseMeta,
  DiscussionMeta,
  GroupListMeta,
  HomeworkMeta,
  MaterialMeta,
  SubmissionMeta,
  VideoMeta,
} from "./types";

export const COURSE_74: CourseMeta = {
  id: 74,
  serial: "0001",
  is_admin: false,
  name: "iLMS平台線上客服專區",
};

export const COURSE_399: CourseMeta = {
  id: 399,
  serial: "09810CS140107",
  is_admin: false,
  name: "資訊系統應用Computer Systems & Applications",
};

export const COURSE_46274: CourseMeta = {
  id: 46274,
  serial: "10910CS542200",
  is_admin: false,
  name: "平行程式Parallel Programming",
};

export const COURSE_40596: CourseMeta = {
  id: 40596,
  serial: "10810CS542200",
  is_admin: false,
  name: "平行程式Parallel Programming",
};

export const COURSE_1808: CourseMeta = {
  id: 1808,
  serial: "09810BMES525100",
  is_admin: false,
  name: "藥物控制釋放Drug Controlled Release",
};

export const COURSE_359: CourseMeta = {
  id: 359,
  serial: "09810CL492400",
  is_admin: false,
  name: "敦煌學Dunhuang Studies",
};

export const COURSE_38353: CourseMeta = {
  id: 38353,
  serial: "10720FL300606",
  is_admin: false,
  name: "中級日語二Intermediate Japanese II",
};

export const COURSE_43492: CourseMeta = {
  id: 43492,
  serial: "10820CS542100",
  is_admin: false,
  name: "雲端計算Cloud Computing",
};

export const COURSE_43491: CourseMeta = {
  id: 43491,
  serial: "10820CS540300",
  is_admin: false,
  name: "高等程式語言Advanced Programming Languages",
};

export const COURSE_5430: CourseMeta = {
  id: 5430,
  serial: "09910TM200202",
  is_admin: false,
  name: "管理學Management",
};

export const COURSE_35305: CourseMeta = {
  id: 35305,
  serial: "10710CS542200",
  is_admin: false,
  name: "平行程式Parallel Programming",
};

export const ANNOUNCEMENT_2218728: AnnouncementMeta = {
  id: 2218728,
  title: "HW3 成績公佈",
  course: "Course-40596",
};

export const ATTACHMENT_2616319: AttachmentMeta = {
  id: 2616319,
  title: "announcement.txt",
  parent: "Announcement-2218728",
};

export const ATTACHMENT_2616320: AttachmentMeta = {
  id: 2616320,
  title: "announcement_updated.txt",
  parent: "Announcement-2218728",
};

export const ATTACHMENT_2616322: AttachmentMeta = {
  id: 2616322,
  title: "meta.json",
  parent: "Announcement-2218728",
};

export const ANNOUNCEMENT_2008652: AnnouncementMeta = {
  id: 2008652,
  title: "Final Project 分組",
  course: "Course-40596",
};

export const DISCUSSION_258543: DiscussionMeta = {
  id: 258543,
  title: "不能 srun - QOSMaxGRESMinutesPerJob",
  course: "Course-40596",
};

export const ATTACHMENT_2134734: AttachmentMeta = {
  id: 2134734,
  title: "hw4-2-QOSMaxGRESMinutesPerJob-srun.png",
  parent: "Discussion-258543",
};

export const ATTACHMENT_2134738: AttachmentMeta = {
  id: 2134738,
  title: "hw4-2-QOSMaxGRESMinutesPerJob.png",
  parent: "Discussion-258543",
};

export const DISCUSSION_236608: DiscussionMeta = {
  id: 236608,
  title: "誠徵final project組員",
  course: "Course-40596",
};

export const MATERIAL_2173495: MaterialMeta = {
  id: 2173495,
  title: "Chap12: Distributed Computing for DL",
  type: "Econtent",
  course: "Course-40596",
};

export const ATTACHMENT_2107249: AttachmentMeta = {
  id: 2107249,
  title: "Chap12_Distributed Computing for DL.pdf",
  parent: "Material-2173495",
};

export const MATERIAL_2004666: MaterialMeta = {
  id: 2004666,
  title: "Syllabus",
  type: "Econtent",
  course: "Course-40596",
};

export const MATERIAL_1518: MaterialMeta = {
  id: 1518,
  title: "PowerCam5 簡報錄影軟體",
  type: "Epowercam",
  course: "Course-74",
};

export const MATERIAL_2705536: MaterialMeta = {
  id: 2705536,
  title: "PDF 版本投影片＆作業",
  type: "Econtent",
  course: "Course-35305",
};

export const VIDEO_1518: VideoMeta = {
  id: 1518,
  url: "https://lms.nthu.edu.tw/sysdata/74/74/doc/f08b98ab0aeddfd0/video/video_hd.mp4",
};

export const HOMEWORK_198377: HomeworkMeta = {
  id: 198377,
  title: "Lab1: Platform Introduction & MPI",
  course: "Course-40596",
};

export const HOMEWORK_201015: HomeworkMeta = {
  id: 201015,
  title: "HW3: All-Pairs Shortest Path (CPU)",
  course: "Course-40596",
};

export const ATTACHMENT_2038513: AttachmentMeta = {
  id: 2038513,
  title: "PP2019_HW3.pdf",
  parent: "Homework-201015",
};

export const ATTACHMENT_2047732: AttachmentMeta = {
  id: 2047732,
  title: "PP2019_HW3_v2.pdf",
  parent: "Homework-201015",
};

export const HOMEWORK_200355: HomeworkMeta = {
  id: 200355,
  title: "Final Project",
  course: "Course-40596",
};

export const HOMEWORK_220144: HomeworkMeta = {
  id: 220144,
  title: "Slides for paper presentation",
  course: "Course-43492",
};

export const SUBMITTED_2474481: SubmissionMeta = {
  id: 2474481,
  title: "105062321",
  by: "陳弘欣",
  course: "Course-43492",
  comment: null,
};

export const ATTACHMENT_2406879: AttachmentMeta = {
  id: 2406879,
  title: "105062321.pdf",
  parent: "Submission-2474481",
};

export const HOMEWORK_18264: HomeworkMeta = {
  id: 18264,
  title: "第五章(G1)",
  course: "Course-5430",
};

export const SUBMISSION_59376: SubmissionMeta = {
  id: 59376,
  title: "管理學報告ppt_ch5",
  by: "第 1 組",
  course: "Course-5430",
  comment: null,
};

export const ATTACHMENT_49113: AttachmentMeta = {
  id: 49113,
  title: "管理學報告.pptx",
  parent: "Submission-59376",
};

export const HOMEWORK_182409: HomeworkMeta = {
  id: 182409,
  title: "第一次作業 日語動詞 た形 (指定歌曲)",
  course: "Course-38353",
};

export const HOMEWORK_183084: HomeworkMeta = {
  id: 183084,
  title: "第2次作業  L21課\u3000「~と思う／～と言う」相關句型的日語歌曲或新聞",
  course: "Course-38353",
};

export const GROUPLIST_40596: GroupListMeta = {
  course: "Course-40596",
};

export const HOMEWORK_32460: HomeworkMeta = {
  id: 32460,
  title: "HW3_ch8,ch9",
  course: "Course-7636",
};

export const ATTACHMENT_133807: AttachmentMeta = {
  id: 133807,
  title: "HW3.pdf",
  parent: "Homework-32460",
};

// export const ATTACHMENT_3847: AttachmentMeta = {
//   id: 3847,
//   title: 'ch04.ppt',
//   parent: null,
// }
