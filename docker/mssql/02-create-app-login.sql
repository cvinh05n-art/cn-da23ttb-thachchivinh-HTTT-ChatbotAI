-- Run after restoring ShopTT database.
-- Replace the password below with the exact DB_PASSWORD value in the root .env.
USE [master];
GO
IF NOT EXISTS (SELECT 1 FROM sys.sql_logins WHERE name = N'shoptt_app')
BEGIN
    CREATE LOGIN [shoptt_app] WITH PASSWORD = N'REPLACE_WITH_DB_PASSWORD', CHECK_POLICY = ON;
END
GO
USE [ShopTT];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'shoptt_app')
BEGIN
    CREATE USER [shoptt_app] FOR LOGIN [shoptt_app];
END
GO
-- Development/demo convenience only. Restrict permissions before production.
ALTER ROLE [db_datareader] ADD MEMBER [shoptt_app];
ALTER ROLE [db_datawriter] ADD MEMBER [shoptt_app];
GO
