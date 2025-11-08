export interface Node {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconUrl?: string;
  category: string;
  version: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  longDescription: string;
  features: string[];
  requirements: string[];
  githubUrl?: string;
  downloadUrl?: string;
}

export const mockNodes: Node[] = [
  {
    id: "1",
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
  },
  {
    id: "2",
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
  },
  {
    id: "3",
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
  },
  {
    id: "4",
    title: "File Processor",
    description: "Read, write, and transform files in various formats",
    icon: "📁",
    category: "File System",
    version: "2.3.0",
    author: "NodeDrop Team",
    downloads: 10200,
    rating: 4.7,
    tags: ["file", "csv", "json", "xml", "processing"],
    longDescription:
      "Process files in multiple formats including CSV, JSON, XML, and plain text. Perform transformations, validations, and conversions with ease.",
    features: [
      "Multi-format support",
      "File validation",
      "Data transformation",
      "Batch processing",
      "Error handling",
    ],
    requirements: ["File system access"],
  },
  {
    id: "5",
    title: "Slack Notifier",
    description: "Send messages and notifications to Slack channels",
    icon: "💬",
    category: "Communication",
    version: "1.8.0",
    author: "Integrations Inc",
    downloads: 9870,
    rating: 4.8,
    tags: ["slack", "notification", "messaging", "webhook"],
    longDescription:
      "Integrate with Slack to send messages, notifications, and alerts to channels or direct messages. Supports rich formatting, attachments, and interactive elements.",
    features: [
      "Channel and DM support",
      "Rich message formatting",
      "File attachments",
      "Interactive buttons",
      "Thread replies",
    ],
    requirements: ["Slack webhook URL or bot token"],
  },
  {
    id: "6",
    title: "Data Transformer",
    description: "Transform and manipulate data structures",
    icon: "🔄",
    category: "Data Processing",
    version: "2.0.5",
    author: "DataFlow",
    downloads: 11500,
    rating: 4.7,
    tags: ["transform", "data", "mapping", "processing"],
    longDescription:
      "Transform data between different formats and structures. Map fields, apply functions, filter, sort, and aggregate data with a visual interface.",
    features: [
      "Visual data mapping",
      "Custom transformations",
      "Filtering and sorting",
      "Aggregation functions",
      "Schema validation",
    ],
    requirements: ["None"],
  },
  {
    id: "7",
    title: "Scheduler",
    description: "Schedule and automate workflow executions",
    icon: "⏰",
    category: "Automation",
    version: "1.9.0",
    author: "NodeDrop Team",
    downloads: 13200,
    rating: 4.9,
    tags: ["schedule", "cron", "automation", "timer"],
    longDescription:
      "Schedule workflows to run at specific times or intervals using cron expressions. Support for one-time, recurring, and complex scheduling patterns.",
    features: [
      "Cron expression support",
      "One-time and recurring schedules",
      "Timezone handling",
      "Schedule history",
      "Execution monitoring",
    ],
    requirements: ["None"],
  },
  {
    id: "8",
    title: "Webhook Receiver",
    description: "Receive and process incoming webhook requests",
    icon: "📥",
    category: "Network",
    version: "2.2.0",
    author: "WebHooks Pro",
    downloads: 7650,
    rating: 4.6,
    tags: ["webhook", "http", "receiver", "trigger"],
    longDescription:
      "Create webhook endpoints to receive data from external services. Parse incoming requests, validate signatures, and trigger workflows based on webhook events.",
    features: [
      "Custom endpoint URLs",
      "Signature validation",
      "Request parsing",
      "Event filtering",
      "Response customization",
    ],
    requirements: ["Public URL or tunnel service"],
  },
  {
    id: "9",
    title: "JSON Parser",
    description: "Parse and validate JSON data structures",
    icon: "📋",
    category: "Data Processing",
    version: "1.4.0",
    author: "DataFlow",
    downloads: 14800,
    rating: 4.8,
    tags: ["json", "parser", "validation", "data"],
    longDescription:
      "Parse, validate, and extract data from JSON structures. Support for JSON Schema validation, path queries, and data extraction.",
    features: [
      "JSON Schema validation",
      "JSONPath queries",
      "Data extraction",
      "Error handling",
      "Pretty printing",
    ],
    requirements: ["None"],
  },
  {
    id: "10",
    title: "Image Processor",
    description: "Resize, crop, and transform images",
    icon: "🖼️",
    category: "Media",
    version: "2.5.0",
    author: "MediaTools",
    downloads: 6420,
    rating: 4.5,
    tags: ["image", "resize", "crop", "media"],
    longDescription:
      "Process images with various transformations including resize, crop, rotate, and format conversion. Optimize images for web and apply filters.",
    features: [
      "Resize and crop",
      "Format conversion",
      "Image optimization",
      "Filter application",
      "Batch processing",
    ],
    requirements: ["Image processing library"],
  },
  {
    id: "11",
    title: "PDF Generator",
    description: "Generate PDF documents from templates",
    icon: "📄",
    category: "Document",
    version: "1.7.0",
    author: "DocGen",
    downloads: 8100,
    rating: 4.7,
    tags: ["pdf", "document", "generator", "template"],
    longDescription:
      "Create PDF documents from HTML templates or data. Support for custom styling, headers, footers, and dynamic content.",
    features: [
      "HTML to PDF conversion",
      "Template support",
      "Custom styling",
      "Headers and footers",
      "Page numbering",
    ],
    requirements: ["PDF rendering library"],
  },
  {
    id: "12",
    title: "API Gateway",
    description: "Create and manage API endpoints",
    icon: "🚪",
    category: "Network",
    version: "3.1.0",
    author: "API Masters",
    downloads: 5890,
    rating: 4.6,
    tags: ["api", "gateway", "endpoint", "rest"],
    longDescription:
      "Build and manage API endpoints with authentication, rate limiting, and request validation. Create RESTful APIs from your workflows.",
    features: [
      "Authentication support",
      "Rate limiting",
      "Request validation",
      "Response caching",
      "API documentation",
    ],
    requirements: ["None"],
  },
];
