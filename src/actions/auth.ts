"use server";

import axios from "axios";

export async function verifyRecaptcha(captcha: string | null) {
  const { data } = await axios.get(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
  );
  return data.success;
}
