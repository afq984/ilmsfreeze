import { error400, error404 } from "./errors";

// https://github.com/afq984/ilmsdump/blob/2ae39118b38c05f54e689d62bb245692269e5df3/ilmsserve/__init__.py#L377-L425
export const getRedirectLocation = (params: URLSearchParams): string => {
  const param = (key: string) => {
    const value = params.get(key);
    if (value === null) {
      throw error400(`missing required query parameter: ${key}`);
    }
    return value;
  };

  const courseID = param("courseID");
  const f = params.get("f") || "syllabus";
  switch (f) {
    case "syllabus":
      return `/course/${courseID}`;
    case "activity":
    case "news":
      return `/course/${courseID}/announcement/`;
    case "doclist":
      return `/course/${courseID}/material/`;
    case "forumlist":
      return `/course/${courseID}/discussion/`;
    case "hwlist":
      return `/course/${courseID}/homework/`;
    case "score":
    case "score_edit":
      return `/course/${courseID}/score`;
    case "group":
    case "grouplist":
    case "teamall":
    case "team_forumlist":
    case "team_memberlist":
    case "team_homework":
      return `/course/${courseID}/grouplist`;
    case "news_show":
      return `/course/${courseID}/announcement/${param("newsID")}`;
    case "doc":
      throw error404();
    case "forum":
      return `/course/${courseID}/discussion/${param("tid")}`;
    case "hw":
      return `/course/${courseID}/homework/${param("hw")}`;
    case "hw_doclist":
      return `/course/${courseID}/homework/${param("hw")}/submission/`;
    default:
      throw error404();
  }
};
