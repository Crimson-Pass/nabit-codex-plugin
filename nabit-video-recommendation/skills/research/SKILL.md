---
name: research
description: Start and track fresh Nabit source research or product trending tracking when the user requests new sources, using existing product engine, admission controls and budgets.
---

The host agent orchestrates research. Explicit user instructions take precedence over these guidelines. Resolve the real product with the products skill; use setup for workspace consent.

Published-Hook matching uses request_recommendations in video-recommendation. Fresh source discovery uses start_research. Select the appropriate capability from the user's goal; do not silently escalate an empty matching result into another spending path.

start_research uses the product-selected standard/agentic engine, the same service endpoint, admission control and budget as the product. A user request for fresh research authorizes that normal operation under existing product rules. Do not invent a separate fee, switch engines to evade a budget failure, buy credits or enlarge limits.

Strategies are similar_audience, competitors and cross_category. Conditions may include supported market, language, brief, maxDuration (5–180), minViews and maxAgeDays. Do not infer an actual advertising market or campaign goal. Seed URLs are at most five public video links. Product facts are not raw chat logs.

Retain the returned job ID. Use get_research_status to check progress without starting another run. Existing in-flight research is reused by the backend. Show only real statuses, counts and returned evidence. Failed jobs and unavailable engines need an honest result, not manufactured references. Completed research references can be read through get_video_recommendations/get_video_details.

get_trending_videos reads existing product tracking; update_trending_tracking starts/stops it when requested, under existing product limits. Keep tracking separate from a one-off research run and from scheduled email or host-agent digests.

A background task may start research only when the user configured that research schedule or explicitly authorized the recurring operation. A read-only digest does not imply that authorization.
