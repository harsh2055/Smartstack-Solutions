import React from 'react';
import { Metadata } from 'next';
import SolutionsClient from '@/components/SolutionsClient';

export const metadata: Metadata = {
  title: 'Industry Solutions | SmartStack Solutions',
  description: 'Tailored AI and automation systems for coaching institutes, healthcare clinics, and retail businesses. Scale your operations with precision-engineered digital intelligence.',
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
