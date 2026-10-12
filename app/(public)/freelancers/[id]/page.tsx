import React from 'react';
import SellerProfile from '../../../../components/SellerProfile';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function FreelancerProfilePage({ params }: PageProps) {
  const { id } = await params;

  // We can pass customized or default data for the slug
  return <SellerProfile id = {id}/>;
}
