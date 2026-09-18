import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "./mongodb";

export type UserRole = "admin" | "user" | "employer";
export type EmployerStatus = "none" | "pending" | "approved" | "rejected";

export type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  employer_status: EmployerStatus;
  phone?: string;
  bio?: string;
  company_name?: string;
  company_website?: string;
  employer_reason?: string;
  reviewed_at?: Date;
  reviewed_by?: ObjectId;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
};

export type UserDto = Omit<UserDocument, "_id" | "password_hash"> & { id: string };

let indexesPromise: Promise<void> | undefined;

async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const database = await getDatabase();
  const collection = database.collection<UserDocument>("users");
  indexesPromise ??= Promise.all([
    collection.createIndex({ email: 1 }, { unique: true }),
    collection.createIndex({ created_at: -1 }),
    collection.createIndex({ employer_status: 1, created_at: -1 }),
  ]).then(() => undefined);
  await indexesPromise;
  return collection;
}

function toUserDto(user: UserDocument): UserDto {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    employer_status: user.employer_status ?? "none",
    ...(user.phone ? { phone: user.phone } : {}),
    ...(user.bio ? { bio: user.bio } : {}),
    ...(user.company_name ? { company_name: user.company_name } : {}),
    ...(user.company_website ? { company_website: user.company_website } : {}),
    ...(user.employer_reason ? { employer_reason: user.employer_reason } : {}),
    created_at: user.created_at,
    updated_at: user.updated_at,
    ...(user.last_login_at ? { last_login_at: user.last_login_at } : {}),
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  return (await getUsersCollection()).findOne({ email: email.trim().toLowerCase() });
}

export async function createUser(data: {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
  employer_status?: EmployerStatus;
}): Promise<UserDto> {
  const now = new Date();
  const user: UserDocument = {
    _id: new ObjectId(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password_hash: data.password_hash,
    role: data.role ?? "user",
    employer_status: data.employer_status ?? "none",
    created_at: now,
    updated_at: now,
  };
  await (await getUsersCollection()).insertOne(user);
  return toUserDto(user);
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  if (!ObjectId.isValid(id)) return null;
  return (await getUsersCollection()).findOne({ _id: new ObjectId(id) });
}

export async function listUsers(): Promise<UserDto[]> {
  const users = await (await getUsersCollection()).find({}).sort({ created_at: -1 }).toArray();
  return users.map(toUserDto);
}

export async function updateUserProfile(
  id: string,
  data: Pick<UserDocument, "name" | "phone" | "bio" | "company_name" | "company_website">,
): Promise<UserDto | null> {
  if (!ObjectId.isValid(id)) return null;
  const updated = await (await getUsersCollection()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updated_at: new Date() } },
    { returnDocument: "after" },
  );
  return updated ? toUserDto(updated) : null;
}

export async function submitEmployerApplication(
  id: string,
  data: Pick<UserDocument, "company_name" | "company_website" | "employer_reason">,
): Promise<UserDto | null> {
  if (!ObjectId.isValid(id)) return null;
  const updated = await (await getUsersCollection()).findOneAndUpdate(
    { _id: new ObjectId(id), role: "user" },
    { $set: { ...data, employer_status: "pending", updated_at: new Date() } },
    { returnDocument: "after" },
  );
  return updated ? toUserDto(updated) : null;
}

export async function reviewEmployerApplication(
  id: string,
  status: Exclude<EmployerStatus, "none" | "pending">,
  reviewerId: string,
): Promise<UserDto | null> {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(reviewerId)) return null;
  const updated = await (await getUsersCollection()).findOneAndUpdate(
    { _id: new ObjectId(id), employer_status: "pending" },
    {
      $set: {
        employer_status: status,
        role: status === "approved" ? "employer" : "user",
        reviewed_at: new Date(),
        reviewed_by: new ObjectId(reviewerId),
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return updated ? toUserDto(updated) : null;
}

export async function updateUserAdmin(
  id: string,
  data: { role?: UserRole; employer_status?: EmployerStatus },
): Promise<UserDto | null> {
  if (!ObjectId.isValid(id)) return null;
  const update = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
  if (!Object.keys(update).length) return null;
  const updated = await (await getUsersCollection()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...update, updated_at: new Date() } },
    { returnDocument: "after" },
  );
  return updated ? toUserDto(updated) : null;
}

export async function markUserLoggedIn(userId: string): Promise<void> {
  if (!ObjectId.isValid(userId)) return;
  await (await getUsersCollection()).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { last_login_at: new Date(), updated_at: new Date() } },
  );
}
