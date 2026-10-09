---
name: library
description: Inspect and compare Nabit video references and their analysis, request product-match explanations, manage saved videos, and record explicit feedback.
---

The host agent composes the requested analysis and library operations. Explicit user instructions take precedence over this guidance. Authenticate through setup and keep every operation within its selected product/workspace.

get_video_details returns existing video facts and analysis. Current matching references need their returned productId, snapshotId and hookId; older published-feed references use recommendationId. Never invent direct MP4s, thumbnails, observations or metrics. Use returned openUrl for viewing; Nabit sign-in may be required.

For playable cards, use render_video_recommendations on the returned product/snapshot, or the video-recommendation skill's local preview fallback when this Codex host has no MCP UI. Viewing does not start matching or imply a save/feedback action.

request_video_analysis requests or retries the current product-match explanation using the product's existing analysis and charging behavior. Poll get_recommendation_batch for reasonStatus. This is recommendation analysis, not a shot-by-shot production plan. Preserve migration constraints, source facts and uncertainty when comparing references. Creative fit is not advertising performance evidence or a reuse license.

list_saved_videos reads the product collection. save_batch_video saves a validated snapshot/Hook. save_video_recommendation saves a returned legacy reference or current matching ID. remove_saved_video uses the same canonical removal behavior as the product. Save/unsave only when instructed; presenting a good candidate is not a save request.

record_video_feedback records explicit open/watch/like/dismiss/not_interested actions. Links printed by the agent are not evidence of opening or watching. For older matching references, pass the returned snapshotId with the matching ID; saved listings retain snapshot/Hook identifiers. save_video_recommendation accepts the same pinned snapshot, and save_batch_video can use its explicit snapshotId/hookId. record_recommendation_decision records use/adapt/not_fit for legacy research recommendations. Do not infer a negative decision from lack of a bookmark.

mark_recommendations_returned records returned history only when interactive deduplication is requested. Scheduled digests already do this. Do not record fictitious delivery or human exposure.
