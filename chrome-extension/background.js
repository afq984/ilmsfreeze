const PHPSESSID_RULE_ID = 2;

const setSessionId = async (value) => {
  const updateRuleOptions = {
    removeRuleIds: [PHPSESSID_RULE_ID],
    addRules: [
      {
        id: PHPSESSID_RULE_ID,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "Cookie",
              operation: "set",
              value: `PHPSESSID=${value}; ck_locale=en-us`,
            },
          ],
        },
        condition: {
          domains: ["ilmsfreeze.afq984.org"],
          urlFilter: "||lms.nthu.edu.tw/",
          resourceTypes: ["xmlhttprequest"],
        },
      },
    ],
  };

  await chrome.declarativeNetRequest.updateSessionRules(updateRuleOptions);
  console.log("PHPSESSID updated");
};

const addCookiesOnStartup = async () => {
  const cookie = await chrome.cookies.get({
    name: "PHPSESSID",
    url: "https://lms.nthu.edu.tw",
  });
  if (cookie !== null) {
    await setSessionId(cookie.value);
  }
};

chrome.runtime.onStartup.addListener(addCookiesOnStartup);
chrome.runtime.onInstalled.addListener(addCookiesOnStartup);

const onCookieChanged = async ({ cookie, removed }) => {
  if (!removed && cookie.name == "PHPSESSID") {
    await setSessionId(cookie.value);
  }
};
chrome.cookies.onChanged.addListener(onCookieChanged);
