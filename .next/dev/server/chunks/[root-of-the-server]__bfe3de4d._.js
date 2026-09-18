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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/lib/users-repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "findUserByEmail",
    ()=>findUserByEmail,
    "findUserById",
    ()=>findUserById,
    "listUsers",
    ()=>listUsers,
    "markUserLoggedIn",
    ()=>markUserLoggedIn,
    "reviewEmployerApplication",
    ()=>reviewEmployerApplication,
    "submitEmployerApplication",
    ()=>submitEmployerApplication,
    "updateUserAdmin",
    ()=>updateUserAdmin,
    "updateUserProfile",
    ()=>updateUserProfile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
let indexesPromise;
async function getUsersCollection() {
    const database = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
    const collection = database.collection("users");
    indexesPromise ??= Promise.all([
        collection.createIndex({
            email: 1
        }, {
            unique: true
        }),
        collection.createIndex({
            created_at: -1
        }),
        collection.createIndex({
            employer_status: 1,
            created_at: -1
        })
    ]).then(()=>undefined);
    await indexesPromise;
    return collection;
}
function toUserDto(user) {
    return {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        role: user.role,
        employer_status: user.employer_status ?? "none",
        ...user.phone ? {
            phone: user.phone
        } : {},
        ...user.bio ? {
            bio: user.bio
        } : {},
        ...user.company_name ? {
            company_name: user.company_name
        } : {},
        ...user.company_website ? {
            company_website: user.company_website
        } : {},
        ...user.employer_reason ? {
            employer_reason: user.employer_reason
        } : {},
        created_at: user.created_at,
        updated_at: user.updated_at,
        ...user.last_login_at ? {
            last_login_at: user.last_login_at
        } : {}
    };
}
async function findUserByEmail(email) {
    return (await getUsersCollection()).findOne({
        email: email.trim().toLowerCase()
    });
}
async function createUser(data) {
    const now = new Date();
    const user = {
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password_hash: data.password_hash,
        role: data.role ?? "user",
        employer_status: data.employer_status ?? "none",
        created_at: now,
        updated_at: now
    };
    await (await getUsersCollection()).insertOne(user);
    return toUserDto(user);
}
async function findUserById(id) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id)) return null;
    return (await getUsersCollection()).findOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    });
}
async function listUsers() {
    const users = await (await getUsersCollection()).find({}).sort({
        created_at: -1
    }).toArray();
    return users.map(toUserDto);
}
async function updateUserProfile(id, data) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id)) return null;
    const updated = await (await getUsersCollection()).findOneAndUpdate({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: {
            ...data,
            updated_at: new Date()
        }
    }, {
        returnDocument: "after"
    });
    return updated ? toUserDto(updated) : null;
}
async function submitEmployerApplication(id, data) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id)) return null;
    const updated = await (await getUsersCollection()).findOneAndUpdate({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id),
        role: "user"
    }, {
        $set: {
            ...data,
            employer_status: "pending",
            updated_at: new Date()
        }
    }, {
        returnDocument: "after"
    });
    return updated ? toUserDto(updated) : null;
}
async function reviewEmployerApplication(id, status, reviewerId) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id) || !__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(reviewerId)) return null;
    const updated = await (await getUsersCollection()).findOneAndUpdate({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id),
        employer_status: "pending"
    }, {
        $set: {
            employer_status: status,
            role: status === "approved" ? "employer" : "user",
            reviewed_at: new Date(),
            reviewed_by: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](reviewerId),
            updated_at: new Date()
        }
    }, {
        returnDocument: "after"
    });
    return updated ? toUserDto(updated) : null;
}
async function updateUserAdmin(id, data) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id)) return null;
    const update = Object.fromEntries(Object.entries(data).filter(([, value])=>value !== undefined));
    if (!Object.keys(update).length) return null;
    const updated = await (await getUsersCollection()).findOneAndUpdate({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: {
            ...update,
            updated_at: new Date()
        }
    }, {
        returnDocument: "after"
    });
    return updated ? toUserDto(updated) : null;
}
async function markUserLoggedIn(userId) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(userId)) return;
    await (await getUsersCollection()).updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](userId)
    }, {
        $set: {
            last_login_at: new Date(),
            updated_at: new Date()
        }
    });
}
}),
"[project]/auth.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const authConfig = {
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.CRON_SECRET,
    pages: {
        signIn: "/login"
    },
    providers: [],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) token.role = user.role;
            if (user) token.employerStatus = user.employerStatus;
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.sub ?? "";
                session.user.role = token.role ?? "user";
                session.user.employerStatus = token.employerStatus ?? "none";
            }
            return session;
        }
    }
};
const __TURBOPACK__default__export__ = authConfig;
}),
"[project]/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.config.ts [app-route] (ecmascript)");
;
;
;
;
;
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    ...__TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                const email = String(credentials?.email ?? "").trim().toLowerCase();
                const password = String(credentials?.password ?? "");
                if (!email || !password) return null;
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findUserByEmail"])(email);
                if (!user || !await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password_hash)) return null;
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markUserLoggedIn"])(user._id.toHexString());
                } catch (error) {
                    console.error("Error updating user login timestamp:", error);
                }
                return {
                    id: user._id.toHexString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    employerStatus: user.employer_status ?? "none"
                };
            }
        })
    ]
});
}),
"[project]/lib/auth-guard.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireAdmin",
    ()=>requireAdmin,
    "requireEmployer",
    ()=>requireEmployer,
    "requireUser",
    ()=>requireUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-route] (ecmascript)");
