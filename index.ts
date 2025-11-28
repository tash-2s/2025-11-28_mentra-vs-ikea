import { AppServer, type AppSession, type ToolCall } from "@mentra/sdk";
import { writeFile } from "fs/promises";

class MyApp extends AppServer {
  protected override async onSession(
    session: AppSession,
    sessionId: string,
    userId: string,
  ): Promise<void> {
    session.events.onButtonPress(async (button) => {
      console.log("button pressed!");
      const photo = await session.camera.requestPhoto(); // this!
      session.logger.info(`Photo taken: ${photo.mimeType}`);
      const base64 = photo.buffer.toString("base64").substring(0, 100)
      session.logger.info(`Photo base64: ${base64}`);
      await writeFile("tmp.jpg", photo.buffer);
    });
  }
}

new MyApp({
  packageName:
    process.env.PACKAGE_NAME ??
    (() => {
      throw new Error("PACKAGE_NAME is not set");
    })(),
  apiKey:
    process.env.MENTRAOS_API_KEY ??
    (() => {
      throw new Error("MENTRAOS_API_KEY is not set");
    })(),
  port: process.env.PORT
    ? Number(process.env.PORT)
    : (() => {
        throw new Error("PORT is not set");
      })(),
})
  .start()
  .catch(console.error);
