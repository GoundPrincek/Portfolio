export async function saveContact(prisma, data) {
  const { website: _website, ...message } = data
  return prisma.message.create({
    data: { ...message, subject: message.subject || 'Portfolio contact' },
    select: { id: true, createdAt: true },
  })
}
