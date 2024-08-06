import React from "react";
import OpenAI from "openai";
import { Zap } from "react-feather";
import Select from "../../components/form/Select";

const resultRows = {};
let tokenUsage = 0;
let cancelled = false;

const models = {
  "gpt-4o-mini": "GPT-4o mini",
  "gpt-4o": "GPT-4o",
  "gpt-3.5-turbo": "GPT-3.5 Turbo",
};

export const OpenAITransform = {
  id: "openai",
  title: "AI transform",
  icon: Zap,
  defaultOptions: {
    openAiApiKey: localStorage["openAiApiKey"],
    prompt: "",
    model: "gpt-4o-mini",
    processing: false,
    promptConfirmed: false,
  },
  transform: async (rows, options, setOptions) => {
    const cacheKey = `${options.prompt}-${options.model}`;

    if (!options.promptConfirmed) {
      console.log("Prompt not confirmed");

      return rows.map((row) => {
        if (resultRows[cacheKey]) {
          if (resultRows[cacheKey][row.__internal_id]) {
            return resultRows[cacheKey][row.__internal_id];
          }
        }
        return row;
      });
    }

    setOptions({ promptConfirmed: false, processing: 0 });

    const client = new OpenAI({
      apiKey: options.openAiApiKey,
      dangerouslyAllowBrowser: true,
    });

    const newRows = [];
    let rowCount = 0;
    if (!resultRows[cacheKey]) {
      resultRows[cacheKey] = {};
    }

    for (const row of rows) {
      const systemPrompt = `
        You are given a single row of a CSV file. 
        
        Execute the following transform, and return only the resulting row as a JSON object, without any additional characters or text.
        Leave all other data the exact same, unless otherwise specified.

        Original data: ${JSON.stringify(row)}
      `;

      if (resultRows[cacheKey][row.__internal_id]) {
        console.log(`Using cache`);

        newRows.push(resultRows[cacheKey][row.__internal_id]);
      } else {
        if (cancelled) {
          console.log("Cancelled");

          cancelled = false;
          setOptions({ processing: false });
          break;
        }
        try {
          const chatCompletion = await client.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: options.prompt },
            ],
            model: options.model,
          });
          const responseText = chatCompletion.choices[0].message.content;
          const response = JSON.parse(
            responseText
              ?.replace(/```json/g, "")
              ?.replace(/```/g, "")
              .trim()
          );

          resultRows[cacheKey][row.__internal_id] = response;

          newRows.push({ ...response, __internal_id: row.__internal_id });
          tokenUsage += chatCompletion.usage?.total_tokens || 0;
        } catch (e) {
          console.log(e);

          setOptions({ error: e.message });
          newRows.push(row);
        }
      }

      rowCount++;
      setOptions({ processing: rowCount, tokenUsage });
    }

    setOptions({ processing: false });

    return newRows;
  },
  controls: ({ options, setOptions }) => (
    <>
      <Select
        value={options.model}
        onChange={(e) => setOptions({ model: e.target.value })}
        className="mb-2"
      >
        <option disabled>Select a model</option>
        {Object.entries(models).map((option) => (
          <option key={option[0]} value={option[0]}>
            {option[1]}
          </option>
        ))}
      </Select>
      <input
        type="text"
        value={options.openAiApiKey}
        autoFocus
        onChange={(e) => {
          setOptions({
            openAiApiKey: e.target.value,
            promptConfirmed: false,
          });
          localStorage["openAiApiKey"] = e.target.value;
        }}
        className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200"
        placeholder="OpenAI API key"
      />
      {!options.openAiApiKey && (
        <a
          href="https://platform.openai.com/api-keys"
          className="text-xs text-indigo-800 mt-0.5 block"
        >
          Get an API key &rarr;
        </a>
      )}
      <textarea
        type="text"
        value={options.prompt}
        autoFocus
        onChange={(e) =>
          setOptions({ prompt: e.target.value, promptConfirmed: false })
        }
        className="rounded-md w-full text-sm bg-white outline-none p-3 h-32 border border-gray-200 mb-2 resize-none mt-2 "
        placeholder="Write a prompt..."
      />
      <button
        onClick={() => setOptions({ promptConfirmed: true })}
        className="w-full bg-indigo-600 text-white text-sm font-medium rounded-md h-9 mt-2"
      >
        {options.processing === false
          ? "Process data"
          : `Processing (${options.processing} rows completed)...`}
      </button>
      {!cancelled && options.processing ? (
        <button
          onClick={() => {
            cancelled = true;
          }}
          className="w-full bg-gray-600 text-white text-sm font-medium rounded-md h-9 mt-2"
        >
          Cancel
        </button>
      ) : null}
      {!!options.tokenUsage && (
        <p className="text-xs text-gray-500 mt-2">
          Tokes used: {options.tokenUsage}
        </p>
      )}
    </>
  ),
};
