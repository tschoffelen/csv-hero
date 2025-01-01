import OpenAI from "openai";
import { Zap } from "react-feather";
import Select from "@/components/form/Select";
import Input from "@/components/form/Input";

const resultRows = {};
let tokenUsage = 0;
let cancelled = false;
let lastInvocation = 0;

const models = {
  "gpt-4o-mini": "GPT-4o mini",
  "gpt-4o": "GPT-4o",
  "gpt-3.5-turbo": "GPT-3.5 Turbo",
};

export const OpenAITransform = {
  id: "openai",
  title: "AI transform",
  group: "Advanced",
  icon: Zap,
  defaultOptions: {
    openAiApiKey: localStorage["openAiApiKey"],
    prompt: "",
    model: "gpt-4o-mini",
    processing: false,
    promptConfirmed: false,
  },
  transform: async (rows, options, setAttributes) => {
    const cacheKey = `${options.prompt}-${options.model}`;

    if (options.lastInvocation > lastInvocation) {
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

    lastInvocation++;

    setAttributes({ processing: 0 });

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
          setAttributes({ processing: false });
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

          setAttributes({ error: e.message });
          newRows.push(row);
        }
      }

      rowCount++;
      setAttributes({ processing: rowCount, tokenUsage });
    }

    setAttributes({ processing: false });

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
      <Input
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
        className="w-full"
        placeholder="OpenAI API key"
      />
      {!options.openAiApiKey && (
        <a
          href="https://platform.openai.com/api-keys"
          className="text-xs text-indigo-500 mt-1 mb-1 block"
        >
          Get an API key &rarr;
        </a>
      )}
      <textarea
        value={options.prompt}
        autoFocus
        onChange={(e) =>
          setOptions({ prompt: e.target.value, lastInvocation: 0 })
        }
        className="rounded-md flex-1 text-xs bg-transparent border-gray-700 max-w-full focus:ring-0 focus:outline-0 focus:shadow-0 appearance-none p-2.5 border resize-x w-full mt-2 min-h-32"
        placeholder="Write a prompt..."
      />
      <button
        onClick={() => setOptions({ lastInvocation: lastInvocation + 1 })}
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
