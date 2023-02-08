import { Accounts } from '@prisma/client';
import { prisma } from 'repositories';

export const getAccountOrCreate = async (license: string): Promise<Accounts> => {
  const account = await getAccountByLicense(license);
  if (account) {
    return account;
  }

  const newAccount = await prisma.accounts.create({
    data: {
      license,
    },
  });

  return newAccount;
};

const getAccountByLicense = async (license: string): Promise<Accounts | null> => {
  const account = await prisma.accounts.findUnique({
    where: {
      license,
    },
  });

  return account;
};

export const AccountRepository = {
  getAccountByLicense,
  getAccountOrCreate,
};
