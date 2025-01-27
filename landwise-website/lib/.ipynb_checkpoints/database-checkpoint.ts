import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { User } from "next-auth";
import { BackendUser } from '@/types/backendUser';
import { backendUserToUser } from '@/utils/backendUserToUser';
// import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from 'nanoid';
import { RealtorStatus, ReportStatus } from "@/types/statuses";
        
const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error("AWS credentials or region are not defined in the environment variables.");
}

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
  region: region,
});

const docClient = DynamoDBDocumentClient.from(client);

const EMAIL_INDEX = "EmailIndex"; // GSI for querying by email
const SESSIONID_INDEX = "sessionIdIndex"; // for querying reports table by sessionId
const CUSTOMERID_INDEX = "customerIdIndex"; // for querying reports table by customerId

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
export const getUserByEmail = async (email: string): Promise<BackendUser | null> => {
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
    return Items?.[0] as BackendUser || null; // Return the first matching user, or null if not found
  } catch (error) {
    console.error("Error querying user by email:", error);
    throw new Error("Unable to query user by email");
  }
};

/**
 * Retrieves a user by ID.
 */

export const getUserById = async (id: string): Promise<BackendUser | null> => {
  const TABLE_NAME = "Realtors";

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const { Item } = await docClient.send(command);

    if (!Item) {
      return null;
    }

    const user = Item as BackendUser;

    return user;

  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    throw new Error("Unable to retrieve user by ID");
  }
};

/**
 * Creates a new user in the database.
 * @param user - The user object containing all user data.
 */
