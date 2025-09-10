import { FormSchema } from '@/schemas/formSchema';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';

export const maxDuration = 30;
const SYSTEM_PROMPT = `
You are a helpful assistant that can validate form data and return the updated form data.
Form Schema:
${FormSchema}

You will be given a form data and a user message.
You will need to validate the form data and return the updated form data.
You will also need to return a reply to the user.

Use the tools provided to validate the form data.

If the user message is not related to the form data, nudge the user towards the form data.
`;

const model = 'openai/gpt-5-mini';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    tools: {
      validateFormData: tool({
        description: 'Validate the form data and return the updated form data.',
        inputSchema: FormSchema,
        execute: async (formData) => {
          const validated = FormSchema.safeParse(formData);
          if (!validated.success) {
            return {
              error: validated.error.message,
            };
          }
        },
      }),
    },
    toolChoice: 'required',
  });

  return result.toUIMessageStreamResponse();
}
