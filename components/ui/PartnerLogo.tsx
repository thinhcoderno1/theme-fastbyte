import type { SimpleIcon } from 'simple-icons';
import {
  siAmd,
  siDell,
  siIntel,
  siLenovo,
  siLinux,
  siLinuxfoundation,
  siProxmox,
  siSamsung,
  siSupermicro,
  siVmware,
} from 'simple-icons';

const LOGOS: Record<string, SimpleIcon> = {
  amd: siAmd,
  dell: siDell,
  intel: siIntel,
  lenovo: siLenovo,
  linux: siLinuxfoundation,
  proxmox: siProxmox,
  samsung: siSamsung,
  supermicro: siSupermicro,
  vmware: siVmware,
};

interface PartnerLogoProps {
  logoId: string;
  name: string;
}

function MicrosoftLogo() {
  return (
    <span className="grid h-8 w-8 grid-cols-2 gap-[2px]" aria-hidden="true">
      <span className="bg-[#f25022]" />
      <span className="bg-[#7fba00]" />
      <span className="bg-[#00a4ef]" />
      <span className="bg-[#ffb900]" />
    </span>
  );
}

function KvmLogo() {
  return (
    <span className="flex items-center gap-2" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#FCC624]">
        <path d={siLinux.path} />
      </svg>
      <span className="font-heading text-[18px] font-black tracking-[-0.04em] text-ink-900">KVM</span>
    </span>
  );
}

function HpeLogo() {
  return (
    <svg viewBox="0 0 52 28" className="h-9 w-[52px]" role="img" aria-label="Logo HPE">
      <rect x="3" y="5" width="46" height="18" fill="none" stroke="#01A982" strokeWidth="4" />
    </svg>
  );
}

export function PartnerLogo({ logoId, name }: PartnerLogoProps) {
  if (logoId === 'microsoft') return <MicrosoftLogo />;
  if (logoId === 'kvm') return <KvmLogo />;
  if (logoId === 'hpe') return <HpeLogo />;

  const icon = LOGOS[logoId];
  if (!icon) return null;

  return (
    <svg
      role="img"
      aria-label={`Logo ${name}`}
      viewBox="0 0 24 24"
      className="h-9 w-9 shrink-0"
      style={{ fill: `#${icon.hex}` }}
    >
      <path d={icon.path} />
    </svg>
  );
}
