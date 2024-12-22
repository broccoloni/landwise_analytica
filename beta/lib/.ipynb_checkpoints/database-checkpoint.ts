import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { User } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});
const docClient = DynamoDBDocumentClient.from(client);

const EMAIL_INDEX = "EmailIndex"; // GSI for querying by email


// ~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS FOR REALTORS TABLE ~~~~~~~~~~~~~~~~~~~~~~~~~
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
export const verifyHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

/**
 * Queries a user by email via the GSI.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const TABLE_NAME = "Realtors";

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
    return Items?.[0] as User || null; // Return the first matching user, or null if not found
  } catch (error) {
    console.error("Error querying user by email:", error);
    throw new Error("Unable to query user by email");
  }
};

/**
 * Retrieves a user by ID.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  const TABLE_NAME = "Realtors";

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
 * @param user - The user object containing all user data.
 */
export const createUser = async (user: User): Promise<{ success: boolean; message?: string; data?: User }> => {
  const TABLE_NAME = "Realtors";

  try {
    const { password, ...otherFields } = user;

    // Hash the password before storing
    const hashedPassword = await generateHash(password);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...otherFields, // Spread other user fields into the item
        password: hashedPassword, // Store the hashed password
        createdAt: new Date().toISOString(), // Timestamp for when the user was created
      },
    });

    await docClient.send(command); // Assuming this will succeed or throw on failure
    return { success: true, message: "User created successfully", data: { ...user, password: hashedPassword } };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Unable to create user", error: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Updates a user's data in the database.
 */
export const updateUser = async (id: string, updates: Partial<User>): Promise<{ success: boolean; message?: string; data?: User }> => {
  const TABLE_NAME = "Realtors";

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

    await docClient.send(command); // Assuming this will succeed or throw on failure

    // Retrieve the updated user to return
    const updatedUser = await getUserById(id);
    return { success: true, message: "User updated successfully", data: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Unable to update user", error: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Logs in a user by verifying their email and password.
 */
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; data?: User; message?: string }> => {
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

// ~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS FOR REPORTS TABLE ~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Generates a unique report ID in the format XXXX-XXXX-XXXX
 * using the first 12 characters of a UUID and ensures letters are capitalized.
 */
function generateReportId(): string {
  const uuid = uuidv4().replace(/-/g, ''); // Remove dashes from the UUID
  const id = uuid.slice(0, 12).toUpperCase(); // Take the first 12 characters and convert to uppercase
  return id.match(/.{1,4}/g)?.join('-') as string; // Split into groups of 4 and join with dashes
}

/**
 * Creates a new report and stores it in the Reports table.
 */
export const createReport = async (sessionOrCustomerId: string): Promise<{ success: boolean; reportId?: string; message?: string }> => {
  const TABLE_NAME = "Reports";

  try {
    const reportId = generateReportId();
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        sessionOrCustomerId,
        reportId,
        createdAt: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    console.log("Generated report Id:", reportId);
    return { success: true, reportId, message: "Report created successfully" };
  } catch (error) {
    console.error("Error creating report:", error);
    return { success: false, message: "Unable to create report", error: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Retrieves all report IDs for a given sessionOrCustomerId.
 */
export const getReportIds = async (
  sessionOrCustomerId: string
): Promise<{ success: boolean; reportIds?: string[]; message?: string }> => {
  const TABLE_NAME = "Reports";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "sessionOrCustomerId = :id",
      ExpressionAttributeValues: {
        ":id": sessionOrCustomerId,
      },
    });

    const { Items } = await docClient.send(command);
    const reportIds = Items?.map((item) => item.reportId) || [];

    console.log("Retrieved report IDs:", reportIds, "for sessionOrCustomerId:", sessionOrCustomerId);
    return { success: true, reportIds };
  } catch (error) {
    console.error("Error retrieving reports by sessionOrCustomerId:", error);
    return {
      success: false,
      message: "Unable to retrieve reports",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Details is a dict with: address, addressComponents, longitude, latitude, landGeometry
export const redeemReport = async (reportId: string, details: any): Promise<{ success: boolean; message?: string }> => {
  // Add a redeemed at date

  console.log("Redeeming report:", reportId, " with details:", details);
  return { success: true, message: 'Temporary function to redeem reports' };
};








