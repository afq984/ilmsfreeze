import { clientsClaim } from "workbox-core";
import {
  RouteHandlerCallback,
  RouteHandlerCallbackOptions,
  RouteMatchCallback,
} from "workbox-core/types";
import { createPartialResponse } from "workbox-range-requests";
import { registerRoute } from "workbox-routing";
import { FileSystemDataSource, getSavedFilename } from "./data-source";

clientsClaim();

let dataSource: FileSystemDataSource | null = null;

addEventListener("message", (event) => {
  const data = event.data;
  switch (data.op) {
    case "set_root_handle":
      dataSource = new FileSystemDataSource(data.data);
      break;
  }
});

const makePathMatcher = (pathname: string): RouteMatchCallback => {
  return ({ url }) => {
    // Do we need to check this?
    return self.location.origin === url.origin && url.pathname === pathname;
  };
};

const makeRegexPathMatcher = (pattern: string): RouteMatchCallback => {
  const regexp = new RegExp(pattern);
  return ({ url }) => {
    if (self.location.origin !== url.origin) {
      return false;
    }
    return url.pathname.match(regexp);
  };
};

const handleStatus = async () => {
  return new Response(
    JSON.stringify({
      version: 1,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
registerRoute("/sw-status.json", handleStatus);

const maybeCreatePartialResponse = async (
  request: Request,
  response: Response
) => {
  if (request.headers.has("Range")) {
    return await createPartialResponse(request, response);
  }
  return response;
};

const handleAttachment: RouteHandlerCallback = async ({ params, request }) => {
  if (dataSource === null) {
    return new Response("no data source available", { status: 404 });
  }
  const id = parseInt((params as string[])[1]);
  const meta = await dataSource.getMeta("attachment", id);
  const file = await dataSource.get("attachment", id, getSavedFilename(meta));
  return maybeCreatePartialResponse(
    request,
    new Response(file, {
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURI(
          meta.title
        )}`,
      },
    })
  );
};
registerRoute(makeRegexPathMatcher("^/attachment/(\\d+)$"), handleAttachment);

const redirectAttachment = async (ctx: RouteHandlerCallbackOptions) => {
  const id = ctx.url.searchParams.get("id");
  if (id === null) {
    return new Response("query parameter id required", {
      status: 400,
    });
  }
  return Response.redirect(`/attachment/${id}`);
};
registerRoute(makePathMatcher("/sys/read_attach.php"), redirectAttachment);

const handleVideo: RouteHandlerCallback = async ({ params, request }) => {
  if (dataSource === null) {
    return new Response("no data source available", { status: 404 });
  }
  const id = parseInt((params as string[])[1]);
  const file = await dataSource.get("video", id, "video.mp4");
  return maybeCreatePartialResponse(
    request,
    new Response(file, {
      headers: {
        "Content-Type": "video/mp4",
      },
    })
  );
};
registerRoute(makeRegexPathMatcher("^/video/(\\d+)$"), handleVideo);

const handleCourse: RouteHandlerCallback = () => {
  return fetch("/");
};
registerRoute(makeRegexPathMatcher("^/course/"), handleCourse);
