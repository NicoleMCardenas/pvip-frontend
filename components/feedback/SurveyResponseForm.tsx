
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { RebookIntent, Survey } from "@/types/survey";

type SurveyResponseFormProps = {
  survey: Survey;
  onCancel: () => void;
  onSuccess: () => void;
  onDirtyChange: (dirty: boolean) => void;
  onSavingChange: (saving: boolean) => void;
};

type FormValues = {
  satisfaction: string;
  nps: string;
  rebookIntent: string;
  comment: string;
};

const initialValues: FormValues = {
  satisfaction: "",
  nps: "",
  rebookIntent: "",
  comment: "",
};

function valuesChanged(values: FormValues) {
  return (
    values.satisfaction !== "" ||
    values.nps !== "" ||
    values.rebookIntent !== "" ||
    values.comment !== ""
  );
}

export function SurveyResponseForm({
  survey,
  onCancel,
  onSuccess,
  onDirtyChange,
  onSavingChange,
}: SurveyResponseFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    ...initialValues,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    const next = {
      ...values,
      [field]: value,
    };

    setValues(next);
    setError("");
    onDirtyChange(valuesChanged(next));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    if (survey.status !== "pending") {
      setError("Only pending surveys can receive a new response.");
      return;
    }

    const satisfaction = values.satisfaction.trim();
    const nps = values.nps.trim();
    const rebookIntent = values.rebookIntent.trim();
    const comment = values.comment.trim();

    if (
      satisfaction === "" &&
      nps === "" &&
      rebookIntent === "" &&
      comment === ""
    ) {
      setError("Enter at least one survey response.");
      return;
    }

    if (
      satisfaction !== "" &&
      !/^[1-5]$/.test(satisfaction)
    ) {
      setError("Satisfaction must be a whole number from 1 to 5.");
      return;
    }

    if (
      nps !== "" &&
      !/^(10|[0-9])$/.test(nps)
    ) {
      setError("NPS must be a whole number from 0 to 10.");
      return;
    }

    if (
      rebookIntent !== "" &&
      !["yes", "no", "unsure"].includes(rebookIntent)
    ) {
      setError("Select a valid rebooking intention.");
      return;
    }

    if (comment.length > 2000) {
      setError("Comment must be 2000 characters or fewer.");
      return;
    }

    onSavingChange(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/surveys/${encodeURIComponent(survey.id)}/response`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            satisfaction_score:
              satisfaction === "" ? null : Number(satisfaction),
            nps_score: nps === "" ? null : Number(nps),
            rebook_intent:
              rebookIntent === ""
                ? null
                : (rebookIntent as RebookIntent),
            comment: comment || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Unable to save survey response."
        );
      }

      onSuccess();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      onSavingChange(false);
      setLoading(false);
    }
  }

  const labelClassName =
    "mb-2 block text-sm font-medium text-slate-200";

  const inputClassName =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-white">
          Record customer feedback
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Capture the customer's experience following their visit.
          You can record a partial response when some answers are
          unavailable.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className={labelClassName}>
            Customer satisfaction (CSAT)
          </p>

          <p className="mb-3 text-xs text-slate-400">
            How satisfied was the customer with the service?
          </p>

          <div
            role="group"
            aria-label="Customer satisfaction score"
            className="grid grid-cols-5 gap-2"
          >
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                disabled={loading}
                aria-pressed={
                  values.satisfaction === String(score)
                }
                onClick={() =>
                  updateField(
                    "satisfaction",
                    values.satisfaction === String(score)
                      ? ""
                      : String(score)
                  )
                }
                className={`rounded-xl border py-3 text-sm font-semibold transition disabled:opacity-50 ${
                  values.satisfaction === String(score)
                    ? "border-sky-400 bg-sky-500 text-slate-950"
                    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                }`}
              >
                {score}
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Very dissatisfied</span>
            <span>Very satisfied</span>
          </div>
        </div>

        <div>
          <p className={labelClassName}>
            Net Promoter Score (NPS)
          </p>

          <p className="mb-3 text-xs text-slate-400">
            How likely is the customer to recommend the business?
          </p>

          <div
            role="group"
            aria-label="Net Promoter Score"
            className="grid grid-cols-6 gap-2"
          >
            {Array.from({ length: 11 }, (_, score) => (
              <button
                key={score}
                type="button"
                disabled={loading}
                aria-pressed={values.nps === String(score)}
                onClick={() =>
                  updateField(
                    "nps",
                    values.nps === String(score)
                      ? ""
                      : String(score)
                  )
                }
                className={`rounded-xl border py-3 text-sm font-semibold transition disabled:opacity-50 ${
                  values.nps === String(score)
                    ? "border-sky-400 bg-sky-500 text-slate-950"
                    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                }`}
              >
                {score}
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Not likely</span>
            <span>Extremely likely</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="survey-rebook"
            className={labelClassName}
          >
            Rebooking intention
          </label>

          <select
            id="survey-rebook"
            value={values.rebookIntent}
            onChange={(event) =>
              updateField("rebookIntent", event.target.value)
            }
            disabled={loading}
            className={inputClassName}
          >
            <option value="">Not answered</option>
            <option value="yes">Yes, likely to return</option>
            <option value="no">No, unlikely to return</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="survey-comment"
            className={labelClassName}
          >
            Customer comment
          </label>

          <textarea
            id="survey-comment"
            rows={4}
            maxLength={2000}
            value={values.comment}
            onChange={(event) =>
              updateField("comment", event.target.value)
            }
            disabled={loading}
            placeholder="Add any comments shared by the customer..."
            className={inputClassName}
          />

          <p className="mt-2 text-right text-xs text-slate-500">
            {values.comment.length} / 2000
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || !valuesChanged(values)}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving response..." : "Save response"}
        </button>
      </div>
    </form>
  );
}
