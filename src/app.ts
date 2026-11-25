import express, { type Express } from "express";
import { errorHandler } from "./lib/errors.ts";
import roomsRouter from "./routes/rooms.ts";
import supervisorsRouter from "./routes/supervisors.ts";
import instructorsRouter from "./routes/instructors.ts";
import studentsRouter from "./routes/students.ts";
import coursesRouter from "./routes/courses.ts";
import courseSchedulesRouter from "./routes/courseSchedules.ts";
import hackathonsRouter from "./routes/hackathons.ts";
import hackathonTeamsRouter from "./routes/hackathonTeams.ts";
import hackathonTeamMembersRouter from "./routes/hackathonTeamMembers.ts";

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  app.use("/rooms", roomsRouter);
  app.use("/supervisors", supervisorsRouter);
  app.use("/instructors", instructorsRouter);
  app.use("/students", studentsRouter);
  app.use("/courses", coursesRouter);
  app.use("/course-schedules", courseSchedulesRouter);
  app.use("/hackathons", hackathonsRouter);
  app.use("/hackathon-teams", hackathonTeamsRouter);
  app.use("/hackathon-team-members", hackathonTeamMembersRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);
  return app;
}
