import { Commands, Context, Route, Router } from "@vaadin/router";
import { FileSystemDataSource } from "./data-source";

export interface MenuItem {
  typename?: string;
  displayname: string;
  countable: boolean;
}

export type RouteEntry = MenuItem & Route;

export const menuItemAnnouncement = {
  typename: "announcement",
  displayname: "公告",
  countable: true,
  path: "/course/:course_id/announcement/",
  component: "freeze-course-announcements",
};

export const menuItemMaterial = {
  typename: "material",
  displayname: "上課教材",
  countable: true,
  path: "/course/:course_id/material/",
  component: "freeze-course-materials",
};
export const menuItemDiscussion = {
  typename: "discussion",
  displayname: "討論區",
  countable: true,
  path: "/course/:course_id/discussion/",
  component: "freeze-course-discussions",
};
export const menuItemHomework = {
  typename: "homework",
  displayname: "作業",
  countable: true,
  path: "/course/:course_id/homework/",
  component: "freeze-course-homeworks",
};
export const menuItemScore = {
  typename: "score",
  displayname: "成績計算",
  countable: false,
  path: "/course/:course_id/score/",
  component: "freeze-course-score",
};
export const menuItemGrouplist = {
  typename: "grouplist",
  displayname: "小組專區",
  countable: false,
  path: "/course/:course_id/grouplist/",
  component: "freeze-course-grouplist",
};

export const menuItems: Array<RouteEntry> = [
  {
    displayname: "課程說明",
    countable: false,
    path: "/course/:course_id",
    component: "freeze-course",
  },
  menuItemAnnouncement,
  menuItemMaterial,
  menuItemDiscussion,
  menuItemHomework,
  menuItemScore,
  menuItemGrouplist,
];

const actionOpenBlank = (ctx: Context, commands: Commands) => {
  window.open(ctx.pathname + ctx.search);
  return commands.prevent();
};

export const routes: Array<Route> = (
  [
    {
      path: "/",
      component: "freeze-index",
    },
    {
      path: "/course/",
      component: "freeze-browse",
    },
    {
      path: "/download",
      component: "freeze-download",
    },
    {
      path: "/course/:course_id/announcement/:announcement_id",
      component: "freeze-announcement",
    },
    {
      path: "/course/:course_id/material/:material_id",
      component: "freeze-material",
    },
    {
      path: "/course/:course_id/discussion/:discussion_id",
      component: "freeze-discussion",
    },
    {
      path: "/course/:course_id/homework/:homework_id",
      component: "freeze-homework",
    },
    {
      path: "/course/:course_id/homework/:homework_id/submission/",
      component: "freeze-homework-submissions",
    },
    {
      path: "/course/:course_id/homework/:homework_id/submission/:submittedhomework_id",
      component: "freeze-submission",
    },
    {
      path: "/attachment/(.*)",
      action: actionOpenBlank,
    },
    {
      path: "/sys/read_attach.php(.*)",
      action: actionOpenBlank,
    },
  ] as Array<Route>
).concat(menuItems as Array<Route>, [
  {
    path: "(.*)",
    component: "freeze-404",
  },
]);

export class RouterSource extends Router {
  dataSource?: FileSystemDataSource;
}
