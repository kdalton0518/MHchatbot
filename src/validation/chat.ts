import { z } from "zod";

export const ProductItemSchema = z.object({
  supplier: z.string(),
  product: z.string(),
  price: z.string().optional(),
  rating: z.string().optional(),
  certification: z.string().optional(),
  shipping: z.string().optional(),
  link: z.string().url("Invalid URL format"),
  image: z.string(),
  complianceGrade: z.string().optional(),
  location: z.string().optional(),
  capacity: z.string().optional(),
  certifications: z.string().optional(),
  note: z.string().optional(),
});

export const ScrapedResultSchema = z.object({
  title: z.string(),
  items: z.array(ProductItemSchema),
});

export const SummarySchema = z.record(z.string());

export const ActionSchema = z.object({
  label: z.string(),
  callback: z.function().optional(), // For future functionality
});

export const MessageContentSchema = z.object({
  text: z.string(),
  scrapedData: z.array(ScrapedResultSchema).optional(),
  summary: SummarySchema.optional(),
  actions: z.array(ActionSchema).optional(),
});

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: MessageContentSchema,
});

export const MessagesArraySchema = z.array(MessageSchema);

export type ProductItem = z.infer<typeof ProductItemSchema>;
export type ScrapedResult = z.infer<typeof ScrapedResultSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type Action = z.infer<typeof ActionSchema>;
export type MessageContent = z.infer<typeof MessageContentSchema>;
export type Message = z.infer<typeof MessageSchema>;
