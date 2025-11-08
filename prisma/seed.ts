import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@nodedrop.com" },
    update: {},
    create: {
      email: "admin@nodedrop.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create sample nodes
  const nodes = [
    {
      title: "HTTP Request",
      description: "Make HTTP requests to any API endpoint with full control",
      icon: "🌐",
      category: "Network",
      version: "2.1.0",
      author: "NodeDrop Team",
      downloads: 15420,
      rating: 4.8,
      tags: ["http", "api", "rest", "network"],
      longDescription:
        "A powerful HTTP request node that allows you to make GET, POST, PUT, DELETE, and other HTTP requests to any API endpoint. Supports custom headers, authentication, query parameters, and request body formatting.",
      features: [
        "Support for all HTTP methods",
        "Custom headers and authentication",
        "JSON, XML, and form data support",
        "Response parsing and error handling",
        "Retry logic and timeout configuration",
      ],
      requirements: ["Node.js 16+", "Network access"],
      published: true,
    },
    {
      title: "Database Query",
      description: "Execute SQL queries on various database systems",
      icon: "🗄️",
      category: "Database",
      version: "1.5.2",
      author: "DB Solutions",
      downloads: 8930,
      rating: 4.6,
      tags: ["database", "sql", "query", "data"],
      longDescription:
        "Connect to and query multiple database systems including PostgreSQL, MySQL, MongoDB, and more. Execute complex queries, manage transactions, and handle large datasets efficiently.",
      features: [
        "Multi-database support",
        "Connection pooling",
        "Transaction management",
        "Query builder interface",
        "Result pagination",
      ],
      requirements: ["Database credentials", "Network access to database"],
      published: true,
    },
    {
      title: "Email Sender",
      description: "Send emails with attachments and templates",
      icon: "📧",
      category: "Communication",
      version: "3.0.1",
      author: "MailFlow",
      downloads: 12350,
      rating: 4.9,
      tags: ["email", "smtp", "notification", "communication"],
      longDescription:
        "Send professional emails with support for HTML templates, attachments, and multiple recipients. Integrates with popular email services and supports SMTP configuration.",
      features: [
        "HTML email templates",
        "File attachments",
        "Multiple recipients (To, CC, BCC)",
        "Email scheduling",
        "Delivery tracking",
      ],
      requirements: ["SMTP credentials or email service API key"],
      published: true,
    },
  ];

  for (const nodeData of nodes) {
    const node = await prisma.node.upsert({
      where: { id: nodeData.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: nodeData,
    });
    console.log("Created node:", node.title);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
