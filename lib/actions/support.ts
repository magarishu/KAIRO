"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askSupportBot(message: string, history: any[] = []) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are Kairo Support Bot, a helpful customer support AI for Kairo, an automated copy-trading and risk management platform for MT5. You help users with their account connections, billing, groups, risk management, and analytics. Keep your answers concise, friendly, and helpful. Format your responses in plain text or simple markdown.",
    });

    // Format history for Gemini
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    
    // Fallback heuristic bot if Gemini fails (e.g. network/fetch issues)
    const lowerMsg = message.toLowerCase();
    let fallbackText = "Hey there Ishu! 😄 Please choose from one of the available options to continue. 🚀";
    
    if (lowerMsg === "hi" || lowerMsg === "hello" || lowerMsg.includes("hey")) {
      fallbackText = "Hello! 👋 I am the Kairo Support Bot. You can ask me how to connect an account, set up risk rules, create copy-trading groups, or how billing works. What can I help you with?";
    } else if (lowerMsg.includes("what is kairo") || lowerMsg.includes("how it works")) {
      fallbackText = "Kairo is an automated copy-trading and risk management platform designed for MT5. We allow you to connect multiple MT5 accounts via MetaApi, group them into Master/Slave copy configurations, and protect your capital with advanced drawdown Risk Rules.";
    } else if (lowerMsg.includes("connection") || lowerMsg.includes("account")) {
      fallbackText = "In Kairo, a 'Connection' is your linked MT5 account. Kairo uses cloud APIs to connect directly to your broker, allowing you to monitor equity and copy trades securely without keeping a local terminal running.";
    } else if (lowerMsg.includes("billing") || lowerMsg.includes("pay") || lowerMsg.includes("price") || lowerMsg.includes("cost")) {
      fallbackText = "Kairo uses Razorpay for secure billing. You can manage your subscription and payment methods on the Billing page.";
    } else if (lowerMsg.includes("risk") || lowerMsg.includes("drawdown") || lowerMsg.includes("protect")) {
      fallbackText = "The Risk Manager allows you to set global and account-specific limits. If a drawdown limit is hit, Kairo will automatically pause trading or close open positions based on your configuration.";
    } else if (lowerMsg.includes("group") || lowerMsg.includes("copy") || lowerMsg.includes("master") || lowerMsg.includes("slave")) {
      fallbackText = "Groups allow you to organize your master and slave accounts. Trades from a master account are automatically copied to all slave accounts in the same group based on the multiplier settings.";
    } else if (lowerMsg.includes("analytic") || lowerMsg.includes("stats") || lowerMsg.includes("chart") || lowerMsg.includes("performance")) {
      fallbackText = "The Analytics page provides detailed performance tracking. Once you connect an account and start trading, Kairo tracks your equity growth, win rate, profit factor, and complete trade history in real-time.";
    } else if (lowerMsg.includes("metaapi") || lowerMsg.includes("token")) {
      fallbackText = "Kairo utilizes MetaApi under the hood to communicate with your MT5 broker in the cloud. We handle the token management so you don't have to!";
    } else if (lowerMsg.includes("thank")) {
      fallbackText = "You're very welcome! Let me know if you need anything else.";
    } else if (lowerMsg.includes("help") || lowerMsg.includes("support") || lowerMsg.includes("contact")) {
      fallbackText = "If you need human assistance or have a specific issue with your broker, please email us directly at support@kairo.com and our team will get back to you within 24 hours.";
    }

    return { success: true, text: fallbackText };
  }
}
