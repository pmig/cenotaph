"use client";

import { useId, useMemo, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface IssueChatProps {
  issueNumber: number;
  issueTitle: string;
  initialEstimateHours?: number;
}

function createInitialMessages(issueNumber: number, issueTitle: string, initialEstimateHours?: number): ChatMessage[] {
  return [
    {
      id: `assistant-${issueNumber}`,
      role: "assistant",
      createdAt: new Date(),
      content: `Hi there! I'm ready to help scope Sentry issue #${issueNumber}, “${issueTitle}”. Ask anything about the ticket, implementation ideas, or the code areas we should inspect.${
        typeof initialEstimateHours === "number"
          ? ` Current auto-estimate: ~${initialEstimateHours.toFixed(1)} hours of engineering effort.`
          : ""
      }`,
    },
  ];
}

export function IssueChat({ issueNumber, issueTitle, initialEstimateHours }: IssueChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(issueNumber, issueTitle, initialEstimateHours),
  );
  const formId = useId();
  const [pendingReply, setPendingReply] = useState<boolean>(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawMessage = (formData.get("message") as string | null)?.trim();

    if (!rawMessage) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        role: "user",
        createdAt: new Date(),
        content: rawMessage,
      },
    ]);

    setPendingReply(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          createdAt: new Date(),
          content:
            "Agent reasoning will appear here soon. We’ll hook this chat to live estimations so you can ask about scope, affected modules, and delivery risks.",
        },
      ]);
      setPendingReply(false);
    }, 600);

    event.currentTarget.reset();
  }

  const assistantIsTyping = pendingReply;

  const emptyState = useMemo(() => messages.length === 0, [messages.length]);

  return (
    <section className="flex h-full min-h-[28rem] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">Estimation chat</p>
            <p className="text-sm text-slate-500">Collaborate with the upcoming agent workflow.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Ticket #{issueNumber}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {emptyState ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Start the conversation to brief the estimation agent.
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase ${
                  message.role === "assistant" ? "bg-brand-card text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {message.role === "assistant" ? "HN" : "You"}
              </div>
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-brand-card text-white shadow-lg"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {assistantIsTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-primary" aria-hidden />
            Agent drafting response…
          </div>
        )}
      </div>

      <form id={formId} onSubmit={handleSubmit} className="border-t border-slate-200 px-6 py-4">
        <label htmlFor={`${formId}-textarea`} className="sr-only">
          Message
        </label>
        <div className="flex items-end gap-3">
          <textarea
            id={`${formId}-textarea`}
            name="message"
            rows={1}
            placeholder="Ask about scope, risks, or required code changes…"
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-brand-card px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pendingReply}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
