#!/bin/bash

# Set the path to PostgreSQL 15 binaries
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_REF" ] || [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "Error: Required environment variables not set"
    echo ""
    echo "Please set the following environment variables:"
    echo "1. SUPABASE_PROJECT_REF (also known as Project ID)"
    echo "   - Find this in your Supabase dashboard URL: https://app.supabase.com/project/[your-project-id]"
    echo "   - Or in Project Settings -> General -> Reference ID"
    echo "   - Or in Project Settings -> API -> Project URL (the part before .supabase.co)"
    echo ""
    echo "2. SUPABASE_DB_PASSWORD"
    echo "   - Find this in Project Settings -> Database -> Connection string"
    echo "   - It's the password in the connection string: postgres://postgres:[password]@..."
    echo ""
    echo "Example:"
    echo "export SUPABASE_PROJECT_REF='abcdefghijklmnopqrst'"
    echo "export SUPABASE_DB_PASSWORD='your-database-password'"
    exit 1
fi

# Database connection details
DB_HOST="db.${SUPABASE_PROJECT_REF}.supabase.co"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="postgres"

echo "Starting migration process..."
echo "Using project reference: ${SUPABASE_PROJECT_REF}"
echo "Database host: ${DB_HOST}"

# Step 1: Apply schema migrations
echo "Applying schema migrations..."
supabase db push

# Step 2: Restore only application data (excluding system schemas)
echo "Restoring application data..."
PGPASSWORD="${SUPABASE_DB_PASSWORD}" pg_restore \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --clean \
    --if-exists \
    --exclude-schema=extensions \
    --exclude-schema=pgbouncer \
    --exclude-schema=realtime \
    --exclude-schema=supabase_functions \
    --exclude-schema=supabase_migrations \
    --exclude-schema=vault \
    --exclude-schema=pgsodium \
    --exclude-schema=pgsodium_masks \
    --exclude-schema=graphql \
    --exclude-schema=graphql_public \
    --exclude-schema=net \
    --exclude-schema=storage \
    --exclude-schema=auth \
    --exclude-schema=public \
    local_backup.dump

# Step 3: Verify the migration
echo "Migration completed. Please verify the data in your Supabase dashboard."
echo "URL: https://app.supabase.com/project/${SUPABASE_PROJECT_REF}" 