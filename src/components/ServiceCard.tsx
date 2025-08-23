import Link from 'next/link';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    features: string[];
    cta: string;
    ctaLink: string;
    icon: string;
    isPrimary?: boolean;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className={`card ${service.isPrimary ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-xl font-bold text-textDark mb-3">{service.title}</h3>
        <p className="text-textGray mb-4">{service.description}</p>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold text-textDark mb-3">المميزات:</h4>
        <ul className="space-y-2">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-textGray">
              <span className="text-primary ml-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-center">
        <Link href={service.ctaLink} className="btn-primary w-full">
          {service.cta}
        </Link>
      </div>
    </div>
  );
}
