import { Label as ShadcnLabel } from '../ui/label.jsx';
import { cn } from '../../lib/utils';

export default function Label({ children, required, className, ...props }) {
  return (
    <ShadcnLabel className={cn('mb-2', className)} {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </ShadcnLabel>
  );
}