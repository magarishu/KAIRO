'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'



export async function getGroups() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  return prisma.group.findMany({
    where: { userId },
    include: {
      slaves: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createGroup(data: {
  name: string
  accountId: string
  subtitle?: string
  icon?: string
  iconColor?: string
  iconBg?: string
  slaves: {
    name: string
    accountId: string
    broker: string
    balance?: number
    multiplier?: number
    copySl?: boolean
    copyTp?: boolean
  }[]
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const group = await prisma.group.create({
    data: {
      name: data.name,
      accountId: data.accountId,
      subtitle: data.subtitle,
      icon: data.icon,
      iconColor: data.iconColor,
      iconBg: data.iconBg,
      userId,
      slaves: {
        create: data.slaves
      }
    }
  })

  revalidatePath('/groups')
  revalidatePath('/')
  
  return group
}

export async function updateGroup(id: string, data: {
  name?: string
  subtitle?: string
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existing = await prisma.group.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  const group = await prisma.group.update({
    where: { id },
    data
  })

  revalidatePath('/groups')
  revalidatePath('/')
  return group
}

export async function deleteGroup(id: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existing = await prisma.group.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  await prisma.group.delete({ where: { id } })

  revalidatePath('/groups')
  revalidatePath('/')
  return { success: true }
}

export async function updateSlave(id: string, data: {
  name?: string
  multiplier?: number
  copySl?: boolean
  copyTp?: boolean
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existingSlave = await prisma.slaveAccount.findUnique({
    where: { id },
    include: { group: true }
  })

  if (!existingSlave || existingSlave.group.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  const slave = await prisma.slaveAccount.update({
    where: { id },
    data
  })

  revalidatePath('/groups')
  return slave
}

export async function deleteSlave(id: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existingSlave = await prisma.slaveAccount.findUnique({
    where: { id },
    include: { group: true }
  })

  if (!existingSlave || existingSlave.group.userId !== userId) {
    throw new Error('Unauthorized or not found')
  }

  await prisma.slaveAccount.delete({ where: { id } })

  revalidatePath('/groups')
  return { success: true }
}
