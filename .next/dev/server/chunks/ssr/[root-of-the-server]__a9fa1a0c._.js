module.exports = [
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDatabase",
    ()=>getDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const databaseName = process.env.MONGODB_DB || "ai_mockinterview";
const mongoGlobal = globalThis;
async function getDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is required");
    const clientPromise = mongoGlobal.__mongoClientPromise || new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, {
        appName: "ai-mockinterview",
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
    }).connect();
    if ("TURBOPACK compile-time truthy", 1) mongoGlobal.__mongoClientPromise = clientPromise;
    const client = await clientPromise;
    return client.db(databaseName);
}
}),
"[project]/lib/jobs-repository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createJob",
    ()=>createJob,
    "deleteExpiredJobs",
    ()=>deleteExpiredJobs,
    "deleteJob",
    ()=>deleteJob,
    "findJob",
    ()=>findJob,
    "listJobs",
    ()=>listJobs,
    "updateJob",
    ()=>updateJob
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-rsc] (ecmascript)");
;
;
let indexesPromise;
async function getJobsCollection() {
    const database = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDatabase"])();
    const collection = database.collection("jobs");
    indexesPromise ??= Promise.all([
        collection.createIndex({
            is_active: 1,
            created_at: -1
        }),
        collection.createIndex({
            created_at: 1
        })
    ]).then(()=>undefined);
    await indexesPromise;
    return collection;
}
function toJobDto(job) {
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
        ...job.updated_at ? {
            updated_at: job.updated_at.toISOString()
        } : {}
    };
}
function getIdFilter(id) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id) ? {
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    } : null;
}
async function listJobs(activeOnly = false) {
    const collection = await getJobsCollection();
    const filter = activeOnly ? {
        is_active: true
    } : {};
    const jobs = await collection.find(filter).sort({
        created_at: -1
    }).toArray();
    return jobs.map(toJobDto);
}
async function findJob(id) {
    const filter = getIdFilter(id);
    if (!filter) return null;
    const job = await (await getJobsCollection()).findOne(filter);
    return job ? toJobDto(job) : null;
}
async function createJob(data) {
    const collection = await getJobsCollection();
    const job = {
        ...data,
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](),
        created_at: new Date()
    };
    await collection.insertOne(job);
    return toJobDto(job);
}
async function updateJob(id, data) {
    const filter = getIdFilter(id);
    if (!filter) return null;
    const setData = Object.fromEntries(Object.entries(data).filter(([, value])=>value !== undefined));
    const unsetData = Object.fromEntries(Object.entries(data).filter(([, value])=>value === undefined).map(([key])=>[
            key,
            ""
        ]));
    const update = {
        $set: {
            ...setData,
            updated_at: new Date()
        },
        ...Object.keys(unsetData).length ? {
            $unset: unsetData
        } : {}
    };
    const updated = await (await getJobsCollection()).findOneAndUpdate(filter, update, {
        returnDocument: "after"
    });
    return updated ? toJobDto(updated) : null;
}
async function deleteJob(id) {
    const filter = getIdFilter(id);
    if (!filter) return false;
    const result = await (await getJobsCollection()).deleteOne(filter);
    return result.deletedCount === 1;
}
async function deleteExpiredJobs(cutoff) {
    const collection = await getJobsCollection();
    const expired = await collection.find({
        created_at: {
            $lt: cutoff
        }
    }).toArray();
    if (expired.length > 0) {
        await collection.deleteMany({
            _id: {
                $in: expired.map((job)=>job._id)
            }
        });
    }
    return expired.map(toJobDto);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a9fa1a0c._.js.map