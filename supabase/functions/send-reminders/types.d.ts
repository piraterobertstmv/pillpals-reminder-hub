declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "npm:resend@2.0.0" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: any): Promise<any>;
    };
  }
}

declare module "npm:twilio" {
  export default function twilio(accountSid: string, authToken: string): any;
}

declare module "npm:web-push" {
  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;
  export function sendNotification(subscription: any, payload: string): Promise<void>;
}

declare module "https://deno.land/x/smtp/mod.ts" {
  export class SmtpClient {
    connectTLS(config: any): Promise<void>;
    send(options: any): Promise<void>;
    close(): Promise<void>;
  }
} 