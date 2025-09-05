
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "offices" (
  "office_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "office_name" VARCHAR(100) NOT NULL,
  "address" VARCHAR(255)
);

CREATE TABLE "employees" (
  "employee_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "current_office_id" UUID REFERENCES "offices"("office_id") ON DELETE SET NULL
);

CREATE TYPE ASSET_TYPE AS ENUM ('Equipment', 'Supply');
CREATE TYPE ASSET_STATUS AS ENUM ('In Storage', 'Assigned', 'In Repair', 'Disposed');
CREATE TYPE HISTORY_ACTION AS ENUM ('Received', 'Issued', 'Transferred', 'Returned', 'Disposed');

CREATE TABLE "assets" (
  "asset_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "property_code" VARCHAR(100) NOT NULL UNIQUE,
  "name" VARCHAR(100) NOT NULL,
  "type" ASSET_TYPE NOT NULL,
  "description" TEXT,
  "quantity" INT NOT NULL DEFAULT 1,
  "unit_of_measurement" VARCHAR(50), -- e.g., 'piece', 'box', 'ream'
  "status" ASSET_STATUS NOT NULL,
  "current_office_id" UUID REFERENCES "offices"("office_id"),
  "assigned_to_employee_id" UUID REFERENCES "employees"("employee_id") ON DELETE SET NULL,
  "specific_location" VARCHAR(100) -- e.g., "Desk 14", "Storage Closet B"
);

CREATE TABLE "asset_history" (
  "history_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "asset_id" UUID NOT NULL REFERENCES "assets"("asset_id") ON DELETE CASCADE,
  "action" HISTORY_ACTION NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "notes" VARCHAR(500),
  "updated_fields" JSONB -- Stores a JSON object of changes, e.g., {"from_employee": "x", "to_employee": "y"}
);

-- Add indexes for performance on frequently queried columns
CREATE INDEX ON "employees" ("current_office_id");
CREATE INDEX ON "assets" ("status");
CREATE INDEX ON "assets" ("current_office_id");
CREATE INDEX ON "assets" ("assigned_to_employee_id");
CREATE INDEX ON "asset_history" ("asset_id");