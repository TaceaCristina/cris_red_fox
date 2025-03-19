import { z } from "zod";
import parsePhoneNumberFromString, { E164Number } from "libphonenumber-js";

const zPhone = z.string().transform((arg, ctx) => {
  const phone = parsePhoneNumberFromString(arg, {
    defaultCountry: "RO", // Setează România ca implicit
    extract: false,
  });

  if (phone && phone.isValid()) {
    return phone.number as E164Number;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Număr de telefon invalid",
  });
  return z.NEVER;
});

const requiredString = z.string().min(3, "Câmp obligatoriu");

const numericString = z
  .string()
  .regex(/^\d+$/, "Trebuie să fie un număr")
  .max(13, "Numărul trebuie să aibă maxim 13 cifre") // Adaptat pentru CNP sau ID-uri
  .optional();

const ImageSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Doar imagini permise"
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, "Fișierul trebuie să fie mai mic de 2MB");

const CreditCardNumber = z.string().refine(
  (number) => {
    const cleanedNumber = number.replace(/\D/g, "");
    if (!/^[\d ]+$/.test(cleanedNumber)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  },
  {
    message: "Număr de card invalid",
  }
);

export const userAccountSchema = z.object({
  name: z.string().optional(),
  phone: zPhone,
  address: z.string().optional(),
});

export const InstructorSchema = z.object({
  name: requiredString.max(50),
  phone: zPhone,
  email: z.string().email(),
  image: ImageSchema.optional(),
  certificate: z.string().optional(),
  experience: requiredString,
  bio: z.string().max(5000).optional(),
  services: z.string().max(5000).optional(),
  dcost: numericString, // Poate fi redenumit în "dcostRON"
  lcost: numericString, // Poate fi redenumit în "lcostRON"
  transmission: z.string(),
  location: z.string().optional(), // Poți face o listă fixă cu județele din România
});

export const addTimeSlotsSchema = z.object({
  date: z.date(),
  type: z.string(),
  times: z.array(z.date()).refine((value) => value.some((item) => item), {
    message: "Trebuie să selectezi cel puțin un interval orar.",
  }),
});

export const CardDetailsSchema = z.object({
  name: requiredString.max(50),
  cardNumber: CreditCardNumber,
  cvc: z.string().regex(/^\d+$/, "Trebuie să fie un număr").min(3).max(3), // Suportă și 4 cifre
  month: requiredString,
  year: requiredString,
});

export type UserAccountValues = z.infer<typeof userAccountSchema>;
export type InstructorValues = z.infer<typeof InstructorSchema>;
export type AddTimeSlotsValues = z.infer<typeof addTimeSlotsSchema>;
export type CardDetailsValues = z.infer<typeof CardDetailsSchema>;