;
;
async function requireAdmin() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (session?.user?.role !== "admin") {
        return {
            session: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        };
    }
    return {
        session,
        response: null
    };
}
async function requireUser() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user?.id) {
        return {
            session: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        };
    }
    return {
        session,
        response: null
    };
}
async function requireEmployer() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user?.id || ![
        "admin",
        "employer"
    ].includes(session.user.role)) {
        return {
            session: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Approved employer access required"
            }, {
                status: 403
            })
        };
    }
    return {
        session,
        response: null
    };
}
}),
"[project]/app/api/resume/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$guard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-guard.ts [app-route] (ecmascript)");
;
;
function cleanJson(text) {
    return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
async function POST(request) {
    const { response: authResponse } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$guard$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (authResponse) return authResponse;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "GEMINI_API_KEY is not configured"
    }, {
        status: 500
    });
    const isFileUpload = request.headers.get("content-type")?.includes("multipart/form-data");
    let body;
    let file = null;
    if (isFileUpload) {
        const formData = await request.formData();
        const uploadedFile = formData.get("file");
        if (!(uploadedFile instanceof File)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Please choose a resume file"
        }, {
            status: 400
        });
        file = uploadedFile;
    } else {
        try {
            body = await request.json();
        } catch  {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid request body"
            }, {
                status: 400
            });
        }
    }
    const hasResumeText = Boolean(body?.rawText?.trim());
    if (!file && (!hasResumeText && !body?.targetRole?.trim() || !hasResumeText && !body?.profile?.name?.trim())) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "A target role and resume content are required"
    }, {
        status: 400
    });
    const prompt = file ? [
        "You are an ATS resume reviewer. Analyze the attached resume file.",
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience."
    ].join("\n") : hasResumeText ? [
        "You are an ATS resume reviewer. Analyze the resume content below.",
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience. Resume content:",
        body.rawText.trim()
    ].join("\n") : [
        "You are an ATS resume reviewer. Analyze the candidate resume against the target role.",
        `Target role: ${body.targetRole}. Target company: ${body.targetCompany || "not specified"}.`,
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience. Resume content:",
        JSON.stringify(body.profile)
    ].join("\n");
    try {
        const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
        const parts = file ? [
            {
                text: prompt
            },
            {
                inline_data: {
                    mime_type: file.type || "application/pdf",
                    data: Buffer.from(await file.arrayBuffer()).toString("base64")
                }
            }
        ] : [
            {
                text: prompt
            }
        ];
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.2
                }
            })
        });
        if (!response.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Gemini could not review this resume"
        }, {
            status: 502
        });
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== "string") throw new Error("No analysis returned");
        const analysis = JSON.parse(cleanJson(text));
        if (typeof analysis.score !== "number" || !Array.isArray(analysis.improvements)) throw new Error("Invalid analysis");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            analysis
        });
    } catch (error) {
        console.error("Resume analysis failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to analyze this resume right now"
        }, {
            status: 502
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bfe3de4d._.js.map