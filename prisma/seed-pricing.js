const { PrismaClient } = require('../src/generated/prisma_new');
const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: 'Starter Plan',
      priceMonthly: '₹9,999',
      priceYearly: '₹9,999', // Fixed price for starter
      description: 'Perfect for small businesses starting their digital journey.',
      features: ['Includes Website', 'Basic chatbot'],
      isPopular: false,
      ctaText: 'Select Starter',
    },
    {
      name: 'Growth Plan',
      priceMonthly: '₹19,999',
      priceYearly: '₹19,999',
      description: 'Ideal for growing businesses needing advanced automation.',
      features: ['Includes Website', 'AI chatbot', 'WhatsApp automation'],
      isPopular: true,
      ctaText: 'Select Growth',
    },
    {
      name: 'Pro Plan',
      priceMonthly: '₹29,999',
      priceYearly: '₹29,999',
      description: 'Full-scale enterprise automation and management.',
      features: ['Includes Full system', 'Dashboard', 'Automation'],
      isPopular: false,
      ctaText: 'Contact Sales',
    },
    {
      name: 'Ongoing Maintenance',
      priceMonthly: '₹999',
      priceYearly: '₹9,999',
      description: 'Hosting, AI updates, Support',
      features: ['24/7 Hosting', 'AI Model Updates', 'Technical Support'],
      isPopular: false,
      ctaText: 'Subscribe Now',
    }
  ];

  console.log('Seeding pricing plans with exact CTA text...');

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('Pricing plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
