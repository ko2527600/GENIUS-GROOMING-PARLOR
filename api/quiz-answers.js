import { createQuizAnswer, listQuizAnswers, deleteAllQuizAnswers } from "./_lib/quizAnswers.js";
import { isAuthenticated } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { category, serviceId, serviceName } = req.body ?? {};

    if (!category || !serviceId || !serviceName) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    try {
      const answer = await createQuizAnswer({ category, serviceId, serviceName });
      return res.status(201).json({ ok: true, answer });
    } catch (err) {
      console.error("Failed to save quiz answer:", err);
      return res.status(500).json({ ok: false, error: "Failed to save quiz answer" });
    }
  }

  if (req.method === "GET") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    try {
      const answers = await listQuizAnswers();
      return res.status(200).json({ ok: true, answers });
    } catch (err) {
      console.error("Failed to list quiz answers:", err);
      return res.status(500).json({ ok: false, error: "Failed to load quiz answers" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    const { confirm } = req.body ?? {};
    if (confirm !== "DELETE ALL QUIZ DATA") {
      return res.status(400).json({ ok: false, error: "Confirmation phrase did not match" });
    }
    try {
      const count = await deleteAllQuizAnswers();
      return res.status(200).json({ ok: true, deleted: count });
    } catch (err) {
      console.error("Failed to delete quiz answers:", err);
      return res.status(500).json({ ok: false, error: "Failed to delete quiz answers" });
    }
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
