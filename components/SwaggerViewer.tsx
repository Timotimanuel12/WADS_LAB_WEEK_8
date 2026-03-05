"use client";

import SwaggerUI from "swagger-ui-react";
// @ts-ignore: TypeScript doesn't understand raw CSS imports, but Next.js does!
import "swagger-ui-react/swagger-ui.css";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Assignment Log Book API",
    version: "1.0.0",
    description:
      "REST API for managing assignments in a student log book. Built with Next.js App Router.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev server" }],
  tags: [{ name: "Assignments", description: "CRUD operations for assignments" }],
  paths: {
    "/api/assignments": {
      get: {
        tags: ["Assignments"],
        summary: "Get all assignments",
        description: "Returns a list of all assignments in the log book.",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 3 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Assignment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Assignments"],
        summary: "Create a new assignment",
        description:
          "Creates a new assignment entry. Requires title, description, and dueDate. The assignmentDate is automatically set by the system.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignmentInput" },
              example: {
                title: "React Hooks Essay",
                description: "Write about useState, useEffect, and custom hooks.",
                dueDate: "2026-03-20T23:59:00.000Z",
                status: "Created",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Assignment created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Assignment created successfully" },
                    data: { $ref: "#/components/schemas/Assignment" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  message: "Field 'title' is required and must be a non-empty string.",
                },
              },
            },
          },
        },
      },
    },
    "/api/assignments/{id}": {
      get: {
        tags: ["Assignments"],
        summary: "Get assignment by ID",
        description: "Returns a single assignment by its unique ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique assignment ID",
            schema: { type: "string" },
            example: "a1b2c3d4",
          },
        ],
        responses: {
          "200": {
            description: "Assignment found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Assignment" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Assignment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  message: "Assignment with id 'xyz' not found",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Assignments"],
        summary: "Update an assignment",
        description:
          "Updates an existing assignment. All fields are optional — only the provided fields are updated.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique assignment ID",
            schema: { type: "string" },
            example: "a1b2c3d4",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignmentUpdate" },
              example: {
                title: "Updated Assignment Title",
                status: "Submitted",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Assignment updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Assignment updated successfully" },
                    data: { $ref: "#/components/schemas/Assignment" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Assignment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Assignments"],
        summary: "Delete an assignment",
        description: "Permanently removes an assignment from the log book.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique assignment ID",
            schema: { type: "string" },
            example: "a1b2c3d4",
          },
        ],
        responses: {
          "200": {
            description: "Assignment deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Assignment 'a1b2c3d4' deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Assignment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Assignment: {
        type: "object",
        properties: {
          id: { type: "string", example: "a1b2c3d4" },
          title: { type: "string", example: "Next.js REST API Assignment" },
          description: {
            type: "string",
            example: "Build a REST API using Next.js with CRUD operations.",
          },
          status: {
            type: "string",
            enum: ["Created", "On Process", "Submitted"],
            example: "On Process",
          },
          assignmentDate: {
            type: "string",
            format: "date-time",
            description: "Automatically set by the system when the assignment is created",
          },
          dueDate: { type: "string", format: "date-time", example: "2026-03-10T23:59:00.000Z" },
        },
      },
      AssignmentInput: {
        type: "object",
        required: ["title", "description", "dueDate"],
        properties: {
          title: { type: "string", example: "React Hooks Essay" },
          description: { type: "string", example: "Write about useState and useEffect." },
          dueDate: { type: "string", format: "date-time", example: "2026-03-20T23:59:00.000Z" },
          status: {
            type: "string",
            enum: ["Created", "On Process", "Submitted"],
            default: "Created",
          },
        },
      },
      AssignmentUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
          status: {
            type: "string",
            enum: ["Created", "On Process", "Submitted"],
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error description" },
        },
      },
    },
  },
};

export default function SwaggerViewer() {
  return <SwaggerUI spec={swaggerSpec} />;
}