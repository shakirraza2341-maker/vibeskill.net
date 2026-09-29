import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "./mongodb";

export type CompanyDetails = {
  company_name: string;
  company_website: string;
  company_telephone: string;
  company_address: string;
  company_ntn: string;
};

export type CompanyDocument = CompanyDetails & {
  _id: ObjectId;
  user_id: ObjectId;
  created_at: Date;
  updated_at: Date;
};

export type CompanyDto = CompanyDetails & {
  id: string;
  created_at: Date;
  updated_at: Date;
};

let indexesPromise: Promise<void> | undefined;

async function getCompaniesCollection(): Promise<Collection<CompanyDocument>> {
  const database = await getDatabase();
  const collection = database.collection<CompanyDocument>("companies");
  indexesPromise ??= (async () => {
    const exists = await database
      .listCollections({ name: "companies" }, { nameOnly: true })
      .hasNext();
    if (exists) {
      const indexes = await collection.indexes();
      const legacyUniqueOwnerIndex = indexes.find(
        (index) =>
          index.unique &&
          Object.keys(index.key).length === 1 &&
          index.key.user_id === 1,
      );
      if (legacyUniqueOwnerIndex?.name) {
        await collection.dropIndex(legacyUniqueOwnerIndex.name);
      }
    }
    await collection.createIndex({ user_id: 1, created_at: -1 });
  })();
  await indexesPromise;
  return collection;
}

function toCompanyDto(company: CompanyDocument): CompanyDto {
  return {
    id: company._id.toHexString(),
    company_name: company.company_name,
    company_website: company.company_website,
    company_telephone: company.company_telephone,
    company_address: company.company_address,
    company_ntn: company.company_ntn,
    created_at: company.created_at,
    updated_at: company.updated_at,
  };
}

export async function listCompaniesForUser(userId: string): Promise<CompanyDto[]> {
  if (!ObjectId.isValid(userId)) return [];
  const companies = await (await getCompaniesCollection())
    .find({ user_id: new ObjectId(userId) })
    .sort({ created_at: -1 })
    .toArray();
  return companies.map(toCompanyDto);
}

export async function createCompanyForUser(
  userId: string,
  details: CompanyDetails,
): Promise<CompanyDto | null> {
  if (!ObjectId.isValid(userId)) return null;
  const now = new Date();
  const company: CompanyDocument = {
    _id: new ObjectId(),
    user_id: new ObjectId(userId),
    ...details,
    created_at: now,
    updated_at: now,
  };
  await (await getCompaniesCollection()).insertOne(company);
  return toCompanyDto(company);
}

export async function updateCompanyForUser(
  userId: string,
  companyId: string,
  details: CompanyDetails,
): Promise<CompanyDto | null> {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(companyId)) return null;
  const updated = await (await getCompaniesCollection()).findOneAndUpdate(
    { _id: new ObjectId(companyId), user_id: new ObjectId(userId) },
    { $set: { ...details, updated_at: new Date() } },
    { returnDocument: "after" },
  );
  return updated ? toCompanyDto(updated) : null;
}

export async function deleteCompanyForUser(
  userId: string,
  companyId: string,
): Promise<boolean> {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(companyId)) return false;
  const result = await (await getCompaniesCollection()).deleteOne({
    _id: new ObjectId(companyId),
    user_id: new ObjectId(userId),
  });
  return result.deletedCount === 1;
}

export async function findCompanyByUserId(
  userId: string,
): Promise<CompanyDocument | null> {
  if (!ObjectId.isValid(userId)) return null;
  return (await getCompaniesCollection())
    .find({ user_id: new ObjectId(userId) })
    .sort({ created_at: -1 })
    .limit(1)
    .next();
}

export async function saveCompanyForUser(
  userId: string,
  details: CompanyDetails,
): Promise<CompanyDocument | null> {
  if (!ObjectId.isValid(userId)) return null;
  const existing = await findCompanyByUserId(userId);
  if (!existing) {
    const created = await createCompanyForUser(userId, details);
    return created
      ? {
          _id: new ObjectId(created.id),
          user_id: new ObjectId(userId),
          ...details,
          created_at: created.created_at,
          updated_at: created.updated_at,
        }
      : null;
  }
  const updated = await updateCompanyForUser(userId, existing._id.toHexString(), details);
  return updated
    ? {
        _id: new ObjectId(updated.id),
        user_id: new ObjectId(userId),
        ...details,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      }
    : null;
}