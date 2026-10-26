
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageSquareHeart } from "lucide-react";

import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/components/language/LanguageProvider";

type SurveyStatus =
  | "loading"
  | "ready"
  | "submitting"
  | "checking"
  | "success"
  | "completed"
  | "invalid"
  | "loadError"
  | "uncertain";

type RebookIntent = "yes" | "no" | "unsure";

type PublicSurvey = {
  status: string;
};

const MAX_COMMENT_LENGTH = 2000;

export default function PublicSurveyPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const { t } = useLanguage();
  const copy = t.publicSurvey;

  const [status, setStatus] = useState<SurveyStatus>("loading");
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [nps, setNps] = useState<number | null>(null);
  const [rebookIntent, setRebookIntent] = useState<RebookIntent | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const submissionStarted = useRef(false);

  const loadSurvey = useCallback(async (checking = false) => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    setStatus(checking ? "checking" : "loading");

    try {
      const response = await fetch(
        `/api/surveys/public/${encodeURIComponent(token)}`,
        { cache: "no-store" },
      );

      if (response.status === 404) {
        setStatus("invalid");
        return;
      }

      if (!response.ok) {
        setStatus(checking ? "uncertain" : "loadError");
        return;
      }

      const data: PublicSurvey = await response.json();

      if (data.status === "completed") {
        setStatus("completed");
        return;
      }

      if (data.status === "pending" || data.status === "sent") {
        setStatus(checking ? "uncertain" : "ready");
        return;
      }

      setStatus("invalid");
    } catch {
      setStatus(checking ? "uncertain" : "loadError");
    }
  }, [token]);

  useEffect(() => {
    void loadSurvey();
  }, [loadSurvey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionStarted.current || status !== "ready") {
      return;
    }

    if (
      satisfaction === null ||
      nps === null ||
      rebookIntent === null
    ) {
      setError(copy.requiredAnswers);
      return;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      setError(copy.commentTooLong);
      return;
    }

    submissionStarted.current = true;
    setError("");
    setStatus("submitting");

    try {
      const response = await fetch(
        `/api/surveys/public/${encodeURIComponent(token)}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            satisfaction_score: satisfaction,
            nps_score: nps,
            rebook_intent: rebookIntent,
            comment: comment.trim() || null,
          }),
        },
      );

      if (response.ok) {
        setStatus("success");
      } else if (response.status === 409) {
        setStatus("completed");
      } else if (response.status === 404) {
        setStatus("invalid");
      } else if (response.status === 422) {
        setError(copy.requiredAnswers);
        setStatus("ready");
      } else {
        setStatus("uncertain");
      }
    } catch {
      setStatus("uncertain");
    } finally {
      submissionStarted.current = false;
    }
  }

  const isBusy =
    status === "loading" ||
    status === "submitting" ||
    status === "checking";

  function renderState(
    title: string,
    description: string,
    variant: "success" | "neutral" = "neutral",
    action?: React.ReactNode,
  ) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center shadow-2xl shadow-black/20 sm:px-10">
        <div
          className={[
            "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl",
            variant === "success"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-blue-500/10 text-blue-400",
          ].join(" ")}
        >
          {variant === "success" ? (
            <CheckCircle2 size={30} aria-hidden="true" />
          ) : (
            <MessageSquareHeart size={30} aria-hidden="true" />
          )}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-400">
          {description}
        </p>
        {action && <div className="mt-8">{action}</div>}
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="mb-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              K
            </div>
            <span className="text-lg font-semibold tracking-[0.16em]">
              KAIRO
            </span>
          </div>
          <LanguageSwitcher compact />
        </header>

        {status === "loading" &&
          renderState(copy.loading, "")}

        {status === "checking" &&
          renderState(copy.checkingStatus, "")}

        {status === "success" &&
          renderState(
            copy.successTitle,
            copy.successDescription,
            "success",
          )}

        {status === "completed" &&
          renderState(
            copy.completedTitle,
            copy.completedDescription,
            "success",
          )}

        {status === "invalid" &&
          renderState(
            copy.invalidLinkTitle,
            copy.invalidLinkDescription,
          )}

        {status === "loadError" &&
          renderState(
            copy.loadErrorTitle,
            copy.loadErrorDescription,
            "neutral",
            <button
              type="button"
              onClick={() => void loadSurvey()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              {copy.retry}
            </button>,
          )}

        {status === "uncertain" &&
          renderState(
            copy.loadErrorTitle,
            copy.submissionUncertain,
            "neutral",
            <button
              type="button"
              onClick={() => void loadSurvey(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              {copy.checkStatus}
            </button>,
          )}

        {(status === "ready" || status === "submitting") && (
          <>
            <div className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                {copy.eyebrow}
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
                {copy.description}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <fieldset
                disabled={isBusy}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
              >
                <legend className="sr-only">
                  {copy.satisfactionQuestion}
                </legend>
                <p className="text-lg font-semibold">
                  {copy.satisfactionQuestion}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {copy.satisfactionHelp}
                </p>

                <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={satisfaction === value}
                      onClick={() => {
                        setSatisfaction(value);
                        setError("");
                      }}
                      className={[
                        "rounded-xl border py-4 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                        satisfaction === value
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500",
                      ].join(" ")}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex justify-between gap-4 text-xs text-slate-500">
                  <span>{copy.veryDissatisfied}</span>
                  <span className="text-right">{copy.verySatisfied}</span>
                </div>
              </fieldset>

              <fieldset
                disabled={isBusy}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
              >
                <legend className="sr-only">
                  {copy.npsQuestion}
                </legend>
                <p className="text-lg font-semibold">
                  {copy.npsQuestion}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {copy.npsHelp}
                </p>

                <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-11">
                  {Array.from({ length: 11 }, (_, value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={nps === value}
                      onClick={() => {
                        setNps(value);
                        setError("");
                      }}
                      className={[
                        "rounded-lg border py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                        nps === value
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500",
                      ].join(" ")}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex justify-between gap-4 text-xs text-slate-500">
                  <span>{copy.notLikely}</span>
                  <span className="text-right">{copy.extremelyLikely}</span>
                </div>
              </fieldset>

              <fieldset
                disabled={isBusy}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
              >
                <legend className="sr-only">
                  {copy.rebookQuestion}
                </legend>
                <p className="text-lg font-semibold">
                  {copy.rebookQuestion}
                </p>

                <div className="mt-6 grid gap-3">
                  {(
                    [
                      ["yes", copy.rebookYes],
                      ["no", copy.rebookNo],
                      ["unsure", copy.rebookUnsure],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={rebookIntent === value}
                      onClick={() => {
                        setRebookIntent(value);
                        setError("");
                      }}
                      className={[
                        "rounded-xl border px-5 py-4 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                        rebookIntent === value
                          ? "border-blue-500 bg-blue-600/20 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <label
                    htmlFor="survey-comment"
                    className="text-lg font-semibold"
                  >
                    {copy.commentQuestion}
                  </label>
                  <span className="text-xs text-slate-500">
                    {copy.optional}
                  </span>
                </div>

                <textarea
                  id="survey-comment"
                  rows={5}
                  maxLength={MAX_COMMENT_LENGTH}
                  disabled={isBusy}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={copy.commentPlaceholder}
                  className="mt-5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {copy.charactersRemaining}:{" "}
                  {MAX_COMMENT_LENGTH - comment.length}
                </p>
              </section>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                >
                  {error}
                </p>
              )}

              <div className="space-y-5 pt-3">
                <p className="text-sm leading-6 text-slate-400">
                  {copy.privacyNote}
                </p>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting"
                    ? copy.submitting
                    : copy.submit}
                  {status !== "submitting" && (
                    <ArrowRight size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          {copy.footer}
        </footer>
      </div>
    </main>
  );
}
