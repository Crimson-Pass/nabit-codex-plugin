---
name: video-recommendation
description: Find product-fit Nabit video references, request or inspect current matching batches, compare results, and retrieve daily digests. Use product facts from the current task.
---

The host agent orchestrates the task. Explicit user instructions take precedence over this guidance. Use Nabit tools for real results; do not invent video URLs, source claims, progress or completed jobs. Video production is outside this plugin.

## Connection and context

Check get_connection_status with clientVersion from this installed skill's exact ../../plugin.json. Use ../setup/SKILL.md for missing tools, rejected auth or a user-requested workspace permission upgrade. Optional compatible updates do not block work; use the returned updateUrl and never update silently. Unknown versions are not proof of an outdated install.

Resolve the user's product from current conversation context and list_products/get_product. Use ../products/SKILL.md for lookup or management. Never pass scopeId="*" as a product. Do not ask again for facts already supplied. Send concise supported product facts, never the entire conversation history.

## Current product matching

- get_recommendation_batch reads an existing batch. It may settle previously reserved credits and normal explanations; it does not start another batch.
- request_recommendations runs the same published-Hook matching as Nabit's current product UI. It reuses the current batch. An explicit request for recommendations authorizes this normal matching at product pricing; avoid repeated confirmation for the same request. Use get_account_usage when price/balance information is needed. No plugin-specific surcharge or invented price.
- next_recommendation_batch requests more when the user wants another batch. Pass the current snapshotId: retrying an old ID reuses the already advanced batch.
- For queued/running, retain the returned snapshotId and poll get_recommendation_batch at a bounded interval. Report real status and continue until the requested result is available or a concrete failure occurs. Do not call ensure/next repeatedly to poll.
- For empty or insufficient_profile, use returned emptyReason, poolSize and product facts. Explain unknowns; do not infer that a missing interest profile caused no matches. Do not fill a quota with unrelated references.
- Fresh external-source research is a distinct capability; use ../research/SKILL.md when the user requests it. Do not automatically substitute it for published-Hook matching.

Present returned titles/descriptions, viewing links, durations when known, reasons and useful adaptation constraints. Source footage is reference only; do not imply reuse rights or performance. get_video_details and request_video_analysis can support comparison; use ../library/SKILL.md for analysis, favorites and feedback.

## Daily digest

Read the product profile for language/timezone, then get_scheduled_video_digest(scopeId=<real product ID>, limit=1..5). Workspace grants use existing current matching; single-product grants retain the legacy published feed. The tool records returned IDs and replays the same still-visible batch for the local day. It does not start ensure/next/research. A pending matching batch must complete before a new digest is reserved. Empty completed days are cached. Profile changes affect the next new batch. Display replayed=true as today's existing batch.

Host-agent schedules and Nabit research/email schedules are separate. Configure only the one the user requested; use ../settings/SKILL.md. An unattended read never opens OAuth or initiates new spending. A user-configured Nabit research schedule runs under the product's existing budgets.

## Legacy feed and errors

get_video_recommendations is a read-only preview of the older published product feed, useful for existing research references. It is not the current matching entry point. Pass profile.excludedIds where present. Interest matching on that legacy feed is literal topic reordering, not semantic search.

401 means interactive reconnection; WORKSPACE_CONSENT_REQUIRED means explicit range upgrade; 403/404 means unavailable access/reference; 402 reports current credit shortfall. Do not retry insufficient credits by starting another paid path. Network/feed failures are failures, not empty pools. DIGEST_BUSY may be retried once after a short delay. Never substitute fixtures or broad web results for a failed Nabit call. Label every fixture response as synthetic and unplayable.
