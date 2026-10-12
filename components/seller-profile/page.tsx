import React from 'react';
import type { Metadata } from 'next';
import SellerProfile from '../SellerProfile';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function SellerProfilePage({ params }: PageProps) {

  const { id } = await params;
  return <SellerProfile id = {id}/>;
}
