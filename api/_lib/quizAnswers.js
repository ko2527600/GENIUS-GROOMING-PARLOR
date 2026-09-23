import { put, list, get } from "@vercel/blob";
import crypto from "crypto";

const PREFIX = "quiz-answers/";

function newId() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `${ts}-${rand}`;
}

export async function createQuizAnswer(data) {
  const id = newId();
  const answer = {
    id,
    category: data.category,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    createdAt: new Date().toISOString(),
  };

  await put(`${PREFIX}${id}.json`, JSON.stringify(answer), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  return answer;
}

async function readAnswerBlob(pathname) {
  const result = await get(pathname, { access: "private" });
  if (!result) return null;
  return new Response(result.stream).json();
}

export async function listQuizAnswers() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const answers = await Promise.all(blobs.map((b) => readAnswerBlob(b.pathname)));
  return answers
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
