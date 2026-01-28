import App from '../components/app.jsx';
import { IconRegistry } from '../components/icon-registry.jsx';
import { ModalRenderer } from '../components/modal-renderer';
import { Toaster } from '../components/ui/sonner';
import { HewcodeProvider } from '../contexts/hewcode-context';
import { LocaleProvider } from '../contexts/locale-context';
import { ModalProvider } from '../contexts/modal-context';

export default function Provider({ children, ...props }) {
  const { hewcode } = props.initialPage.props;

  return (
    <HewcodeProvider initialHewcode={hewcode}>
      <LocaleProvider>
        <ModalProvider>
          <IconRegistry />
          <App>{children}</App>
          <ModalRenderer />
          <Toaster closeButton richColors />
        </ModalProvider>
      </LocaleProvider>
    </HewcodeProvider>
  );
}
