import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DEMO_USER = {
  id: "demo-user-1",
  name: "Anshu Mat",
  email: "hire-me@anshumat.org",
  phone: "+919000000000",
  password: "HireMe@2025!",
};

const createStarterApplications = (userId) => [
  {
    id: "APP-9832-X1",
    userId,
    title: "Passport Renewal",
    status: "In Progress",
    step: "Upload identity documents",
    date: "Oct 12, 2023",
    route: "/documents",
  },
  {
    id: "APP-4402-QB",
    userId,
    title: "New Passport Application",
    status: "Awaiting Appointment",
    step: "Schedule appointment",
    date: "Sep 28, 2023",
    route: "/appointment",
  },
];

const users = [];
const applications = [];

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  dob: user.dob || "",
  city: user.city || "",
});

const getApplicationsForUser = (userId) => applications.filter((application) => application.userId === userId);

const seedDemoUser = () => {
  const existingUser = users.find((user) => user.email === DEMO_USER.email);
  if (!existingUser) {
    users.push({ ...DEMO_USER });
  }

  const demoApps = getApplicationsForUser(DEMO_USER.id);
  if (demoApps.length === 0) {
    applications.push(...createStarterApplications(DEMO_USER.id));
  }
};

const seedUserApplications = (userId) => {
  const currentApps = getApplicationsForUser(userId);
  if (currentApps.length === 0) {
    applications.push(...createStarterApplications(userId));
  }
  return getApplicationsForUser(userId);
};

seedDemoUser();

app.get("/api/auth/demo-user", (_req, res) => {
  res.json({
    email: DEMO_USER.email,
    password: DEMO_USER.password,
    user: sanitizeUser(DEMO_USER),
  });
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, phone, password, dob, city } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Name, email, phone, and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  const existing = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail || user.phone === normalizedPhone
  );
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = {
    id: `${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    dob: dob || "",
    city: city || "",
  };
  users.push(user);

  const userApps = seedUserApplications(user.id);

  return res.status(201).json({ user: sanitizeUser(user), applications: userApps });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((currentUser) => currentUser.email.toLowerCase() === normalizedEmail);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.password !== password) return res.status(401).json({ message: "Invalid password" });

  const userApps = seedUserApplications(user.id);
  return res.json({ user: sanitizeUser(user), applications: userApps });
});

app.patch("/api/users/profile", (req, res) => {
  const { email, name, dob, city } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((currentUser) => currentUser.email.toLowerCase() === normalizedEmail);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (typeof name === "string" && name.trim()) user.name = name.trim();
  if (typeof dob === "string") user.dob = dob;
  if (typeof city === "string") user.city = city.trim();

  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/applications", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email query is required" });

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((currentUser) => currentUser.email.toLowerCase() === normalizedEmail);
  if (!user) return res.status(404).json({ message: "User not found" });

  const userApps = getApplicationsForUser(user.id);
  res.json({ applications: userApps });
});

app.post("/api/applications", (req, res) => {
  const { email, phone, title, status, step, date, route, metadata } = req.body;
  if ((!email && !phone) || !title) {
    return res.status(400).json({ message: "Email or phone and title required" });
  }

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim();
  const user = normalizedEmail
    ? users.find((currentUser) => currentUser.email.toLowerCase() === normalizedEmail)
    : users.find((currentUser) => currentUser.phone === normalizedPhone);

  if (!user) return res.status(404).json({ message: "User not found" });

  const newApplication = {
    id: `APP-${Math.floor(Math.random() * 9000) + 1000}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
    userId: user.id,
    title,
    status: status || "Pending",
    step: step || "Start",
    date: date || new Date().toLocaleDateString(),
    route: route || "/form",
    metadata: metadata || {
      emailConfirmation: null,
      exports: {},
    },
  };
  applications.push(newApplication);

  return res.status(201).json({ application: newApplication });
});

app.delete("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const index = applications.findIndex((application) => application.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Application not found" });
  }

  const [deletedApplication] = applications.splice(index, 1);
  return res.json({ application: deletedApplication });
});

app.patch("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const application = applications.find((currentApplication) => currentApplication.id === id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const { title, status, step, date, route, metadata } = req.body;

  if (title) application.title = title;
  if (status) application.status = status;
  if (step) application.step = step;
  if (date) application.date = date;
  if (route) application.route = route;
  if (metadata && typeof metadata === "object") {
    application.metadata = {
      ...(application.metadata || {}),
      ...metadata,
      exports: {
        ...((application.metadata && application.metadata.exports) || {}),
        ...((metadata && metadata.exports) || {}),
      },
      emailConfirmation: metadata.emailConfirmation || application.metadata?.emailConfirmation || null,
    };
  }

  return res.json({ application });
});

app.patch("/api/applications/:id/metadata", (req, res) => {
  const { id } = req.params;
  const application = applications.find((currentApplication) => currentApplication.id === id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const metadata = req.body || {};
  application.metadata = {
    ...(application.metadata || {}),
    ...metadata,
    exports: {
      ...((application.metadata && application.metadata.exports) || {}),
      ...((metadata && metadata.exports) || {}),
    },
    emailConfirmation: metadata.emailConfirmation || application.metadata?.emailConfirmation || null,
  };

  return res.json({ application });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running: http://localhost:${PORT}`);
  console.log(`Demo login seeded: ${DEMO_USER.email} / ${DEMO_USER.password}`);
});
