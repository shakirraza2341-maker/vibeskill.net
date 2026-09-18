import { ObjectId, type Collection, type Filter, type UpdateFilter } from "mongodb";
import { getDatabase } from "./mongodb";

export type JobDocument = {
  _id: ObjectId;
  company_name: string;
  title: string;
  description1: string;
  description2: string;
  category: string;
  required: string;
  minimum_salary?: number;
  maximum_salary?: number;
  country: string;
  city: string;
  location: string;
  remote_available: boolean;
  skills: string[];
  apply_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
};

export type JobDto = Omit<JobDocument, "_id" | "created_at" | "updated_at"> & {
  id: string;
  created_at: string;
  updated_at?: string;
};

let indexesPromise: Promise<void> | undefined;

async function getJobsCollection(): Promise<Collection<JobDocument>> {
  const database = await getDatabase();
  const collection = database.collection<JobDocument>("jobs");

  indexesPromise ??= Promise.all([
    collection.createIndex({ is_active: 1, created_at: -1 }),
    collection.createIndex({ created_at: 1 }),
  ]).then(() => undefined);
  await indexesPromise;

  return collection;
}

function toJobDto(job: JobDocument): JobDto {
  return {
    id: job._id.toHexString(),
    company_name: job.company_name,
    title: job.title,
    description1: job.description1,
    description2: job.description2,
    category: job.category,
    required: job.required,
    minimum_salary: job.minimum_salary,
    maximum_salary: job.maximum_salary,
    country: job.country,
    city: job.city,
    location: job.location,
    remote_available: job.remote_available,
    skills: job.skills,
    apply_url: job.apply_url,
    is_active: job.is_active,
    created_at: job.created_at.toISOString(),
    ...(job.updated_at ? { updated_at: job.updated_at.toISOString() } : {}),
  };
}

function getIdFilter(id: string): Filter<JobDocument> | null {
  return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : null;
}

export async function listJobs(activeOnly = false): Promise<JobDto[]> {
  const collection = await getJobsCollection();
  const filter = activeOnly ? { is_active: true } : {};
  const jobs = await collection.find(filter).sort({ created_at: -1 }).toArray();
  return jobs.map(toJobDto);
}

export async function findJob(id: string): Promise<JobDto | null> {
  const filter = getIdFilter(id);
  if (!filter) return null;
  const job = await (await getJobsCollection()).findOne(filter);
  return job ? toJobDto(job) : null;
}

export async function createJob(
  data: Omit<JobDocument, "_id" | "created_at" | "updated_at">,
): Promise<JobDto> {
  const collection = await getJobsCollection();
  const job: JobDocument = { ...data, _id: new ObjectId(), created_at: new Date() };
  await collection.insertOne(job);
  return toJobDto(job);
}

export async function updateJob(
  id: string,
  data: Partial<Omit<JobDocument, "_id" | "created_at" | "updated_at">>,
): Promise<JobDto | null> {
  const filter = getIdFilter(id);
  if (!filter) return null;
  const setData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
  const unsetData: Record<string, ""> = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value === undefined)
      .map(([key]) => [key, ""]),
  );
  const update: UpdateFilter<JobDocument> = {
    $set: { ...setData, updated_at: new Date() },
    ...(Object.keys(unsetData).length ? { $unset: unsetData } : {}),
  };
  const updated = await (await getJobsCollection()).findOneAndUpdate(
    filter,
    update,
    { returnDocument: "after" },
  );
  return updated ? toJobDto(updated) : null;
}

export async function deleteJob(id: string): Promise<boolean> {
  const filter = getIdFilter(id);
  if (!filter) return false;
  const result = await (await getJobsCollection()).deleteOne(filter);
  return result.deletedCount === 1;
}

export async function deleteExpiredJobs(cutoff: Date): Promise<JobDto[]> {
  const collection = await getJobsCollection();
  const expired = await collection.find({ created_at: { $lt: cutoff } }).toArray();
  if (expired.length > 0) {
    await collection.deleteMany({ _id: { $in: expired.map((job) => job._id) } });
  }
  return expired.map(toJobDto);
}