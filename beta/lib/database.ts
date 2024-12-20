import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from 'bcryptjs';

const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error('AWS credentials or region are not defined');
}

// Initialize DynamoDB Client
const client = new DynamoDBClient({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});

const docClient = DynamoDBDocumentClient.from(client);

export const checkTable = async (tableName: string) => {
    
  try {
    // Check if the table exists
    const listTablesCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listTablesCommand);

    if (TableNames?.includes(tableName)) {
      return { success: true, created: false };
    }

    // Create the table if it doesn't exist
    const createTableCommand = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: "email", KeyType: "HASH" },  // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: "email", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 20,
        WriteCapacityUnits: 20,
      },
    });

    await client.send(createTableCommand);
    return { success: true, created: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};


// Generate a password hash (with an auto-generated salt for simplicity here).
const generateHash = function (password: string): string {
  if (!password) {
    return '';
  }
  return bcrypt.hashSync(password, 8);
};

export const createUser = async (user: any) => {
  const tableName = 'Realtors';

  try {
    const response = await checkTable(tableName);
    if (!response.success) {
      throw new Error(response.error);
    }
      
    const { password, ...otherUserData } = user;
    
    const hashPassword = generateHash(password);
    const userData = { ...otherUserData, password: hashPassword };

    const command = new PutCommand({
      TableName: tableName,
      Item: userData,
    });

    await docClient.send(command);
    console.log('User created successfully');
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};


export const getUser = async (email: string) => {
  const tableName = 'Realtors';

  try {
    const response = await checkTable(tableName);
    if (!response.success) {
      throw new Error(response.error);
    }

    if (response.created) {
      return { success: false, message: 'User not found' };
    }
      
    const command = new GetCommand({
      TableName: tableName,
      Key: { email },
    });

    const { Item } = await docClient.send(command);
      
    if (Item) {
      return { success: true, data: Item };
    } else {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

export const verifyPassword = async (user: any, password: string): Promise<boolean> => {
  return bcrypt.compareSync(password, user.password);
};

export const getUpdateFields = async (newUser: any) => {
  const tableName = 'Realtors';

  try {
    const email = newUser.email;

    if (!email) {
      throw new Error('No email found in new user data');
    }
    
    // Fetch the current user data
    const prevUser = await getUser(tableName, email);
    if (!prevUser.success || !prevUser.data) {
      throw new Error(`No user found with email ${email}`);
    }
    
    const updates: Record<string, any> = {};
    for (const key of Object.keys(newUser)) {
      if (prevUser.data[key] !== newUser[key]) {
        updates[key] = newUser[key];
      }
    }
    
    return { success: true, updates };
  } catch (error) {
    console.error('Error getting update fields:', error);
    return { success: false, message: 'Error getting update fields', error };
  }
};


export const updateUser = async (email: string, updates: any) => {
  const tableName = 'Realtors';

  try {
    if (!email) {
      throw new Error('No email found when updating user');
    }

    const { password, ...otherUpdates } = updates;

    let updatedData;
    if (password) {
      updatedData = { ...otherUpdates, password: generateHash(password) };
    } else {
      updatedData = otherUpdates;
    }

    // Prepare the update expression
    const updateExpression = Object.keys(updatedData).map((key, index) => `#field${index} = :value${index}`).join(', ');
    const expressionAttributeNames = Object.keys(updatedData).reduce((acc, key, index) => {
      acc[`#field${index}`] = key;
      return acc;
    }, {} as Record<string, string>);
    const expressionAttributeValues = Object.keys(updatedData).reduce((acc, key, index) => {
      acc[`:value${index}`] = updatedData[key];
      return acc;
    }, {} as Record<string, any>);

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { email },
      UpdateExpression: `set ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await docClient.send(command);
    console.log('User updated successfully');
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};