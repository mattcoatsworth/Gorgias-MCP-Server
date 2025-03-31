import axios from 'axios';

    class GorgiasClient {
      constructor() {
        this.baseURL = null;
        this.auth = null;
      }

      initialize() {
        if (this.baseURL) return; // Already initialized

        const domain = process.env.GORGIAS_DOMAIN;
        if (!domain) {
          throw new Error('GORGIAS_DOMAIN environment variable is required');
        }

        this.baseURL = `https://${domain}/api`;

        // Check if using API key authentication
        if (process.env.GORGIAS_USERNAME && process.env.GORGIAS_API_KEY) {
          this.auth = {
            username: process.env.GORGIAS_USERNAME,
            password: process.env.GORGIAS_API_KEY
          };
        } 
        // Check if using OAuth token
        else if (process.env.GORGIAS_ACCESS_TOKEN) {
          this.auth = null;
          this.accessToken = process.env.GORGIAS_ACCESS_TOKEN;
        } else {
          throw new Error('Either GORGIAS_USERNAME and GORGIAS_API_KEY, or GORGIAS_ACCESS_TOKEN must be provided');
        }
      }

      async request(method, endpoint, data = null, params = null) {
        this.initialize();

        const config = {
          method,
          url: `${this.baseURL}/${endpoint}`,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        // Add authentication
        if (this.auth) {
          config.auth = this.auth;
        } else if (this.accessToken) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        if (data) {
          config.data = data;
        }

        if (params) {
          config.params = params;
        }

        try {
          return await axios(config);
        } catch (error) {
          if (error.response) {
            throw new Error(`Gorgias API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          }
          throw error;
        }
      }

      // Ticket endpoints
      async listTickets(params = {}) {
        return this.request('GET', 'tickets', null, params);
      }

      async getTicket(id) {
        return this.request('GET', `tickets/${id}`);
      }

      async createTicket(data) {
        return this.request('POST', 'tickets', data);
      }

      async updateTicket(id, data) {
        return this.request('PUT', `tickets/${id}`, data);
      }

      async addMessageToTicket(ticketId, messageData) {
        return this.request('POST', `tickets/${ticketId}/messages`, messageData);
      }

      // Customer endpoints
      async listCustomers(params = {}) {
        return this.request('GET', 'customers', null, params);
      }

      async getCustomer(id) {
        return this.request('GET', `customers/${id}`);
      }

      async createCustomer(data) {
        return this.request('POST', 'customers', data);
      }

      async updateCustomer(id, data) {
        return this.request('PUT', `customers/${id}`, data);
      }

      // Satisfaction survey endpoints
      async listSatisfactionSurveys(params = {}) {
        return this.request('GET', 'satisfaction-surveys', null, params);
      }

      // Integration endpoints
      async listIntegrations(params = {}) {
        return this.request('GET', 'integrations', null, params);
      }
    }

    export const gorgiasClient = new GorgiasClient();
