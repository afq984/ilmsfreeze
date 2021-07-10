export type ChildrenMap = { [key: string]: Array<number> };

export const parseChildren = (children: Array<string>) => {
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
  is_admin: string;
  name: string;
  children: Array<string>;
}
export interface AnnouncementMeta {
  id: number;
  title: string;
  course: string;
  children: Array<string>;
}

export interface MaterialMeta {
  id: number;
  title: string;
  type: string;
  course: string;
  children: Array<string>;
}

export interface DiscussionMeta {
  id: number;
  title: string;
  course: string;
  children: Array<string>;
}