export const createUser = async (user: BackendUser): Promise<{ success: boolean; message?: string; data?: User }> => {
  const TABLE_NAME = "Realtors";

  try {
    const { password, ...otherFields } = user;

    if (!password) {
      throw new Error("Password not provided");
    }
      
    const hashedPassword = await generateHash(password);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...otherFields,
        password: hashedPassword,
      },
    });

    await docClient.send(command);

    const frontendUser = backendUserToUser(user);
      
    return { success: true, message: "User created successfully", data: frontendUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Updates a user's data in the database.
 */
export const updateUser = async (id: string, updates: Partial<BackendUser>): Promise<{ success: boolean; message?: string; data?: User }> => {
  const TABLE_NAME = "Realtors";

  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (key === "password" && typeof value === "string") {
        const password = value as string;
        const hashedPassword = await generateHash(password);
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
    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }
      
    const frontendUser = backendUserToUser(updatedUser);
    return { success: true, message: "User updated successfully", data: frontendUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Logs in a user by verifying their email and password.
 */
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    const user = await getUserByEmail(email);

    if (!user || !user.id) {
      return { success: false, message: "Invalid email or password" };
    }

    if (!user?.password) {
      return { success: false, message: "Invalid email or password" };
    }
      
    const isPasswordValid = verifyHash(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" };
    }

    // Update user's status and lastLogin fields
    await updateUser(user.id, {
      status: RealtorStatus.Active,
      lastLogin: new Date().toISOString(),
    });

    // Note: If this will return the users previous status and lastlogin as the
    // user was retrieved before they were updated. This allows us to know if it's
    // been a while since they logged in, if they were inactive, etc. during this 
    // current login.
    const frontendUser = backendUserToUser(user);
    return { success: true, data: frontendUser };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
};


// ~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS FOR REPORTS TABLE ~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Generates a unique report ID in the format XXXX-XXXX-XXXX
 * using the first 12 characters of a UUID and ensures letters are capitalized.
 */
function generateReportId(): string {
  // Generating IDs as 1000 / hour, this would take ~35 years or 308M IDs needed, 
  // in order to have a 1% probability of at least one collision. 
    
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);
  const id = nanoid();
  return id.match(/.{1,4}/g)?.join('-') as string;
}


/**
 * Creates a new report and stores it in the Reports table.
 */
export const createReport = async (
  sessionId: string,
  customerId: string | null,
  size: string,
): Promise<{ success: boolean; reportId?: string; message?: string }> => {
  const TABLE_NAME = "Reports";

  if (!sessionId) {
    return { success: false, message: "Session ID is required to create a report." };
  }

  try {
    const reportId = generateReportId();
    
    const item: Record<string, unknown> = {
      sessionId,
      reportId,
      size,
      createdAt: new Date().toISOString(),
      status: ReportStatus.Unredeemed,
    };

    if (customerId) {
      item.customerId = customerId;
    }
      
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await docClient.send(command);

    console.log("Generated report Id:", reportId);
    return { success: true, reportId, message: "Report created successfully." };
  } catch (error) {
    console.error("Error creating report:", error);
    return {
      success: false,
      message: "Unable to create report.",
    };
  }
};

/**
 * Retrieves all report IDs for a given sessionId or customerId
 */
export const getReportsById = async (reportId: string): Promise<{
  success: boolean;
  reports?: { reportId: string; status: string; createdAt: string; redeemedAt: string; address: string; latitude: number; longitude: number; size: string; }[];
  message?: string;
}> => {
  const TABLE_NAME = "Reports";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "reportId = :id",
      ExpressionAttributeValues: { ":id": reportId },
    });

    const { Items } = await docClient.send(command);
    
    if (Items) {
      const reports = Items.map((item: Record<string, any>) => ({
        reportId: item.reportId as string,
        status: item.status as string,
        createdAt: item.createdAt as string,
        redeemedAt: item.redeemedAt as string,
        address: item.address as string,
        latitude: item.latitude as number,
        longitude: item.longitude as number,
        size: item.size as string,
      }));

      console.log("Reports for", reportId, reports);
      return { success: true, reports };
    } else {
      return { success: false, message: "No reports found" };
    }
  } catch (error) {
    console.error("Error retrieving reports:", error);
    return {
      success: false,
      message: `Unable to retrieve reports: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};


export const getReportsByCustomerId = async (customerId: string): Promise<{
  success: boolean;
  reports?: { reportId: string; status: string; createdAt: string; redeemedAt: string; address: string; latitude: number; longitude: number; size: string; }[];
  message?: string;
}> => {
  const TABLE_NAME = "Reports";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "customerId = :id",
      IndexName: CUSTOMERID_INDEX,
      ExpressionAttributeValues: { ":id": customerId },
    });

    const { Items } = await docClient.send(command);

    if (Items) {
      const reports = Items.map((item: Record<string, any>) => ({
        reportId: item.reportId as string,
        status: item.status as string,
        createdAt: item.createdAt as string,
        redeemedAt: item.redeemedAt as string,
        address: item.address as string,
        latitude: item.latitude as number,
        longitude: item.longitude as number,
        size: item.size as string,
      }));

      console.log("Reports for", customerId, reports);
      return { success: true, reports };
    } else {
      return { success: false, message: "No reports found" };
    }
  } catch (error) {
    console.error("Error retrieving reports:", error);
    return {
      success: false,
      message: `Unable to retrieve reports: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

export const getReportsBySessionId = async (sessionId: string): Promise<{
  success: boolean;
  reports?: { reportId: string; status: string; createdAt: string; redeemedAt: string; address: string; latitude: number; longitude: number; size: string; }[];
  message?: string;
}> => {
  const TABLE_NAME = "Reports";

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "sessionId = :id",
      IndexName: SESSIONID_INDEX,
      ExpressionAttributeValues: { ":id": sessionId },
    });

    const { Items } = await docClient.send(command);

    if (Items) {
      const reports = Items.map((item: Record<string, any>) => ({
        reportId: item.reportId as string,
        status: item.status as string,
        createdAt: item.createdAt as string,
        redeemedAt: item.redeemedAt as string,
        address: item.address as string,
        latitude: item.latitude as number,
        longitude: item.longitude as number,
        size: item.size as string,
      }));

      console.log("Reports for", sessionId, reports);
      return { success: true, reports };
    } else {
      return { success: false, message: "No reports found" };
    }
  } catch (error) {
    console.error("Error retrieving reports:", error);
    return {
      success: false,
      message: `Unable to retrieve reports: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};


/**
 * Updates attributes of a report, such as changing the status and adding a redeemedAt timestamp.
 */
export const updateReportAttributes = async (
  reportId: string,
  attributes: { status?: string; redeemedAt?: string; address?: string; latitude?: number; longitude?: number; }
): Promise<{ success: boolean; message?: string; updatedReport?: any }> => {
  const TABLE_NAME = "Reports";

  try {
    // Dynamically build the update expression and attribute values
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, unknown> = {};
    const expressionAttributeNames: Record<string, string> = {};

    // Iterate over the attributes to create the expression and values
    Object.keys(attributes).forEach((key) => {
      // Type assertion to indicate that key is a valid key in the attributes object
      if (attributes[key as keyof typeof attributes]) {
        const attributeName = `#${key}`;
        const attributeValue = `:${key}`;
        updateExpressions.push(`${attributeName} = ${attributeValue}`);
        expressionAttributeValues[attributeValue] = attributes[key as keyof typeof attributes];
        expressionAttributeNames[attributeName] = key;
      }
    });

    if (updateExpressions.length === 0) {
      return { success: false, message: "No attributes provided to update." };
    }

    const updateExpression = `SET ${updateExpressions.join(", ")}`;

    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { reportId }, 
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(updateCommand);

    console.log("Updated report attributes:", result);
    return {
      success: true,
      message: "Report updated successfully",
      updatedReport: result.Attributes, // Return updated report
    };
  } catch (error) {
    console.error("Error updating report attributes:", error);
    return {
      success: false,
      message: `Unable to update report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};



// ~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS FOR AWS S3 REPORT STORAGE ~~~~~~~~~~~~~~~~~~~~~~~~~

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3ReportsBucket = process.env.REPORTS_BUCKET;
const s3AccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!s3AccessKeyId || !s3SecretAccessKey || !s3ReportsBucket || !region) {
  throw new Error('AWS S3 credentials or region are not defined');
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey,
  },
  region,
});

/**
 * Stores a report as a JSON file in the S3 bucket.
 * @param report - The report object to store.
 * @returns Success or error message.
 */
export const storeReportInS3 = async (
  report: { reportId: string; [key: string]: any }
): Promise<{ success: boolean; message?: string }> => {
  const objectKey = `${report.reportId}.json`;

  try {
    const command = new PutObjectCommand({
      Bucket: s3ReportsBucket,
      Key: objectKey,
      Body: JSON.stringify(report),
      ContentType: 'application/json',
    });

    await s3Client.send(command);

    console.log(`Report ${objectKey} successfully stored in S3 bucket.`);
    return { success: true, message: `Report stored with key: ${objectKey}` };
  } catch (error) {
    console.error('Error storing report in S3:', error);

    return {
      success: false,
      message: `Failed to store report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};


/**
 * Retrieves a report from the S3 bucket.
 * @param reportId - The ID of the report to retrieve.
 * @returns The report object or an error message.
 */
export const getReportFromS3 = async (
  reportId: string
): Promise<{ success: boolean; report?: any; message?: string }> => {
  const objectKey = `${reportId}.json`;

  try {
    const command = new GetObjectCommand({
      Bucket: s3ReportsBucket,
      Key: objectKey,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error('No content in S3 response');
    }

    const streamToString = (stream: any): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      });

    const reportContent = await streamToString(response.Body);
    const report = JSON.parse(reportContent);

    console.log(`Report ${objectKey} successfully retrieved from S3.`);
    return { success: true, report };
  } catch (error) {
    console.error('Error retrieving report from S3:', error);
    return {
      success: false,
      message: `Failed to retrieve report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};


