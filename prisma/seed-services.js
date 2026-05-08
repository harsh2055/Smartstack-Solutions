const { PrismaClient } = require('../src/generated/prisma_new');
const prisma = new PrismaClient();

async function main() {
  const services = [
    {
      title: 'Smart Website Development',
      slug: 'website-development',
      description: 'Modern websites designed to attract and convert customers.',
      priceRange: '₹5,999 - ₹12,999',
      isPopular: false,
      features: ['Modern Design', 'SEO Optimized', 'Fast Performance'],
      isActive: true,
    },
    {
      title: 'AI Chatbot Integration',
      slug: 'ai-chatbot',
      description: 'Automate customer queries with AI assistant.',
      priceRange: '₹3,999 - ₹8,999',
      isPopular: false,
      features: ['24/7 Support', 'NLP Powered', 'CRM Integration'],
      isActive: true,
    },
    {
      title: 'WhatsApp Automation',
      slug: 'whatsapp-automation',
      description: 'Handle customers directly on WhatsApp automatically.',
      priceRange: '₹6,000 - ₹20,000',
      isPopular: false,
      features: ['Bulk Messaging', 'Auto Replies', 'Order Tracking'],
      isActive: true,
    },
    {
      title: 'Business Automation Systems',
      slug: 'business-automation',
      description: 'Automate workflows and reduce manual work.',
      priceRange: '₹5,000 - ₹15,000',
      isPopular: false,
      features: ['Workflow Design', 'App Integration', 'Error Handling'],
      isActive: true,
    },
    {
      title: 'Complete Smart Business System',
      slug: 'complete-business-system',
      description: 'An integrated ecosystem combining a modern website, intelligent AI chatbot, automated WhatsApp workflows, and full backend automation.',
      priceRange: '₹15,000 - ₹40,000',
      isPopular: true,
      features: ['Website', 'AI assistant', 'WhatsApp flows', 'Automation'],
      isActive: true,
    },
  ];

  console.log('Seeding services...');

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log('Services seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
