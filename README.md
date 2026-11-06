# Pulse — Digital KPI Monitoring Dashboard

A responsive, dark-mode dashboard that brings organizational performance into one clear view. Pulse displays active users, system uptime, task completion, response time, network traffic, resource allocation, and team progress.

**Free and open source under the MIT License.** Start with a simulated demo or create a personal workspace with your own organization, teams, and manually entered KPI values. No account, build step, API key, or package installation is required.

[Open the dashboard](https://georgiarachel07.github.io/pulse-kpi-dashboard/) · [Source repository](https://github.com/georgiarachel07/pulse-kpi-dashboard)

Original repository established **2023** · Pulse dashboard updated **2026**. The original Git history is preserved.

## Make it yours

1. Open the live dashboard and select **Make it yours**.
2. Enter your organization and your name or role.
3. Enter active users, uptime, response time, traffic, and allocation figures.
4. Edit the team names and task counts. You can add or remove teams (1–12 total).
5. Select **Save my workspace**. Your data appears immediately and is saved in this browser when local storage is available. Personal workspaces use **manual data**, so demo updates never overwrite your figures.
6. To update figures later, reopen **Make it yours**. To return to the example, choose **Switch to demo**, then resume updates if wanted.
7. Select **Download my dashboard** in the About section. This generates one HTML file containing your current workspace and the dashboard code/styles. Keep it as a backup, edit it, or publish it on your own static host. CDN charts, icons, and fonts still need an internet connection.

Each visitor gets their own browser-local workspace. Changes do **not** edit this repository, change another visitor’s dashboard, or synchronize between teammates/devices. Clearing browser site data removes local settings. A download includes the values you export; only publish data you intend to share. If browser storage is blocked, the workspace works for the current session and a notice recommends downloading it.

For your own GitHub repository, use **Use this template** or fork the source, keep the license notice, and follow the deployment steps below. You can freely modify and redistribute the code under the MIT License.

## Features

- Personal workspace editor with validated names, task totals, and allocation figures.
- Browser-local saves and downloadable single-file dashboard copies.
- Four automatically updating demo KPI cards with explicit targets and status text.
- Chart.js line chart for inbound and outbound traffic, measured in Mb/s.
- Chart.js doughnut chart for compute, storage, network, and available capacity; allocations always total 100%.
- Team performance table with completed tasks, progress bars, and status labels.
- Simulated data refreshes every three seconds while the page is visible and updates are enabled.
- Pause/resume control and a choice of 60-second or three-minute traffic windows.
- CSV snapshot export containing the current metrics, sample timestamp, and team totals.
- Responsive sidebar navigation, layouts for mobile through desktop, and horizontal scrolling confined to the team table on narrow screens.
- Semantic HTML, skip link, keyboard focus indicators, labeled controls, chart text summaries, and status indicators that use words as well as color.
- Reduced-motion preferences start automatic updates paused; visitors can explicitly resume. Chart animations remain disabled.
- Text metrics remain usable if the Chart.js CDN is unavailable.

## Files

```text
pulse-kpi-dashboard/
├── index.html   # Semantic layout and pinned CDN dependencies
├── style.css    # Responsive dark theme and design tokens
├── script.js    # Simulation, charts, controls, and CSV export
├── README.md    # Setup, deployment, and project documentation
├── LICENSE      # MIT reuse and modification terms
└── website source code.txt # Current plain-text project guide
```

Keep the HTML, CSS, and JavaScript together in the repository root; retain LICENSE when redistributing. Asset URLs use `./` so they work under the `/pulse-kpi-dashboard/` GitHub Pages path.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in a modern browser such as Chrome, Edge, Firefox, or Safari.
3. Keep an internet connection available for Chart.js, Font Awesome icons, and Google Fonts. If fonts fail to load, system font fallbacks apply.
4. Watch the metrics update, try both traffic windows, pause/resume, and select **Export snapshot** to download a CSV file.

You can also serve this folder using any static web server. There are no JavaScript modules or build tools required. Generating a single-file download from the multi-file source uses same-origin fetch requests for CSS/JavaScript, so use the hosted site or a local static server for that feature; browsers may block those requests from file://. Previously generated single-file downloads can generate further copies without fetching local assets.

## Deploy free with GitHub Pages

GitHub Pages is available for public repositories on GitHub Free. You need repository administration permissions to configure it. See GitHub’s official [publishing source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

1. Open your `pulse-kpi-dashboard` repository on GitHub. For free hosting on GitHub Free, use a **public** repository.
2. Put `index.html`, `style.css`, `script.js`, and `README.md` in the **root of the `main` branch**. Replace the existing website files with these versions. In GitHub’s web interface, use **Add file → Upload files**, select the four files, and commit to `main` (or merge your upload pull request).
3. Open the repository’s **Settings** tab.
4. In the sidebar, select **Pages** under **Code and automation**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Under **Branch**, select **main**, choose **/(root)** as the folder, and select **Save**. If your default branch has a different name, select the branch containing the four files instead.
7. Wait for the Pages deployment to finish. Open the repository’s **Actions** tab to check the Pages build and deployment run if necessary.
8. Return to **Settings → Pages** and select **Visit site**. Unless you configure a custom domain, the project URL follows this format:

   ```text
   https://YOUR-GITHUB-USERNAME.github.io/pulse-kpi-dashboard/
   ```

9. Verify that the metric cards populate, both charts render, the pause button works, and CSV export downloads a file. Check the layout on a phone as well.

Future commits to the selected publishing branch automatically trigger another deployment. This project needs no custom workflow or build command. GitHub’s [site creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) provides additional details.

### Deployment troubleshooting

- **404:** Confirm the Pages run succeeded, the publishing branch and root folder are correct, and the entry file is named exactly `index.html` in lowercase. Use the exact URL shown in Pages settings.
- **Missing styles or behavior:** Keep `style.css` and `script.js` beside `index.html`, preserve filename capitalization, and hard-refresh the browser after deployment.
- **Charts missing:** Confirm your browser or network can reach `cdn.jsdelivr.net`. The dashboard shows a notice if Chart.js fails to load; text metrics still update.
- **Updates paused:** Select **Resume updates**. Reduced-motion preferences start the simulation paused, and background tabs suspend sampling until visible again.

## Why real-time KPI monitoring matters

A well-designed KPI dashboard reduces the effort needed to understand current performance. Instead of comparing separate spreadsheets and reports, teams can inspect a shared set of metrics, spot changes, and decide where to investigate.

| Audience | Practical use | Decision it supports |
| --- | --- | --- |
| Operations teams | Watch uptime and response time against service targets | Investigate degradation before it becomes a larger disruption |
| Engineering teams | Compare traffic with resource allocation | Identify potential capacity constraints and plan infrastructure changes |
| Team leads | Review completed tasks and teams needing attention | Rebalance work, remove blockers, and discuss realistic delivery plans |
| Organization leaders | Review performance in one consistent view | Set priorities and follow up on outcomes with shared context |
| Individual contributors | See progress and workload clearly | Coordinate handoffs and understand how their work contributes |

For example, rising traffic paired with increasing response time could prompt an investigation into capacity. Low task completion might signal blocked work or an unrealistic plan. These patterns are investigation cues, not proof of a cause; decisions still need context and discussion with the people doing the work.

The value depends on trustworthy inputs, meaningful targets, named metric owners, and consistent definitions. Frequent updates help with fast-moving operations; slower-moving strategic outcomes may be better reviewed weekly or monthly. Metrics should support learning and coordination rather than rank individuals without context.

## How the simulation works

`script.js` initializes 60 synthetic traffic samples and uses one `setInterval` timer with a three-second interval. History is bounded to 60 points, preventing unbounded memory growth. The selector displays the latest 20 or 60 samples. After a pause, samples retain their actual timestamps; no missing points are fabricated to fill the gap. Browser timers are best effort, so the time-window names describe nominal sampling windows.

Active-user change is measured against the first sample in the current browser session. Uptime is an illustrative percentage with a 99.90% target, and response time has a target below 250 ms. Task completion is calculated from the same team totals displayed in the table. Once every team completes its tasks, a new simulated work cycle begins. Resource categories sum to 100%, and allocated capacity excludes the available slice.

Reloading resets demo sample values. Personal workspace settings are saved in local storage; manual KPI values remain fixed until edited. Exported CSV files identify whether their figures are simulated or user-entered. This application does not send workspace data to an application backend. External assets are loaded from CDN providers.

## Connect real organizational data

Replace `createSample()` and the synthetic history initialization in `script.js` with a validated API integration. Real telemetry needs definitions such as the uptime measurement period, active-user observation window, and task-cycle boundaries. Keep a bounded history and provide loading, error, disconnected, and stale-data states with a last-successful-update timestamp. Update labels so they describe the actual source and sampling interval.

GitHub Pages hosts static files and cannot run a backend or store server-side secrets. Use a separate authenticated service for sensitive organizational metrics. Never put private API tokens or confidential data into a public repository or browser JavaScript. Configure CORS and authorization on your API. A production dashboard also needs appropriate access control and operational monitoring.

## Customize the design

- Change colors, surfaces, typography, and radii using the tokens at the top of `style.css`.
- Edit the workspace name, headings, and metric labels in `index.html`.
- Change teams, targets, or simulation bounds in `script.js`; keep matching labels and documentation in sync.
- If changing `INTERVAL_MS`, also update the initial history size, selector labels, and refresh descriptions to reflect the new sampling window.

The UI follows UI/UX Pro Max guidance for operations dashboards: dark surfaces, green status accents, data-focused typography, clear contrast, keyboard navigation, responsive grids, and user-controlled updates.

## Dependencies

- [Chart.js](https://www.chartjs.org/docs/latest/) 4.4.8 via jsDelivr — line and doughnut charts.
- [Font Awesome Free](https://fontawesome.com/) 6.7.2 via cdnjs — decorative icons.
- Fira Sans and Fira Code via Google Fonts — interface and numeric typography, with local fallbacks.

All application code is plain HTML, CSS, and JavaScript. External CDN assets require network access; this package is not an offline distribution of those libraries.

## License and project history

Copyright (c) 2023–2026 Georgia Rachel and contributors. The original HTML project dates to 2023; Pulse was introduced in 2026. The MIT License permits use, modification, redistribution, and commercial reuse subject to retaining its notice; see [LICENSE](./LICENSE). Third-party libraries and fonts retain their respective licenses.
