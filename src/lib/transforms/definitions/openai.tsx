import OpenAI from "openai";
import { Zap } from "react-feather";
import Select from "@/components/form/Select";
import Input from "@/components/form/Input";
import {
  JavascriptTransform,
  JavascriptTransformControl,
  transformWithJavascript,
} from "@/lib/transforms/definitions/javascript";

let tokenUsage = 0;

const models = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o mini",
};

const systemPrompt = `
  The user is using a tool to process CSV type data. The tool is called CSVHero.

  Given the user prompt, write a Javascript script that takes a \`rows\` array and returns a new array with the desired transformation.
  The rows array is an array of objects. The following fields exist in the rows array: {FIELDS}.

  Example row:
  {EXAMPLE}

  The script should simply return the transformed array. The script should not modify the original array.
  Do not return anything other than the script. No need for Markdown syntax, only valid Javascript.

  Example response:
  rows.filter((row) => row.age > 18);
`.trim();

export const OpenAITransform = {
  id: "openai",
  title: "AI transform",
  group: "Advanced",
  icon: Zap,
  defaultOptions: {
    processing: false,
    viewOutput: false,
    tokenUsage: 0,
    prompt: "",
    model: "gpt-4o",
    script: "rows",
  },
  transform: transformWithJavascript,
  controls: ({ options, setOptions, columns, exampleRow }) => {
    const getScript = async () => {
      try {
        setOptions({ processing: true });
        const client = new OpenAI({
          apiKey: options.openAiApiKey,
          dangerouslyAllowBrowser: true,
        });

        const chatCompletion = await client.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt
                .replace("{FIELDS}", JSON.stringify(columns))
                .replace("{EXAMPLE}", JSON.stringify(exampleRow)),
            },
            { role: "user", content: options.prompt },
          ],
          model: options.model,
        });
        const responseText = chatCompletion.choices[0].message.content;
        console.info("[OpenAI Transform]", { responseText });

        const script = responseText
          ?.replace(/```javascript/g, "")
          ?.replace(/```/g, "")
          .trim();

        console.log("[OpenAI Transform]", { script });

        tokenUsage += chatCompletion.usage?.total_tokens || 0;
        setOptions({ script, error: null, tokenUsage, processing: false });
      } catch (e: any) {
        console.error("[OpenAI Transform]", e);
        setOptions({ error: e.message, processing: false });
      }
    };

    return (
      <>
        {options.viewOutput ? (
          <JavascriptTransformControl
            options={options}
            setOptions={setOptions}
          />
        ) : (
          <>
            <Select
              value={options.model}
              onChange={(e) => setOptions({ model: e.target.value })}
              selectClassName="rounded-b-none border-b-0"
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
              defaultValue={localStorage["openAiApiKey"]}
              onChange={(e: any) => {
                localStorage["openAiApiKey"] = e.target.value;
              }}
              className="w-full rounded-t-none"
              placeholder="OpenAI API key"
            />
            {!localStorage["openAiApiKey"] && (
              <a
                href="https://platform.openai.com/api-keys"
                className="text-xs text-indigo-500 mt-1 mb-1 block"
                target="_blank"
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
              placeholder="Enter some instructions...&#10;&#10;Examples:&#10;• sort by most likes&#10;• filter out users that were last seen more than 3 months ago"
            />
            <button
              onClick={() => getScript()}
              className="w-full bg-indigo-600 text-white text-sm font-medium rounded-md h-9 mt-2"
            >
              {options.processing === false ? "Apply" : `Running...`}
            </button>
          </>
        )}
        {!!options.tokenUsage && (
          <p className="text-xs text-gray-500 mt-3 flex items-center justify-between">
            Tokes used: {options.tokenUsage}
            <button
              onClick={() => setOptions({ viewOutput: !options.viewOutput })}
              className="text-indigo-500 font-medium"
            >
              {options.viewOutput ? "Hide output" : "View output"}
            </button>
          </p>
        )}
      </>
    );
  },
};
