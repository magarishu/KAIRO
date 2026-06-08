'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'



export async function getRiskRules() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const connections = await prisma.connection.findMany({
    where: { userId },
    select: { id: true }
  })

  return prisma.riskRule.findMany({
    where: { 
      connectionId: { in: connections.map(c => c.id) } 
    },
    include: {
      connection: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createRiskRule(data: {
  connectionId: string
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Ensure user owns connection
  const connection = await prisma.connection.findUnique({
    where: { id: data.connectionId }
  })

  if (!connection || connection.userId !== userId) {
    throw new Error('Unauthorized or connection not found')
  }

  const existingRule = await prisma.riskRule.findUnique({
    where: { connectionId: data.connectionId }
  })

  if (existingRule) {
    return existingRule
  }

  const riskRule = await prisma.riskRule.create({
    data: {
      connectionId: data.connectionId
    }
  })

  revalidatePath('/risk')
  return riskRule
}

export async function updateRiskRule(id: string, data: {
  wpLimit?: number
  wpStatus?: string
  wlLimit?: number
  wlStatus?: string
  dpLimit?: number
  dpStatus?: string
  dlLimit?: number
  dlStatus?: string
  trailingDd?: string
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existing = await prisma.riskRule.findUnique({ 
    where: { id },
    include: { connection: true }
  })
  
  if (!existing || existing.connection.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  const riskRule = await prisma.riskRule.update({
    where: { id },
    data
  })

  revalidatePath('/risk')
  return riskRule
}

export async function deleteRiskRule(id: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existing = await prisma.riskRule.findUnique({ 
    where: { id },
    include: { connection: true }
  })
  
  if (!existing || existing.connection.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  await prisma.riskRule.delete({ where: { id } })

  revalidatePath('/risk')
  return { success: true }
}
