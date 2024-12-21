import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Realtors";
const EMAIL_INDEX = "EmailIndex"; // GSI for querying by email

/**
 * Hashes a password using bcrypt.
 */
const generateHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Verifies a hashed password.
 */
const verifyHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

/**
 * Queries a user by email via the GSI.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: EMAIL_INDEX,
      KeyConditionExpression: "#email = :emailValue",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":emailValue": email,
      },
    });

    const { Items } = await docClient.send(command);
    return Items?.[0] || null; // Return the first matching user, or null if not found
  } catch (error) {
    console.error("Error querying user by email:", error);
    throw new Error("Unable to query user by email");
  }
};

/**
 * Retrieves a user by ID.
 */
export const getUserById = async (id: string) => {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const { Item } = await docClient.send(command);
    return Item || null;
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    throw new Error("Unable to retrieve user by ID");
  }
};

/**
 * Creates a new user in the database.
 */
export const createUser = async (id: string, email: string, password: string) => {
  try {
    const hashedPassword = await generateHash(password);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id,
        email,
        password: hashedPassword,
      },
    });

    await docClient.send(command);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
};

/**
 * Updates a user's data in the database.
 */
export const updateUser = async (id: string, updates: Record<string, any>) => {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (key === "password") {
        const hashedPassword = await generateHash(value);
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[":" + key] = hashedPassword;
      } else {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[":" + key] = value;
      }
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await docClient.send(command);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Unable to update user");
  }
};

/**
 * Logs in a user by verifying their email and password.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isPasswordValid = verifyHash(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};
