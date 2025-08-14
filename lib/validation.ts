import { z } from 'zod';

// Event validation schema
export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  start: z.string().datetime('Invalid start date'),
  end: z.string().datetime('Invalid end date'),
  allDay: z.boolean().optional(),
  owner: z.enum(['MARIO', 'MORITZ'])
});

// Expense validation schema
export const ExpenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  amountCents: z.number().positive('Amount must be positive'),
  date: z.string().datetime('Invalid date'),
  paidBy: z.enum(['MARIO', 'MORITZ'])
});

// Wishlist item validation schema
export const WishlistItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  url: z.string().url('Invalid URL').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  proposedBy: z.enum(['MARIO', 'MORITZ'])
});

// Backup password validation
export const BackupPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

// Helper function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
