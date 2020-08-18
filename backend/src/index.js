const { uuid, isUuid } = require("uuidv4");
const express = require("express");
const { response } = require("express");
const app = express();

const PORT = process.env.PORT || 3333;
const projects = [];

const logRequests = (request, response, next) => {
  const { method, url } = request;

  const logTime = `[${method.toUpperCase()}] ${url}`;

  console.time(logTime);
  next();
  console.timeEnd(logTime);
};

const validateProjectId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: `Invalid project ID` });

  next();
};

app.use(express.json());
app.use(logRequests);
app.use("/projects/:id", validateProjectId);

app.get("/", (request, response) => {
  response.json({ message: "OK" });
});

app.get("/projects", (request, response) => {
  const { tittle } = request.query;

  const results = tittle
    ? projects.filter((project) => project.tittle.include(tittle))
    : projects;

  response.json(results);
});

app.post("/projects", (request, response) => {
  const { tittle, owner } = request.body;

  const project = { tittle, owner, id: uuid() };
  projects.push(project);

  response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { tittle, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0)
    return response.status(404).json({ error: "Project not found" });

  Object.assign(projects[projectIndex], { tittle, owner });

  response.json(projects[projectIndex]);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0)
    return response.status(404).json({ error: "Project not found" });

  projects.splice(projectIndex, 1);

  response.status(204).send();
});

app.listen(PORT, () => console.log(`Server start port: ${PORT}`));
