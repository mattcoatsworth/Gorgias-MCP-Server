import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
    import { z } from 'zod';
    import { gorgiasClient } from './gorgias-client.js';

    // Create an MCP server for Gorgias API
    const server = new McpServer({
      name: "Gorgias API",
      version: "1.0.0",
      description: "MCP server for interacting with the Gorgias helpdesk API"
    });

    // Add ticket tools
    server.tool(
      "list_tickets",
      { 
        limit: z.number().min(1).max(100).default(10).describe("Number of tickets to retrieve"),
        page: z.number().min(1).default(1).describe("Page number"),
        order_by: z.string().optional().describe("Field to order by"),
        order_dir: z.enum(["asc", "desc"]).optional().describe("Order direction")
      },
      async ({ limit, page, order_by, order_dir }) => {
        try {
          const response = await gorgiasClient.listTickets({ limit, page, order_by, order_dir });
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error listing tickets: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "List tickets from Gorgias helpdesk" }
    );

    server.tool(
      "get_ticket",
      { 
        id: z.number().describe("Ticket ID to retrieve")
      },
      async ({ id }) => {
        try {
          const response = await gorgiasClient.getTicket(id);
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error retrieving ticket: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "Get a specific ticket by ID" }
    );

    server.tool(
      "create_ticket",
      { 
        subject: z.string().describe("Ticket subject"),
        message: z.string().describe("Ticket message content"),
        customer_email: z.string().email().describe("Customer email address"),
        channel: z.string().default("api").describe("Channel source"),
        via: z.string().default("api").describe("Via source")
      },
      async ({ subject, message, customer_email, channel, via }) => {
        try {
          const response = await gorgiasClient.createTicket({
            subject,
            message: {
              content: {
                text: message
              }
            },
            customer: {
              email: customer_email
            },
            channel,
            via
          });
          return {
            content: [{ 
              type: "text", 
              text: `Ticket created successfully with ID: ${response.data.id}`
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error creating ticket: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "Create a new ticket in Gorgias" }
    );

    server.tool(
      "add_message_to_ticket",
      { 
        ticket_id: z.number().describe("Ticket ID to add message to"),
        message: z.string().describe("Message content"),
        sender_type: z.enum(["customer", "agent"]).default("agent").describe("Sender type")
      },
      async ({ ticket_id, message, sender_type }) => {
        try {
          const response = await gorgiasClient.addMessageToTicket(ticket_id, {
            content: {
              text: message
            },
            sender: {
              type: sender_type
            }
          });
          return {
            content: [{ 
              type: "text", 
              text: `Message added successfully to ticket ${ticket_id}`
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error adding message: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "Add a message to an existing ticket" }
    );

    // Add customer tools
    server.tool(
      "list_customers",
      { 
        limit: z.number().min(1).max(100).default(10).describe("Number of customers to retrieve"),
        page: z.number().min(1).default(1).describe("Page number"),
        email: z.string().email().optional().describe("Filter by email")
      },
      async ({ limit, page, email }) => {
        try {
          const response = await gorgiasClient.listCustomers({ limit, page, email });
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error listing customers: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "List customers from Gorgias" }
    );

    server.tool(
      "get_customer",
      { 
        id: z.number().describe("Customer ID to retrieve")
      },
      async ({ id }) => {
        try {
          const response = await gorgiasClient.getCustomer(id);
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error retrieving customer: ${error.message}` }],
            isError: true
          };
        }
      },
      { description: "Get a specific customer by ID" }
    );

    // Add resources
    server.resource(
      "ticket",
      new ResourceTemplate("gorgias://ticket/{id}", { list: "gorgias://tickets" }),
      async (uri, { id }) => {
        try {
          const response = await gorgiasClient.getTicket(parseInt(id));
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            contents: [{
              uri: uri.href,
              text: `Error retrieving ticket: ${error.message}`
            }]
          };
        }
      }
    );

    server.resource(
      "tickets",
      new ResourceTemplate("gorgias://tickets", { list: undefined }),
      async (uri) => {
        try {
          const response = await gorgiasClient.listTickets({ limit: 10 });
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            contents: [{
              uri: uri.href,
              text: `Error retrieving tickets: ${error.message}`
            }]
          };
        }
      }
    );

    export { server };
