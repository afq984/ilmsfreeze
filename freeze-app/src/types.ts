export type ChildrenMap = { [key: string]: Array<number> };

export const parseChildren = (children?: Array<string>) => {
  if (children === undefined) {
    return {};
  }
  const result: ChildrenMap = {};
  for (const child of children) {
    const [camelTypeName, id] = child.split("-", 2);
    const typename = camelTypeName.toLocaleLowerCase();
    if (!(typename in result)) {
      result[typename] = [];
    }
    result[typename].push(parseInt(id));
  }
  return result;
};

export interface CourseMeta {
  id: number;
  serial: string;
  is_admin: boolean;
  name: string;
  children?: Array<string>;
}
export interface AnnouncementMeta {
  id: number;
  title: string;
  course: string;
  children?: Array<string>;
}

export interface MaterialMeta {
  id: number;
  title: string;
  type: string;
  course: string;
  children?: Array<string>;
}

export interface DiscussionMeta {
  id: number;
  title: string;
  course: string;
  children?: Array<string>;
}

export interface HomeworkMeta {
  id: number;
  title: string;
  course: string;
  children?: Array<string>;
}

export interface SubmissionMeta {
  id: number;
  title: string;
  by: string;
  course: string;
  comment: null | string;
  children?: Array<string>;
}

export interface AttachmentMeta {
  id: number;
  title: string;
  parent: string;
  saved_filename?: string;
  children?: Array<string>;
}

export interface GroupListMeta {
  course: string;
}

export interface VideoMeta {
  id: number;
  url: string;
}

export type Typename =
  | "Course"
  | "Announcement"
  | "Material"
  | "Discussion"
  | "Homework"
  | "Submission"
  | "Attachment"
  | "Grouplist"
  | "Video";

export const isTypename = (s: string): s is Typename => {
  return [
    "Course",
    "Announcement",
    "Material",
    "Discussion",
    "Homework",
    "Submission",
    "Attachment",
    "Grouplist",
    "Video",
  ].includes(s);
};

export type AnyMeta =
  | CourseMeta
  | AnnouncementMeta
  | MaterialMeta
  | DiscussionMeta
  | HomeworkMeta
  | SubmissionMeta
  | AttachmentMeta
  | GroupListMeta
  | VideoMeta;
