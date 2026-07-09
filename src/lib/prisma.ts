import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// In development, we want to preserve the cached Prisma client instance on module reload
// to prevent exhausting database connections (avoiding EMAXCONNSESSION errors).
// if (process.env.NODE_ENV === 'development') {
//   globalThis.prismaGlobal = undefined;
// } else 
if (globalThis.prismaGlobal && (!('review' in globalThis.prismaGlobal) || !('promoCode' in globalThis.prismaGlobal) || !('systemCache' in globalThis.prismaGlobal))) {
  globalThis.prismaGlobal = undefined;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;