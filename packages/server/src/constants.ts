import { z } from 'zod';

export const EmailSchema = z.string().trim().email().max(100);
