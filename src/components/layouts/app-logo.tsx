import { useHewcode } from '../../contexts/hewcode-context';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  const { hewcode } = useHewcode();

  if (hewcode?.panel?.logo) {
    return <img src={hewcode.panel.logo} alt={hewcode?.panel?.title ?? 'Logo'} className="h-8" />;
  }

  return (
    <>
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        <AppLogoIcon src={hewcode?.panel?.logoIcon} className="size-5 fill-current text-white dark:text-black" />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate font-semibold leading-tight">{hewcode?.panel?.title ?? 'Hewcode'}</span>
      </div>
    </>
  );
}
