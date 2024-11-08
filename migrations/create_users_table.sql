 -- Create users table
 CREATE TABLE users (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   name VARCHAR(255),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 );

 -- Create RLS policies
 ALTER TABLE users ENABLE ROW LEVEL SECURITY;

 -- Policy to allow users to read their own data
 CREATE POLICY "Users can view own data" ON users
   FOR SELECT
   USING (auth.uid() = id);

 -- Policy to allow users to update their own data
 CREATE POLICY "Users can update own data" ON users
   FOR UPDATE
   USING (auth.uid() = id);

 -- Create function to handle updated_at
 CREATE OR REPLACE FUNCTION update_updated_at_column()
 RETURNS TRIGGER AS $$
 BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
 END;
 $$ language 'plpgsql';

 -- Create trigger for updated_at
 CREATE TRIGGER update_users_updated_at
     BEFORE UPDATE ON users
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();