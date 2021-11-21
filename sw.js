try{self["workbox:core:6.2.4"]&&_()}catch(e){}const e=(()=>{"__WB_DISABLE_DEV_LOGS"in self||(self.__WB_DISABLE_DEV_LOGS=!1);let e=!1;const t={debug:"#7f8c8d",log:"#2ecc71",warn:"#f39c12",error:"#c0392b",groupCollapsed:"#3498db",groupEnd:null},r=function(r,a){if(self.__WB_DISABLE_DEV_LOGS)return;if("groupCollapsed"===r&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent))return void console[r](...a);const n=e?[]:["%cworkbox",[`background: ${t[r]}`,"border-radius: 0.5em","color: white","font-weight: bold","padding: 2px 0.5em"].join(";")];console[r](...n,...a),"groupCollapsed"===r&&(e=!0),"groupEnd"===r&&(e=!1)},a={},n=Object.keys(t);for(const e of n){const t=e;a[t]=(...e)=>{r(t,e)}}return a})(),t={"invalid-value":({paramName:e,validValueDescription:t,value:r})=>{if(!e||!t)throw new Error("Unexpected input to 'invalid-value' error.");return`The '${e}' parameter was given a value with an unexpected value. ${t} Received a value of ${JSON.stringify(r)}.`},"not-an-array":({moduleName:e,className:t,funcName:r,paramName:a})=>{if(!(e&&t&&r&&a))throw new Error("Unexpected input to 'not-an-array' error.");return`The parameter '${a}' passed into '${e}.${t}.${r}()' must be an array.`},"incorrect-type":({expectedType:e,paramName:t,moduleName:r,className:a,funcName:n})=>{if(!(e&&t&&r&&n))throw new Error("Unexpected input to 'incorrect-type' error.");return`The parameter '${t}' passed into '${r}.${a?`${a}.`:""}${n}()' must be of type ${e}.`},"incorrect-class":({expectedClassName:e,paramName:t,moduleName:r,className:a,funcName:n,isReturnValueProblem:s})=>{if(!e||!r||!n)throw new Error("Unexpected input to 'incorrect-class' error.");const o=a?`${a}.`:"";return s?`The return value from '${r}.${o}${n}()' must be an instance of class ${e}.`:`The parameter '${t}' passed into '${r}.${o}${n}()' must be an instance of class ${e}.`},"missing-a-method":({expectedMethod:e,paramName:t,moduleName:r,className:a,funcName:n})=>{if(!(e&&t&&r&&a&&n))throw new Error("Unexpected input to 'missing-a-method' error.");return`${r}.${a}.${n}() expected the '${t}' parameter to expose a '${e}' method.`},"add-to-cache-list-unexpected-type":({entry:e})=>`An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(e)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`,"add-to-cache-list-conflicting-entries":({firstEntry:e,secondEntry:t})=>{if(!e||!t)throw new Error("Unexpected input to 'add-to-cache-list-duplicate-entries' error.");return`Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${e} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`},"plugin-error-request-will-fetch":({thrownErrorMessage:e})=>{if(!e)throw new Error("Unexpected input to 'plugin-error-request-will-fetch', error.");return`An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${e}'.`},"invalid-cache-name":({cacheNameId:e,value:t})=>{if(!e)throw new Error("Expected a 'cacheNameId' for error 'invalid-cache-name'");return`You must provide a name containing at least one character for setCacheDetails({${e}: '...'}). Received a value of '${JSON.stringify(t)}'`},"unregister-route-but-not-found-with-method":({method:e})=>{if(!e)throw new Error("Unexpected input to 'unregister-route-but-not-found-with-method' error.");return`The route you're trying to unregister was not  previously registered for the method type '${e}'.`},"unregister-route-route-not-registered":()=>"The route you're trying to unregister was not previously registered.","queue-replay-failed":({name:e})=>`Replaying the background sync queue '${e}' failed.`,"duplicate-queue-name":({name:e})=>`The Queue name '${e}' is already being used. All instances of backgroundSync.Queue must be given unique names.`,"expired-test-without-max-age":({methodName:e,paramName:t})=>`The '${e}()' method can only be used when the '${t}' is used in the constructor.`,"unsupported-route-type":({moduleName:e,className:t,funcName:r,paramName:a})=>`The supplied '${a}' parameter was an unsupported type. Please check the docs for ${e}.${t}.${r} for valid input types.`,"not-array-of-class":({value:e,expectedClass:t,moduleName:r,className:a,funcName:n,paramName:s})=>`The supplied '${s}' parameter must be an array of '${t}' objects. Received '${JSON.stringify(e)},'. Please check the call to ${r}.${a}.${n}() to fix the issue.`,"max-entries-or-age-required":({moduleName:e,className:t,funcName:r})=>`You must define either config.maxEntries or config.maxAgeSecondsin ${e}.${t}.${r}`,"statuses-or-headers-required":({moduleName:e,className:t,funcName:r})=>`You must define either config.statuses or config.headersin ${e}.${t}.${r}`,"invalid-string":({moduleName:e,funcName:t,paramName:r})=>{if(!r||!e||!t)throw new Error("Unexpected input to 'invalid-string' error.");return`When using strings, the '${r}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${e}.${t}() for more info.`},"channel-name-required":()=>"You must provide a channelName to construct a BroadcastCacheUpdate instance.","invalid-responses-are-same-args":()=>"The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.","expire-custom-caches-only":()=>"You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.","unit-must-be-bytes":({normalizedRangeHeader:e})=>{if(!e)throw new Error("Unexpected input to 'unit-must-be-bytes' error.");return`The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${e}"`},"single-range-only":({normalizedRangeHeader:e})=>{if(!e)throw new Error("Unexpected input to 'single-range-only' error.");return`Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${e}"`},"invalid-range-values":({normalizedRangeHeader:e})=>{if(!e)throw new Error("Unexpected input to 'invalid-range-values' error.");return`The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${e}"`},"no-range-header":()=>"No Range header was found in the Request provided.","range-not-satisfiable":({size:e,start:t,end:r})=>`The start (${t}) and end (${r}) values in the Range are not satisfiable by the cached response, which is ${e} bytes.`,"attempt-to-cache-non-get-request":({url:e,method:t})=>`Unable to cache '${e}' because it is a '${t}' request and only 'GET' requests can be cached.`,"cache-put-with-no-response":({url:e})=>`There was an attempt to cache '${e}' but the response was not defined.`,"no-response":({url:e,error:t})=>{let r=`The strategy could not generate a response for '${e}'.`;return t&&(r+=` The underlying error is ${t}.`),r},"bad-precaching-response":({url:e,status:t})=>`The precaching request for '${e}' failed`+(t?` with an HTTP status of ${t}.`:"."),"non-precached-url":({url:e})=>`createHandlerBoundToURL('${e}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`,"add-to-cache-list-conflicting-integrities":({url:e})=>`Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${e} with different integrity values. Please remove one of them.`,"missing-precache-entry":({cacheName:e,url:t})=>`Unable to find a precached response in ${e} for ${t}.`,"cross-origin-copy-response":({origin:e})=>`workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${e}.`},r=(e,r={})=>{const a=t[e];if(!a)throw new Error(`Unable to find message for code '${e}'.`);return a(r)};class a extends Error{constructor(e,t){super(r(e,t)),this.name=e,this.details=t}}const n=(e,t,r)=>{if("function"!==typeof e[t])throw r.expectedMethod=t,new a("missing-a-method",r)},s=(e,t,r)=>{if(!(e instanceof t))throw r.expectedClassName=t.name,new a("incorrect-class",r)},o=(e,t,r)=>{if(!t.includes(e))throw r.validValueDescription=`Valid values are ${JSON.stringify(t)}.`,new a("invalid-value",r)},i=(e,t,r)=>{if(typeof e!==t)throw r.expectedType=t,new a("incorrect-type",r)};"undefined"!=typeof registration&&registration.scope;const c=e=>new URL(String(e),location.href).href.replace(new RegExp(`^${location.origin}`),"");try{self["workbox:range-requests:6.2.4"]&&_()}catch(e){}async function u(t,r){try{if(s(t,Request,{moduleName:"workbox-range-requests",funcName:"createPartialResponse",paramName:"request"}),s(r,Response,{moduleName:"workbox-range-requests",funcName:"createPartialResponse",paramName:"originalResponse"}),206===r.status)return r;const e=t.headers.get("range");if(!e)throw new a("no-range-header");const n=function(e){i(e,"string",{moduleName:"workbox-range-requests",funcName:"parseRangeHeader",paramName:"rangeHeader"});const t=e.trim().toLowerCase();if(!t.startsWith("bytes="))throw new a("unit-must-be-bytes",{normalizedRangeHeader:t});if(t.includes(","))throw new a("single-range-only",{normalizedRangeHeader:t});const r=/(\d*)-(\d*)/.exec(t);if(!r||!r[1]&&!r[2])throw new a("invalid-range-values",{normalizedRangeHeader:t});return{start:""===r[1]?void 0:Number(r[1]),end:""===r[2]?void 0:Number(r[2])}}(e),o=await r.blob(),c=function(e,t,r){s(e,Blob,{moduleName:"workbox-range-requests",funcName:"calculateEffectiveBoundaries",paramName:"blob"});const n=e.size;if(r&&r>n||t&&t<0)throw new a("range-not-satisfiable",{size:n,end:r,start:t});let o,i;return void 0!==t&&void 0!==r?(o=t,i=r+1):void 0!==t&&void 0===r?(o=t,i=n):void 0!==r&&void 0===t&&(o=n-r,i=n),{start:o,end:i}}(o,n.start,n.end),u=o.slice(c.start,c.end),l=u.size,d=new Response(u,{status:206,statusText:"Partial Content",headers:r.headers});return d.headers.set("Content-Length",String(l)),d.headers.set("Content-Range",`bytes ${c.start}-${c.end-1}/${o.size}`),d}catch(a){return e.warn("Unable to construct a partial response; returning a 416 Range Not Satisfiable response instead."),e.groupCollapsed("View details here."),e.log(a),e.log(t),e.log(r),e.groupEnd(),new Response("",{status:416,statusText:"Range Not Satisfiable"})}}try{self["workbox:routing:6.2.4"]&&_()}catch(e){}const l=["DELETE","GET","HEAD","PATCH","POST","PUT"],d=e=>e&&"object"==typeof e?(n(e,"handle",{moduleName:"workbox-routing",className:"Route",funcName:"constructor",paramName:"handler"}),e):(i(e,"function",{moduleName:"workbox-routing",className:"Route",funcName:"constructor",paramName:"handler"}),{handle:e});class h{constructor(e,t,r="GET"){i(e,"function",{moduleName:"workbox-routing",className:"Route",funcName:"constructor",paramName:"match"}),r&&o(r,l,{paramName:"method"}),this.handler=d(t),this.match=e,this.method=r}setCatchHandler(e){this.catchHandler=d(e)}}class m extends h{constructor(t,r,a){s(t,RegExp,{moduleName:"workbox-routing",className:"RegExpRoute",funcName:"constructor",paramName:"pattern"});super((({url:r})=>{const a=t.exec(r.href);if(a){if(r.origin===location.origin||0===a.index)return a.slice(1);e.debug(`The regular expression '${t.toString()}' only partially matched against the cross-origin URL '${r.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`)}}),r,a)}}class p{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,r=this.handleRequest({request:t,event:e});r&&e.respondWith(r)}))}addCacheListener(){self.addEventListener("message",(t=>{if(t.data&&"CACHE_URLS"===t.data.type){const{payload:r}=t.data;e.debug("Caching URLs from the window",r.urlsToCache);const a=Promise.all(r.urlsToCache.map((e=>{"string"==typeof e&&(e=[e]);const r=new Request(...e);return this.handleRequest({request:r,event:t})})));t.waitUntil(a),t.ports&&t.ports[0]&&a.then((()=>t.ports[0].postMessage(!0)))}}))}handleRequest({request:t,event:r}){s(t,Request,{moduleName:"workbox-routing",className:"Router",funcName:"handleRequest",paramName:"options.request"});const a=new URL(t.url,location.href);if(!a.protocol.startsWith("http"))return void e.debug("Workbox Router only supports URLs that start with 'http'.");const n=a.origin===location.origin,{params:o,route:i}=this.findMatchingRoute({event:r,request:t,sameOrigin:n,url:a});let u=i&&i.handler;const l=[];u&&(l.push(["Found a route to handle this request:",i]),o&&l.push(["Passing the following params to the route's handler:",o]));const d=t.method;if(!u&&this._defaultHandlerMap.has(d)&&(l.push(`Failed to find a matching route. Falling back to the default handler for ${d}.`),u=this._defaultHandlerMap.get(d)),!u)return void e.debug(`No route found for: ${c(a)}`);let h;e.groupCollapsed(`Router is responding to: ${c(a)}`),l.forEach((t=>{Array.isArray(t)?e.log(...t):e.log(t)})),e.groupEnd();try{h=u.handle({url:a,request:t,event:r,params:o})}catch(e){h=Promise.reject(e)}const m=i&&i.catchHandler;return h instanceof Promise&&(this._catchHandler||m)&&(h=h.catch((async n=>{if(m){e.groupCollapsed(`Error thrown when responding to:  ${c(a)}. Falling back to route's Catch Handler.`),e.error("Error thrown by:",i),e.error(n),e.groupEnd();try{return await m.handle({url:a,request:t,event:r,params:o})}catch(e){e instanceof Error&&(n=e)}}if(this._catchHandler)return e.groupCollapsed(`Error thrown when responding to:  ${c(a)}. Falling back to global Catch Handler.`),e.error("Error thrown by:",i),e.error(n),e.groupEnd(),this._catchHandler.handle({url:a,request:t,event:r});throw n}))),h}findMatchingRoute({url:t,sameOrigin:r,request:a,event:n}){const s=this._routes.get(a.method)||[];for(const o of s){let s;const i=o.match({url:t,sameOrigin:r,request:a,event:n});if(i)return i instanceof Promise&&e.warn(`While routing ${c(t)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`,o),s=i,(Array.isArray(s)&&0===s.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(s=void 0),{route:o,params:s}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,d(e))}setCatchHandler(e){this._catchHandler=d(e)}registerRoute(e){i(e,"object",{moduleName:"workbox-routing",className:"Router",funcName:"registerRoute",paramName:"route"}),n(e,"match",{moduleName:"workbox-routing",className:"Router",funcName:"registerRoute",paramName:"route"}),i(e.handler,"object",{moduleName:"workbox-routing",className:"Router",funcName:"registerRoute",paramName:"route"}),n(e.handler,"handle",{moduleName:"workbox-routing",className:"Router",funcName:"registerRoute",paramName:"route.handler"}),i(e.method,"string",{moduleName:"workbox-routing",className:"Router",funcName:"registerRoute",paramName:"route.method"}),this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new a("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new a("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let g;const f=()=>(g||(g=new p,g.addFetchListener(),g.addCacheListener()),g);function w(t,r,n){let s;if("string"==typeof t){const o=new URL(t,location.href);{if(!t.startsWith("/")&&!t.startsWith("http"))throw new a("invalid-string",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});const r=t.startsWith("http")?o.pathname:t,n="[*:?+]";new RegExp(`${n}`).exec(r)&&e.debug(`The '$capture' parameter contains an Express-style wildcard character (${n}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`)}s=new h((({url:r})=>(r.pathname===o.pathname&&r.origin!==o.origin&&e.debug(`${t} only partially matches the cross-origin URL ${r.toString()}. This route will only handle cross-origin requests if they match the entire URL.`),r.href===o.href)),r,n)}else if(t instanceof RegExp)s=new m(t,r,n);else if("function"==typeof t)s=new h(t,r,n);else{if(!(t instanceof h))throw new a("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});s=t}return f().registerRoute(s),s}class y extends Error{constructor(e,t){super(t),this.title=e,Object.setPrototypeOf(this,y.prototype)}}const $=(e="Page not found")=>new y("404",e),b=new y("╰(⊙д⊙)╮","Open a directory to get started");new y("╭(⊙д⊙)╯",b.message);const N=e=>new y("ヽ(´ー｀)┌",e),v=e=>N(`Bad data source: ${e}`),R=e=>{throw console.warn(e),v(`"${e}"`)};class x{async getText(e,t,r){const a=await this.get(e,t,r);return await a.text()}async getJson(e,t,r){const a=await this.getText(e,t,r);try{return JSON.parse(a)}catch(e){R(e)}}async getMeta(e,t){return await this.getJson(e,t,"meta.json")}async getMetas(e,t){if(void 0===t)return[];const r=[];for(const a of t)r.push(await this.getMeta(e,a));return r}}const E=e=>e instanceof Error&&"NotFoundError"===e.name,T=async(e,t)=>{try{return await e}catch(e){if(E(e))throw t();throw e}};class q extends x{constructor(e){super(),this.rootHandle=e}async header(){return null}get name(){return this.rootHandle.name}async get(e,t,r){const a=await T(this.rootHandle.getDirectoryHandle(e),(()=>v(`missing directory "${e}"`))),n=await T(a.getDirectoryHandle(t.toString()),(()=>$(`${e} not found`))),s=await T(n.getFileHandle(r),(()=>v(`missing file ${e}/${n}/${r}`)));return await s.getFile()}async getAllMeta(e){const t=[],r=await T(this.rootHandle.getDirectoryHandle(e),(()=>v(`missing directory "${e}"`)));for await(const a of r.values()){if("directory"!==a.kind)continue;const r=a.getFileHandle("meta.json");try{await r}catch(t){if(E(t)){console.warn(`missing meta.json for ${e}/${a.name}`);continue}throw t}const n=await(await r).getFile(),s=JSON.parse(await n.text());t.push(s)}return t}}class k extends x{constructor(e){super(),this.baseURL=e}get name(){return this.baseURL}async header(){const e=await this.fetch("source.json");try{return(await e.json()).header}catch(e){R(e)}return null}async fetch(e){const t=new URL(e,this.baseURL).toString();let r;try{r=await fetch(t)}catch(e){R(e)}if(r=r,200!==r.status)throw new y(r.status.toString(),`${t} ${r.statusText}`);return r}async get(e,t,r){const a=await this.fetch(`${e}/${t}/${r}`);return await a.blob()}async getAllMeta(e){const t=await this.fetch(`${e}/all.json`);try{return await t.json()}catch(e){R(e)}}}self.addEventListener("activate",(()=>self.clients.claim()));let L=null;self.addEventListener("message",(e=>{const t=e.data;switch(t.op){case"set_data_source":r=t.data,L="FileSystemDataSource"===r.ty?new q(r.data):"RemoteDataSource"==r.ty?new k(r.data):null,console.log(`service worker received data source: ${null==L?void 0:L.name}`);break;case"take_over":self.skipWaiting()}var r})),self.addEventListener("activate",(()=>{console.log("service worker activated!")}));const U=e=>({url:t})=>self.location.origin===t.origin&&t.pathname===e,C=e=>{const t=new RegExp(e);return({url:e})=>self.location.origin===e.origin&&e.pathname.match(t)};w("/sw-status.json",(async()=>new Response(JSON.stringify({version:1}),{headers:{"Content-Type":"application/json"}})));const H=async(e,t)=>e.headers.has("Range")?await u(e,t):t;w(C("^/attachment/(\\d+)$"),(async({params:e,request:t})=>{if(null===L)return new Response("no data source available",{status:404});const r=parseInt(e[1]),a=await L.getMeta("attachment",r),n=await L.get("attachment",r,(e=>void 0!==e.saved_filename?e.saved_filename:"meta.json"===e.title?"meta_.json":e.title)(a));return H(t,new Response(n,{headers:{"Content-Disposition":`attachment; filename*=UTF-8''${encodeURI(a.title)}`}}))}));w(U("/sys/read_attach.php"),(async e=>{const t=e.url.searchParams.get("id");return null===t?new Response("query parameter id required",{status:400}):Response.redirect(`/attachment/${t}`)}));w(C("^/video/(\\d+)$"),(async({params:e,request:t})=>{if(null===L)return new Response("no data source available",{status:404});const r=parseInt(e[1]),a=await L.get("video",r,"video.mp4");return H(t,new Response(a,{headers:{"Content-Type":"video/mp4"}}))}));const S=()=>fetch("/");w(C("^/course/"),S),w(U("/download"),S);w(U("/course.php"),(async({url:e})=>{let t;try{t=(e=>{const t=t=>{const r=e.get(t);if(null===r)throw N(`missing required query parameter: ${t}`);return r},r=t("courseID");switch(e.get("f")||"syllabus"){case"syllabus":return`/course/${r}`;case"activity":case"news":return`/course/${r}/announcement/`;case"doclist":return`/course/${r}/material/`;case"forumlist":return`/course/${r}/discussion/`;case"hwlist":return`/course/${r}/homework/`;case"score":case"score_edit":return`/course/${r}/score`;case"group":case"grouplist":case"teamall":case"team_forumlist":case"team_memberlist":case"team_homework":return`/course/${r}/grouplist`;case"news_show":return`/course/${r}/announcement/${t("newsID")}`;default:throw $();case"forum":return`/course/${r}/discussion/${t("tid")}`;case"hw":return`/course/${r}/homework/${t("hw")}`;case"hw_doclist":return`/course/${r}/homework/${t("hw")}/submission/`}})(e.searchParams)}catch(e){if(e instanceof y)return new Response(e.message,{status:"404"===e.title?404:400});throw e}return Response.redirect(t)}));
//# sourceMappingURL=sw.js.map
