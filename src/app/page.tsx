import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'SmartStack Solutions | Premium AI & Web Development Agency',
  description: 'Elevate your business with next-gen digital intelligence. We build premium websites, AI chatbots, WhatsApp automation, and custom business systems.',
  openGraph: {
    title: 'SmartStack Solutions | Premium AI & Web Development Agency',
    description: 'Elevate your business with next-gen digital intelligence.',
    images: ['/hero-bg.png'],
  },
};

async function getServices() {
  try {
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function Home() {
  const services = await getServices();
  
  return <HomeClient services={services} />;
}
