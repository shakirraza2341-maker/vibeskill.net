module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/jobs-repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
let indexesPromise;
async function getJobsCollection() {
    const database = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
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
"[project]/app/api/jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jobs$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/jobs-repository.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
async function GET() {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            jobs: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jobs$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listJobs"])()
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch jobs"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { company_name, title, description1, description2, category, required, minimum_salary, maximum_salary, country, city, location, remote_available, skills, apply_url } = body;
        const errors = {};
        if (!company_name?.trim()) errors.company_name = "Company name is required";
        if (!category?.trim()) errors.category = "Category is required";
        if (!title?.trim()) errors.title = "Title is required";
        if (!description1?.trim()) errors.description1 = "Description is required";
        if (!description2?.trim()) errors.description2 = "Additional description is required";
        if (!required || Number(required) < 1) errors.required = "Required positions must be at least 1";
        if (minimum_salary !== undefined && minimum_salary !== "" && (!Number.isFinite(Number(minimum_salary)) || Number(minimum_salary) < 0)) errors.minimum_salary = "Minimum salary must be a valid number";
        if (maximum_salary !== undefined && maximum_salary !== "" && (!Number.isFinite(Number(maximum_salary)) || Number(maximum_salary) < 0)) errors.maximum_salary = "Maximum salary must be a valid number";
        if (minimum_salary !== undefined && minimum_salary !== "" && maximum_salary !== undefined && maximum_salary !== "" && Number(maximum_salary) < Number(minimum_salary)) errors.maximum_salary = "Maximum salary must be greater than minimum";
        if (!country?.trim()) errors.country = "Country is required";
        if (!city?.trim()) errors.city = "City is required";
        if (!location?.trim()) errors.location = "Location is required";
        if (typeof remote_available !== "boolean") errors.remote_available = "Remote availability is required";
        if (!Array.isArray(skills) || skills.length === 0) errors.skills = "At least one skill is required";
        if (Object.keys(errors).length) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            errors
        }, {
            status: 400
        });
        const job = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jobs$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createJob"])({
            company_name: company_name.trim(),
            title: title.trim(),
            description1: description1.trim(),
            description2: description2.trim(),
            category: category.trim(),
            required: String(required),
            ...minimum_salary !== undefined && minimum_salary !== "" ? {
                minimum_salary: Number(minimum_salary)
            } : {},
            ...maximum_salary !== undefined && maximum_salary !== "" ? {
                maximum_salary: Number(maximum_salary)
            } : {},
            country: country.trim(),
            city: city.trim(),
            location: location.trim(),
            remote_available,
            skills: skills.map((skill)=>String(skill).trim()),
            ...apply_url?.trim() ? {
                apply_url: apply_url.trim()
            } : {},
            is_active: true
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Job created successfully",
            job
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating job:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create job"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a45ac929._.js.map