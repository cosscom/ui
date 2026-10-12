import {
  AgentMessage,
  AgentMessageContent,
  AgentMessageText,
} from "@/registry/default/ui/agent-message";

const message = `Help me plan a small team workshop next Thursday.

We’ll have six people and about two hours. The goal is to choose one improvement to our onboarding flow.

Here’s the rough agenda:

1. Share what we’ve heard from new customers.
2. Walk through the current sign-up experience.
3. Sketch a few ideas individually.
4. Pick one idea to try next week.

Please leave time for a short break halfway through. We’ll be working remotely, so keep the exercises easy to follow on a video call.

I’d like to finish with a clear owner and a small next step, rather than a long list of tasks.`;

export default function Particle() {
  return (
    <AgentMessage aria-label="You" author="user">
      <AgentMessageContent>
        <AgentMessageText showLessLabel="Show less" showMoreLabel="Show more">
          {message}
        </AgentMessageText>
      </AgentMessageContent>
    </AgentMessage>
  );
}
