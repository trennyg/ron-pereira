import { notFound } from 'next/navigation'
import { getService, SERVICES } from '@/lib/services'
import ServicePageClient from './ServicePageClient'

export function generateStaticParams() {
  return SERVICES.map(s => ({ service: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params
  const svc = getService(service)
  if (!svc) return {}
  return {
    title:       `${svc.name} — Ron Pereira`,
    description: svc.desc,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params
  const svc = getService(service)
  if (!svc) notFound()
  return <ServicePageClient service={svc} />
}
