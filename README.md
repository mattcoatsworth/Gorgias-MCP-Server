# Gorgias MCP Server

    An MCP server for interacting with the Gorgias helpdesk API. This server provides tools and resources for managing tickets, customers, and other Gorgias functionality.

    ## Setup

    1. Clone this repository
    2. Install dependencies:
       ```
       npm install
       ```
    3. Create a `.env` file based on `.env.example` with your Gorgias credentials:
       ```
       GORGIAS_DOMAIN=your-domain.gorgias.com
       GORGIAS_USERNAME=your-username
       GORGIAS_API_KEY=your-api-key
       ```
       
       Or for OAuth apps:
       ```
       GORGIAS_DOMAIN=your-domain.gorgias.com
       GORGIAS_ACCESS_TOKEN=your-oauth-access-token
       ```

    ## Running the Server

    Start the server:
    ```
    npm run dev
    ```

    ## Testing with MCP Inspector

    Test the server with the MCP Inspector:
    ```
    npm run inspect
    ```

    This will open a web interface where you can test all the available tools and resources.

    ## Available Tools

    ### Tickets
    - `list_tickets`: List tickets from Gorgias helpdesk
    - `get_ticket`: Get a specific ticket by ID
    - `create_ticket`: Create a new ticket in Gorgias
    - `add_message_to_ticket`: Add a message to an existing ticket

    ### Customers
    - `list_customers`: List customers from Gorgias
    - `get_customer`: Get a specific customer by ID

    ## Available Resources

    - `gorgias://tickets`: List all tickets
    - `gorgias://ticket/{id}`: Get a specific ticket by ID

    ## Authentication

    This server supports two authentication methods:
    1. API Key authentication (username/API key)
    2. OAuth token authentication

    Configure your preferred method in the `.env` file.
