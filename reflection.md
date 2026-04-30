# Reflection

## What worked

The single biggest thing that worked was treating the system prompt as a **product specification**, not a creative writing exercise. Once I started thinking of each prompt as a contract with five required sections — Who You Are, How You Talk, What You Believe, Chain-of-Thought, Output Format, Constraints, Few-Shots — the personas became much more consistent and much easier to iterate on. Adding or tweaking a section in one prompt told me exactly where to update the other two to keep them comparable.

The second thing that worked was **few-shot examples doing the heavy lifting**. I wrote rules like "open with the answer, never with 'Great question!'" and the model would still drift. The moment I added three concrete user/assistant exchanges that *demonstrated* that pattern, the drift stopped. The model imitated the few-shots far more reliably than it followed the abstract rule above them. For Kshitij specifically, the few-shot where he gives a Socratic hint instead of the full solution to "Trapping Rain Water" is what made him feel like a teacher rather than a code-completion tool.

The third was **giving each persona a different chain-of-thought ending**. Anshuman's last CoT step is "what is the ONE next action I'd push the learner to take?". Abhimanyu's is "what mindset shift do I want them to walk away with?". Kshitij's is "what edge case will deepen their understanding?". That single line of instruction produces three genuinely different ending styles in the replies, which is what makes the personas feel distinct rather than three flavours of the same chatbot.

## What GIGO taught me

The Garbage-In-Garbage-Out lesson hit hardest when I tried writing Anshuman's prompt before doing the research. My first draft had things like "co-founder of Scaler, passionate about teaching, loves coding". The replies that came out were exactly that bland — they could have been about anyone. Once I went back, watched parts of his interviews, read his LinkedIn, and added *specific* facts (Facebook Chat / Messenger, two-time ICPC World Finalist, the public stance on dropping company-side hiring fees), the model started naturally pulling those details into stories — "at Facebook I interviewed plenty of IIT grads who couldn't reason through a real system design" — and the persona instantly felt real. Specific input → specific output. There is no shortcut: the prompt is only as good as the research that fed into it.

## What I'd improve

Three things, roughly in order of impact:

1. **An evaluation harness.** Right now I'm testing prompts by hitting the UI, which is slow and inconsistent. A 30-line script that posts the same 20 questions to all three personas and dumps the replies to a file would let me A/B prompt changes much faster.
2. **More few-shot examples covering edge cases.** Three is the assignment minimum; five would harden the personas against rude users, off-topic users, and users testing the AI ("are you a bot?"). Right now Kshitij can occasionally drift into giving full solutions when pushed hard — more examples of him *refusing* would fix that.
3. **Server-side rate limiting.** The API route currently has no per-IP limit. For a production deploy it would be worth adding a simple in-memory or Vercel-edge limiter to protect the API key budget from abuse.

Word count: ~440.
