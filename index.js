const express = require('express');
const path = require('path');
const app = express();

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies and JSON (Form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dummy Data matching the simple/realistic employee database
const dummyEmployees = [
  {
    id: "EMP001",
    name: "Eleanor Vance",
    email: "e.vance@company.com",
    role: "Senior Software Engineer",
    department: "IT",
    salary: "$145,000",
    status: "Active",
    hireDate: "2022-04-12",
    experienceLevel: "Experienced",
    description: "Eleanor graduated with a Master's Degree in Computer Science from Stanford University. She has over 8 years of experience in distributed systems and systems architecture, having self-learned modern systems development via specialized research papers and open-source contributions."
  },
  {
    id: "EMP002",
    name: "Marcus Aurelius",
    email: "m.aurelius@company.com",
    role: "Full Stack Developer",
    department: "IT",
    salary: "$120,000",
    status: "Active",
    hireDate: "2023-09-15",
    experienceLevel: "Experienced",
    description: "Marcus holds a Bachelor's Degree in Software Engineering from the University of Texas. He developed his full-stack capabilities through intensive bootcamps, and gained mastery in modern frameworks (React, Node, Express) by designing responsive enterprise websites."
  },
  {
    id: "EMP003",
    name: "Sophia Martinez",
    email: "s.martinez@company.com",
    role: "HR Manager",
    department: "HR",
    salary: "$85,000",
    status: "Active",
    hireDate: "2020-11-14",
    experienceLevel: "Experienced",
    description: "Sophia graduated with a Bachelor's Degree in Human Resource Management from Boston College. She specializes in corporate culture, talent acquisition, and workplace dispute resolution, and keeps her skills current with advanced professional HR certifications."
  },
  {
    id: "EMP004",
    name: "James Chen",
    email: "j.chen@company.com",
    role: "System Administrator",
    department: "IT",
    salary: "$110,000",
    status: "Active",
    hireDate: "2024-01-08",
    experienceLevel: "Fresher",
    description: "James is a recent graduate from Seattle University with a major in Information Technology. He learned system administration, scripting (Bash/Python), and cloud infrastructure setup through university labs and cloud certifications."
  },
  {
    id: "EMP005",
    name: "Aanya Sharma",
    email: "a.sharma@company.com",
    role: "Product Manager",
    department: "Product",
    salary: "$130,000",
    status: "Active",
    hireDate: "2021-06-30",
    experienceLevel: "Experienced",
    description: "Aanya completed her MBA in Product Management from NYU Stern. She initially studied digital media, transitioning to product strategy and business analysis through hands-on technical product certifications."
  },
  {
    id: "EMP006",
    name: "Sarah Jenkins",
    email: "s.jenkins@company.com",
    role: "UX Designer",
    department: "Design",
    salary: "$95,000",
    status: "On Leave",
    hireDate: "2023-02-18",
    experienceLevel: "Fresher",
    description: "Sarah graduated with a Bachelor's in Fine Arts from RISD. She self-taught user experience design, mobile wireframing, and interactive design tools, transitioning into the tech sector through professional UX academies."
  },
  {
    id: "EMP007",
    name: "Robert Downey",
    email: "r.downey@company.com",
    role: "Financial Analyst",
    department: "Finance",
    salary: "$105,000",
    status: "Active",
    hireDate: "2022-05-22",
    experienceLevel: "Experienced",
    description: "Robert graduated with a Bachelor's in Finance & Accounting from Penn State University. He developed his expertise in corporate budgeting and financial modeling through years of hands-on consultancy work and corporate analyst roles."
  }
];

const dummyStats = {
  total: dummyEmployees.length,
  itCount: dummyEmployees.filter(e => e.department === "IT").length,
  hrCount: dummyEmployees.filter(e => e.department === "HR").length,
  avgSalary: "$112,857"
};

// Root route - Dashboard
app.get('/', (req, res) => {
  res.render('index', {
    employees: dummyEmployees,
    stats: dummyStats,
    title: "Employee Management System"
  });
});

// Add Employee Routes
app.get('/add', (req, res) => {
  res.render('addEmployee', { title: "Add New Employee" });
});

app.post('/add', (req, res) => {
  const { name, email, role, department, salary, status, experienceLevel, hireDate } = req.body;
  
  // Auto-generate next ID
  const ids = dummyEmployees.map(e => parseInt(e.id.replace('EMP', ''), 10));
  const nextNum = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  const newId = `EMP${String(nextNum).padStart(3, '0')}`;
  
  // Format salary
  const formattedSalary = salary.startsWith('$') ? salary : `$${salary}`;
  
  const newEmployee = {
    id: newId,
    name,
    email,
    role,
    department,
    salary: formattedSalary,
    status,
    hireDate,
    experienceLevel,
    description: `${name} is an experienced professional in ${department}. He joined the team on ${hireDate} as a ${role}.`
  };
  
  dummyEmployees.push(newEmployee);
  
  // Recalculate stats counters
  dummyStats.total = dummyEmployees.length;
  dummyStats.itCount = dummyEmployees.filter(e => e.department === "IT").length;
  dummyStats.hrCount = dummyEmployees.filter(e => e.department === "HR").length;
  
  res.redirect('/');
});

// Edit Employee Routes
app.get('/edit/:id', (req, res) => {
  const employee = dummyEmployees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).send("Employee not found");
  }
  res.render('editEmployee', { title: "Edit Employee", employee });
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const employee = dummyEmployees.find(e => e.id === id);
  if (employee) {
    const { name, email, role, department, salary, status, experienceLevel, hireDate } = req.body;
    employee.name = name;
    employee.email = email;
    employee.role = role;
    employee.department = department;
    employee.salary = salary.startsWith('$') ? salary : `$${salary}`;
    employee.status = status;
    employee.experienceLevel = experienceLevel;
    employee.hireDate = hireDate;
    
    // Recalculate stats counters
    dummyStats.total = dummyEmployees.length;
    dummyStats.itCount = dummyEmployees.filter(e => e.department === "IT").length;
    dummyStats.hrCount = dummyEmployees.filter(e => e.department === "HR").length;
    
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: "Employee not found" });
});

// Employee Details Route
app.get('/details/:id', (req, res) => {
  const employee = dummyEmployees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).send("Employee not found");
  }
  res.render('employeeDetails', { title: "Employee Details", employee });
});

// Delete Employee Route
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  const index = dummyEmployees.findIndex(e => e.id === id);
  if (index !== -1) {
    dummyEmployees.splice(index, 1);
    
    // Recalculate stats counters
    dummyStats.total = dummyEmployees.length;
    dummyStats.itCount = dummyEmployees.filter(e => e.department === "IT").length;
    dummyStats.hrCount = dummyEmployees.filter(e => e.department === "HR").length;
    
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: "Employee not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Dashboard loaded successfully.`);
  console.log(`[Server] Running at http://localhost:${PORT}`);
});
