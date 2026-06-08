'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

// Helper to prevent sensitive tokens from leaking to the frontend payload
function sanitizeConnection(connection: any) {
  if (!connection) return connection;
  const { tradovateToken, rithmicToken, password, ...safeConnection } = connection;
  return safeConnection;
}

export async function getConnections() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const connections = await prisma.connection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  return connections.map(sanitizeConnection)
}

import MetaApi from 'metaapi.cloud-sdk/node'
import { getTradovateToken, getTradovateEquity } from '@/lib/actions/tradovate'
import { getRithmicToken, getRithmicEquity } from '@/lib/actions/rithmic'

export async function createConnection(data: {
  broker: string
  name: string
  accountId: string
  password?: string
  server?: string
  equity?: number
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  let metaApiAccountId = null;
  let tradovateToken = null;
  let tradovateEnv = null;
  let rithmicToken = null;
  let initialEquity = data.equity || 0;
  let initialStatus = 'ONLINE';

  // Route: Tradovate
  if (data.broker === 'Tradovate' && data.password && data.server) {
    try {
      const authResponse = await getTradovateToken(data.accountId, data.password, data.server);
      if (authResponse.success && authResponse.token) {
        tradovateToken = authResponse.token;
        tradovateEnv = data.server;
        
        const equityResponse = await getTradovateEquity(tradovateToken, tradovateEnv);
        if (equityResponse.success) {
           initialEquity = equityResponse.equity || 0;
           initialStatus = equityResponse.status || 'ONLINE';
        }
      } else {
        throw new Error('Failed to authenticate with Tradovate');
      }
    } catch (err: any) {
      console.error("Tradovate Error:", err);
      throw new Error(`Failed to connect to Tradovate: ${err.message}`);
    }
  }
  // Route: Rithmic
  if (data.broker === 'Rithmic' && data.password && data.server) {
    try {
      const authResponse = await getRithmicToken(data.accountId, data.password, data.server);
      if (authResponse.success && authResponse.token) {
        rithmicToken = authResponse.token;
        
        const equityResponse = await getRithmicEquity(rithmicToken, data.server);
        if (equityResponse.success) {
           initialEquity = equityResponse.equity || 0;
           initialStatus = equityResponse.status || 'ONLINE';
        }
      } else {
        throw new Error('Failed to authenticate with Rithmic');
      }
    } catch (err: any) {
      console.error("Rithmic Error:", err);
      throw new Error(`Failed to connect to Rithmic: ${err.message}`);
    }
  }
  // Route: MT5
  else if ((data.broker === 'MT5' || data.broker === 'MetaTrader 5') && data.password && data.server) {
    const token = process.env.META_API_TOKEN;
    if (!token) throw new Error("MetaApi token is not configured on the server.");
    
    try {
      const metaApi = new MetaApi(token);
      
      // Provision a new account
      const account = await metaApi.metatraderAccountApi.createAccount({
        name: data.name,
        login: data.accountId,
        password: data.password,
        server: data.server,
        type: 'cloud',
        magic: 1000,
        platform: 'mt5'
      });

      metaApiAccountId = account.id;

      try {
        await account.deploy();

        // Attempt to fetch equity with an 8-second timeout to prevent server action hanging
        const equityPromise = new Promise<number>(async (resolve, reject) => {
          let rpcApi: any = null;
          try {
            await account.waitConnected();
            const connectionApi = await metaApi.metatraderAccountApi.getAccount(account.id);
            rpcApi = await connectionApi.getRPCConnection();
            await rpcApi.connect();
            const accountInfo = await rpcApi.getAccountInformation();
            resolve(accountInfo.equity);
          } catch (err) {
            reject(err);
          } finally {
            if (rpcApi && typeof rpcApi.close === 'function') {
              try {
                await rpcApi.close();
              } catch (e) {
                // ignore close errors
              }
            }
          }
        });

        const timeoutPromise = new Promise<number>((_, reject) => 
          setTimeout(() => reject(new Error('Connection check timed out')), 8000)
        );

        // Prevent unhandled promise rejection if equityPromise rejects after timeoutPromise resolves
        equityPromise.catch(() => {});

        initialEquity = await Promise.race([equityPromise, timeoutPromise]);
        initialStatus = 'ONLINE';
      } catch (err: any) {
        console.warn("Broker connection could not be established immediately:", err);
        initialEquity = 0;
        initialStatus = 'OFFLINE';
      }
      
    } catch (err: any) {
      console.error("MetaApi Error:", err);
      throw new Error(`Failed to connect to MT5: ${err.message || 'Invalid credentials or server'}`);
    }
  }

  const connection = await prisma.connection.create({
    data: {
      broker: data.broker,
      name: data.name,
      accountId: data.accountId,
      metaApiAccountId: metaApiAccountId,
      tradovateToken: tradovateToken,
      tradovateEnv: tradovateEnv,
      rithmicToken: rithmicToken,
      server: data.server,
      // Intentionally NOT saving the password to the DB for security, MetaApi holds it securely.
      equity: initialEquity,
      status: initialStatus,
      userId,
    }
  })

  revalidatePath('/connections')
  revalidatePath('/')
  
  return sanitizeConnection(connection)
}

export async function updateConnection(id: string, data: {
  name?: string
  status?: string
  equity?: number
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Ensure user owns connection
  const existing = await prisma.connection.findUnique({
    where: { id }
  })
  
  if (!existing || existing.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  const connection = await prisma.connection.update({
    where: { id },
    data
  })

  revalidatePath('/connections')
  revalidatePath('/')

  return sanitizeConnection(connection)
}

export async function deleteConnection(id: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Ensure user owns connection
  const existing = await prisma.connection.findUnique({
    where: { id }
  })
  
  if (!existing || existing.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  await prisma.connection.delete({
    where: { id }
  })

  revalidatePath('/connections')
  revalidatePath('/')
  revalidatePath('/risk')
  revalidatePath('/groups')
  
  return { success: true }
}

export async function syncConnection(id: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existing = await prisma.connection.findUnique({
    where: { id }
  })
  
  if (!existing || existing.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  let updatedEquity = existing.equity;
  let updatedStatus = existing.status;

  if ((existing.broker === 'MT5' || existing.broker === 'MetaTrader 5') && existing.metaApiAccountId) {
    const token = process.env.META_API_TOKEN;
    if (!token) throw new Error("MetaApi token is not configured.");
    
    try {
      const metaApi = new MetaApi(token);
      const account = await metaApi.metatraderAccountApi.getAccount(existing.metaApiAccountId);
      
      try {
        await account.deploy();

        const equityPromise = new Promise<number>(async (resolve, reject) => {
          let rpcApi: any = null;
          try {
            await account.waitConnected();
            rpcApi = await account.getRPCConnection();
            await rpcApi.connect();
            const accountInfo = await rpcApi.getAccountInformation();
            resolve(accountInfo.equity);
          } catch (err) {
            reject(err);
          } finally {
            if (rpcApi && typeof rpcApi.close === 'function') {
              try {
                await rpcApi.close();
              } catch (e) {}
            }
          }
        });

        const timeoutPromise = new Promise<number>((_, reject) => 
          setTimeout(() => reject(new Error('Connection check timed out')), 8000)
        );

        // Prevent unhandled promise rejection if equityPromise rejects after timeoutPromise resolves
        equityPromise.catch(() => {});

        updatedEquity = await Promise.race([equityPromise, timeoutPromise]);
        updatedStatus = 'ONLINE';
      } catch (err: any) {
        console.warn("Sync: Broker connection could not be established immediately:", err);
        updatedStatus = 'OFFLINE';
      }
    } catch (err: any) {
      console.error("MetaApi Sync Error:", err);
      updatedStatus = 'OFFLINE';
    }
  } else if (existing.broker === 'Tradovate' && existing.tradovateToken && existing.tradovateEnv) {
    try {
      const equityResponse = await getTradovateEquity(existing.tradovateToken, existing.tradovateEnv);
      if (equityResponse.success) {
        updatedEquity = equityResponse.equity || 0;
        updatedStatus = equityResponse.status || 'ONLINE';
      } else {
        updatedStatus = 'OFFLINE';
      }
    } catch (err) {
      console.error('Tradovate Sync Error:', err);
      updatedStatus = 'OFFLINE';
    }
  } else if (existing.broker === 'Rithmic' && existing.rithmicToken && existing.server) {
    try {
      const equityResponse = await getRithmicEquity(existing.rithmicToken, existing.server);
      if (equityResponse.success) {
        updatedEquity = equityResponse.equity || 0;
        updatedStatus = equityResponse.status || 'ONLINE';
      } else {
        updatedStatus = 'OFFLINE';
      }
    } catch (err) {
      console.error('Rithmic Sync Error:', err);
      updatedStatus = 'OFFLINE';
    }
  }

  const connection = await prisma.connection.update({
    where: { id },
    data: {
      equity: updatedEquity,
      status: updatedStatus,
    }
  })

  revalidatePath('/connections')
  revalidatePath('/')

  return sanitizeConnection(connection)
}
