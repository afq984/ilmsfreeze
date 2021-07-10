import { Route } from "@vaadin/router";

export interface MenuItem {
  typename?: string;
  name: string;
  countable: boolean;
}

export type RouteEntry = MenuItem & Route;

export const menuItems: Array<RouteEntry> = [
  {
    name: "課程說明",
    countable: false,
    path: "/course/:course_id",
    component: "freeze-course",
  },
  {
    typename: "announcement",
    name: "公告",
    countable: true,
    path: "/course/:course_id/announcement",
    component: "freeze-course-announcements",
  },
  {
    typename: "material",
    name: "上課教材",
    countable: true,
    path: "/course/:course_id/material",
    component: "freeze-course-materials",
  },
  {
    typename: "discussion",
    name: "討論區",
    countable: true,
    path: "/course/:course_id/discussion",
    component: "freeze-course-discussions",
  },
  {
    typename: "homework",
    name: "作業",
    countable: true,
    path: "/course/:course_id/homework",
    component: "freeze-course-homeworks",
  },
  {
    typename: "score",
    name: "成績計算",
    countable: false,
    path: "/course/:course_id/score",
    component: "freeze-course-score",
  },
  {
    typename: "grouplist",
    name: "小組專區",
    countable: false,
    path: "/course/:course_id/grouplist",
    component: "freeze-course-grouplist",
  },
];

export const routes: Array<Route> = (
  [
    {
      path: "/",
      component: "freeze-browse",
    },
    {
      path: "/download",
      component: "freeze-download",
    },
  ] as Array<Route>
).concat(menuItems as Array<Route>);
