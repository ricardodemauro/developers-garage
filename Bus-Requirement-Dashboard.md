# **One-Page Dashboard UI Concept (Simplified)**


---

## ✅ **How it Works (User Interaction)**

* Each service has a simple **toggle (enable/disable)**:

  * **Enable:** Automatically generates a unique, disposable URL.
  * **Disable:** Instantly deactivates and removes URL/service.

* **No additional input required** from users.

* URLs auto-generated and expire after predefined time (e.g., 15 min, 30 min, 1 hr).

* Clearly shows active services with remaining expiry time.

---

# 🚀 **Why This Simplified UI is Ideal:**

* **Zero friction:** Instantly accessible.
* **Developer-friendly:** Clearly communicates state.
* **Scalable:** Easily add more services later without complexity.
* **Clean UX:** Intuitive and straightforward.

---

# Dashboard Business Requirements

## Overview
The Developers Garage dashboard serves as the central hub for all available developer tools and services. It provides a clean, intuitive interface for accessing and managing various development utilities.

## Services Available

Each service is represented by a card containing:
- Service title
- Descriptive emoji icon
- Brief description
- Quick access buttons:
  - Open Service - Takes user to the service's dedicated page
  - Swagger API Documentation (📘) - Opens API documentation
  - MCP Connector Configuration (🔌) - Access to Model Context Protocol integration

### Core Services

1. **MailBin** 📧
   - Disposable email inbox for testing
   - Instant email reception without registration
   - Full API documentation via Swagger
   - MCP connector support

2. **PostBin** 📬
   - HTTP request inspection tool
   - Perfect for webhook testing and API development
   - Real-time request monitoring
   - MCP connector support

3. **FileBin** 📁
   - Temporary file storage solution
   - 24-hour auto-deletion
   - Secure file sharing capabilities
   - MCP connector support

4. **Webhook Tester** 🔗
   - Real-time webhook testing
   - Request inspection and validation
   - Complete webhook endpoint configuration
   - MCP connector support

5. **Mocky HTTP** 🔄
   - Custom HTTP API mock creation
   - Configurable responses and status codes
   - Support for multiple HTTP methods
   - MCP connector integration

6. **Data Generator** 🎲
   - Multiple data type generation:
     - Social Security Numbers (SSN)
     - Credit Card Numbers (Various providers)
     - Bank Routing Numbers
     - Employer ID Numbers (EIN)
     - Phone Numbers (International formats)
     - US Addresses
   - API access for all generators
   - MCP connector support

## Service Pages

Each service has a dedicated page showing:
1. Service title and emoji icon
2. Detailed description
3. Service URL
4. API Documentation button
5. MCP Connector button
6. Service-specific configuration options (where applicable)

## Navigation

- Main dashboard grid layout
- Responsive design (1/2/3 columns based on screen size)
- Clear visual hierarchy
- Consistent styling across all services
- Easy access to documentation and MCP connectors

## Integration Features

### API Documentation
- Each service includes Swagger API documentation
- Accessible from both dashboard and service pages
- Complete API endpoint documentation
- Request/response examples

### MCP Integration
- Model Context Protocol connectors for all services
- Easy configuration access
- Standardized integration interface
- Quick setup options

## Design Principles
- Clean and minimal interface
- Consistent visual language
- Clear call-to-action buttons
- Intuitive navigation
- Responsive layout for all screen sizes
