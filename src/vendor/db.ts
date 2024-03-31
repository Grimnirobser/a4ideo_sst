import { PrismaClient, Prisma } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    name: "UpdateAndDeleteIgnoreNotFound",
    model: {
      $allModels: {
        async updateIgnoreOnNotFound<T, A>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, "update">>
        ): Promise<Prisma.Result<T, A, "update"> | null> {
          try {
            const context = Prisma.getExtensionContext(this) as any;
            return await context.update(args);
          } catch (err) {
            if (
              err instanceof Prisma.PrismaClientKnownRequestError &&
              err.code === "P2025"
            ) {
              return null;
            }
            throw err;
          }
        },
        async deleteIgnoreOnNotFound<T, A>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, "delete">>
        ): Promise<Prisma.Result<T, A, "delete"> | null> {
          try {
            const context = Prisma.getExtensionContext(this) as any;
            return await context.delete(args);
          } catch (err) {
            if (
              err instanceof Prisma.PrismaClientKnownRequestError &&
              err.code === "P2025"
            ) {
              return null;
            }
            throw err;
          }
        },
      },
    },
  });
  
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
