# Pulse — Digital KPI Monitoring Dashboard

A responsive, dark-mode dashboard that brings organizational performance into one clear view. Pulse displays active users, system uptime, task completion, response time, network traffic, resource allocation, and team progress.

**This is a working frontend demonstration. Every value is simulated in your browser; it does not monitor a real organization or connect to a backend.** The fictional workspace is named Northstar Organization. No account, build step, API key, or package installation is required.

## Features

- Four automatically updating KPI cards with explicit targets and status text.
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
HTML-website/
├── index.html   # Semantic layout and pinned CDN dependencies
├── style.css    # Responsive dark theme and design tokens
├── script.js    # Simulation, charts, controls, and CSV export
└── README.md    # Setup, deployment, and project documentation
```

Keep all four files together in the repository root. Asset URLs use `./` so they work under the `/HTML-website/` GitHub Pages path.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in a modern browser such as Chrome, Edge, Firefox, or Safari.
3. Keep an internet connection available for Chart.js, Font Awesome icons, and Google Fonts. If fonts fail to load, system font fallbacks apply.
4. Watch the metrics update, try both traffic windows, pause/resume, and select **Export snapshot** to download a CSV file.

You can also serve this folder using any static web server. There are no JavaScript modules, fetch requests, or build tools required for this demo.

## Deploy free with GitHub Pages

GitHub Pages is available for public repositories on GitHub Free. You need repository administration permissions to configure it. See GitHub’s official [publishing source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

1. Open your `HTML-website` repository on GitHub. For free hosting on GitHub Free, use a **public** repository.
2. Put `index.html`, `style.css`, `script.js`, and `README.md` in the **root of the `main` branch**. Replace the existing website files with these versions. In GitHub’s web interface, use **Add file → Upload files**, select the four files, and commit to `main` (or merge your upload pull request).
3. Open the repository’s **Settings** tab.
4. In the sidebar, select **Pages** under **Code and automation**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Under **Branch**, select **main**, choose **/(root)** as the folder, and select **Save**. If your default branch has a different name, select the branch containing the four files instead.
7. Wait for the Pages deployment to finish. Open the repository’s **Actions** tab to check the Pages build and deployment run if necessary.
8. Return to **Settings → Pages** and select **Visit site**. Unless you configure a custom domain, the project URL follows this format:

   ```text
   https://YOUR-GITHUB-USERNAME.github.io/HTML-website/
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

Reloading resets the demo. Data is not saved, transmitted to an application backend, or shared between viewers. The exported CSV is explicitly marked as simulated.

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
