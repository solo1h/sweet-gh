const gitCliFetchPR = () => {
  const currentUrl = window.location.href;
  const regex = /\/pull\/\d+$/;
  if (regex.test(currentUrl) !== true) return;

  const baseRefElement = document.querySelector(".base-ref");
  const headRefElements = document.querySelectorAll("span.head-ref");
  if (!baseRefElement || headRefElements.length === 0) return;

  let baseUser = null;
  let baseRef = baseRefElement.textContent.trim();
  let headUser = null;
  let headRef = headRefElements[0].textContent.trim();

  if (baseRef.indexOf(':') > -1) {
    [baseUser, baseRef] = baseRef.split(":", 2);
  }
  if (headRef.indexOf(':') > -1) {
    [headUser, headRef] = headRef.split(":", 2);
  }

  const forkName = headRefElements[0]
    .getAttribute("title")
    .split("/", 2)[1]
    .split(":", 2)[0];
  const forkOrigin = `fork-${headUser}`;

  let gitCliCommands;
  if (baseUser !== headUser) {
    const remoteAdd = `git remote add ${forkOrigin} git@github.com:${headUser}/${forkName}.git`;
    const fetch = `git fetch ${forkOrigin} ${headRef}`;
    const checkout = `git checkout ${headRef}`;
    gitCliCommands = `${remoteAdd} && ${fetch} && ${checkout}`;
  } else {
    gitCliCommands = `git fetch origin ${headRef} && git checkout ${headRef}`;
  }

  const container = document.createElement("div");
  container.className =
    "d-flex flex-items-center flex-wrap mt-0 gh-header-meta";
  container.innerHTML = `
    <div class="flex-auto min-width-0 mb-2">
      <span>Fetch PR with git:</span>
      <span title="${gitCliCommands}" class="commit-ref css-truncate user-select-contain expandable">
        <span class="css-truncate-target">${gitCliCommands}</span>
      </span>
      <span data-view-component="true">
        <clipboard-copy aria-label="Copy" data-copy-feedback="Copied!" value="${gitCliCommands}" data-view-component="true" class="Link--onHover js-copy-branch color-fg-muted d-inline-block ml-1" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
          </svg>
          <svg style="display: none;" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
          </svg>
        </clipboard-copy>
        <div aria-live="polite" aria-atomic="true" class="sr-only" data-clipboard-copy-feedback=""></div>
      </span>
    </div>`;

  const targetContainer = document.querySelector(
    ".non-sticky-header-container",
  );
  if (targetContainer) {
    targetContainer.appendChild(container);
  }
};

gitCliFetchPR();
