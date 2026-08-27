# Xevora System

أساس بوت Discord عربي قابل للتوسعة، يبدأ بأمر `/ping` واتصال مستقر مع معالجة
الأخطاء والإيقاف الآمن.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/bot/index.js` — نقطة تشغيل بوت Discord.
- `artifacts/api-server/bot/commands/` — الأوامر وموزعها.
- `artifacts/api-server/src/index.ts` — تشغيل خدمة الصحة والبوت والإيقاف الآمن.
- `artifacts/api-server/.env.example` — أسماء متغيرات البيئة المطلوبة دون أسرار.

## Architecture decisions

- يستخدم البوت أقل صلاحيات Gateway المطلوبة (`Guilds`) لتقليل سطح الوصول.
- تُجمع الأوامر في مجلد مستقل حتى يمكن إضافة أنظمة مستقبلية دون تضخيم نقطة التشغيل.
- يُقرأ التوكن من `DISCORD_TOKEN` فقط، ولا توجد قيمة افتراضية أو قيمة صلبة داخل المصدر.
- يعمل خادم الصحة والبوت في نفس العملية لتوافق التشغيل مع خدمة 24/7 ومراقبة جاهزية الخدمة.

## Product

Xevora System هو بوت Discord عربي؛ الأساس الحالي يثبت الاتصال، يسجل أمر `/ping`
ويرد بالعربية، مع ترك الأنظمة الأخرى لمرحلة لاحقة.

## User preferences

- يجب أن تكون رسائل البوت وسجلاته ونصوصه العربية افتراضيًا، مع السماح بالأسماء التقنية الضرورية.
- لا تُنشأ واجهة ويب أو HTML أو CSS أو React لهذا المنتج.

## Gotchas

- يجب توفير `DISCORD_TOKEN` كسر بيئي قبل اتصال البوت؛ لا يُحفظ التوكن في الملفات.
- تسجيل الأوامر حاليًا عام على مستوى التطبيق، وقد يحتاج Discord بعض الوقت لإظهاره في كل الخوادم.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
