import z from 'zod';

export const botSchema = z.object({
  message: z.string().min(1, { error: 'Message field is required' }),
});

export type BotSchema = z.infer<typeof botSchema>;
