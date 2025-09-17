import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv'

dotenv.config();

const TOKEN = process.env.MAILTRAP_API;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Focus Portal",
};
