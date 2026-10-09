---
name: video-recommendation
description: Recommend Nabit videos for a user's product and saved interests, produce scheduled daily digests, and save explicit video feedback.
---

Use the connected Nabit MCP tools. Keep recommendations grounded in returned titles, reasons, sources and URLs. The connected credential identifies one account and one product. Never ask for a bearer token in chat.

## Connection comes first

Look for `get_connection_status` in the available tools, with at most one targeted discovery lookup. If it is available, check the connection first. Keep recommendations paused until a live connection is confirmed; do not announce that references are being fetched earlier.

For a normal interactive request, if tools are missing or authorization is rejected, read [setup](../setup/SKILL.md) and perform its **Interactive connection startup**. A direct plugin invocation counts as a request to get started: use a callable native connection action, or execute `codex mcp login nabit` when shell access is available. Do not end by merely giving the user that command when you can run it. The user still signs in, selects the product and approves permissions. Start at most one authorization attempt; only show manual instructions if execution is unavailable or denied. Network/service errors are not a reason to keep asking for new authorization.

For a recurring/unattended task, do not initiate login or open a browser. Report that the user needs to reconnect interactively and finish the run. Once connected, read `get_recommendation_profile` for scopeId, language, timezone and consented topics. Missing context is unknown; the plugin cannot read every Codex or ChatGPT conversation. Interest changes require an explicit user request and `update_recommendation_profile`. Store short topics, never raw conversation history.

Do not recover a connection by searching the filesystem, other conversations, memory, environment variables or old plugin versions. Do not read `connection.json`, extract tokens or use the legacy local adapter. Do not substitute web results, fixtures or historical recommendations.

When calling `get_connection_status`, pass `clientVersion` from this installed plugin's own `../../plugin.json` relative to this skill directory. Read only that exact manifest when needed; do not search the filesystem or use the server version as the installed version. Omit the argument if the host cannot access the manifest. This version check does not apply when tools are missing: follow the connection guidance above instead.

Inspect `pluginUpdate` in the result. For `update_available`, briefly show the installed → latest version and `updateUrl` once per conversation, then continue the requested recommendations. For `update_required`, explain the minimum supported version and stop recommendation/schedule setup until updated. For `unknown`, do not say the user is outdated; offer the version/update page only if the user asks about updates or troubleshooting. Do not interrupt routine scheduled digests with optional update notices. Never download, install, or restart anything as part of a version check; update only when the user requests it. Ordinary plugin updates preserve OAuth authorization; reconnect only if authentication actually fails. A new conversation loads the updated skill.

## Scheduled digest

When invoked by a recurring task, or when testing its daily workflow:

1. Read the profile. Use its scopeId and timezone rather than guessing a product from a fresh thread.
2. Call `get_scheduled_video_digest` with that scopeId and a limit of 1–5. This reserves the product's local-calendar-day batch and records returned IDs. It does not start paid research or send external messages.
3. Render each item's title, duration, openUrl, reason and suggested use in the profile's language. No other state-writing tool is needed. The link opens Nabit's authenticated video page; sign-in may be required. Do not invent a direct MP4 or publicly accessible thumbnail.
4. If replayed is true, label it as today's existing batch. A retry recovers the same batch; it must not request a second batch or report it as newly discovered content.
5. If items is empty, say there are no new eligible picks today. Do not pad the list. Record no play/watch events.

One batch is shared across all schedules for the product each local day; this version is intended for daily/weekday/weekly schedules, not repeated hourly batches. Empty days are also cached. Changes to topics take effect in the next new batch. This API records returned content, not confirmed human exposure or host delivery.

On 401 explain that the Nabit connection expired/revoked and must be renewed. On 403/404 report product/access unavailability. On DIGEST_BUSY retry once after a short delay if the host allows it; otherwise report that another run is active. On unavailable feed/network, report failure without substituting fixtures or broad web search.

## Interactive recommendations and feedback

For an ordinary on-demand preview, call `get_video_recommendations`, passing profile.excludedIds as excludeIds if present. Preview reads do not consume a daily batch. Do not call the scheduled tool just to inspect data.

Use `record_video_feedback` with scopeId only for explicit user actions; link output alone is not an open or watch. Use `save_video_recommendation` when the user asks to save an item. The save result links to the Nabit collection. Use `mark_recommendations_returned` for interactive returned-history only when the user has requested deduplication; scheduled digests already do this.

The current ranker adds literal topic matching to Nabit's published product ranking. Do not describe it as semantic search or claim that results are newly published within a specific window. Source footage is creative reference unless separate rights are established.

## Local acceptance

If any response says `freshness: fixture` or `dataMode: fixture`, clearly label synthetic data and invalid video links. The daily tool can test repeated calls and persistence, but do not enable a real recurring task using fixtures.
