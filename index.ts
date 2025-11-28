import { writeFile } from "fs/promises";
import { AppServer, type AppSession, type ToolCall } from "@mentra/sdk";
import { Assistant } from "./assistant.ts";

class MyApp extends AppServer {
  private assistants = new Map<string, Assistant>();

  protected override async onSession(
    session: AppSession,
    sessionId: string,
    userId: string,
  ): Promise<void> {
    session.logger.info(`IKEA session started: ${sessionId}, ${userId}`);
    this.assistants.set(sessionId, new Assistant());
  }

  protected override async onStop(
    sessionId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    this.logger.info(`IKEA session ended: ${sessionId}, ${userId}, ${reason}`);
    this.assistants.delete(sessionId);
  }

  protected override async onToolCall(
    toolCall: ToolCall,
  ): Promise<string | undefined> {
    this.logger.info(
      `IKEA tool call: ${toolCall.toolId}(${JSON.stringify(toolCall.toolParameters)}), ${toolCall.userId}`,
    );

    if (toolCall.toolId === "process_assembly_input") {
      const message = toolCall.toolParameters.user_message as string;

      if (!toolCall.activeSession) {
        return "Please run the IKEA app first.";
      }

      const session = toolCall.activeSession;

      const assistant = this.assistants.get(session.getSessionId());
      if (!assistant) {
        throw new Error("unreachable");
      }

      const photo = await session.camera.requestPhoto({
        saveToGallery: false,
        size: "medium",
        compress: "none",
      });
      await writeFile(`./tmp/${photo.timestamp}.jpg`, photo.buffer);
      const base64Jpeg = photo.buffer.toString("base64");

      const response = await assistant.processAssemblyInput(
        message,
        base64Jpeg,
        "jpeg",
      );
      return response;
    }

    throw new Error("unreachable");
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
