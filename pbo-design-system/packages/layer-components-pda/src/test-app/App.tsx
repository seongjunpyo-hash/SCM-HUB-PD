import { AlertBanner } from '@/components/Banner';
import './index.css';

export function App() {
  return (
    <div>
      <AlertBanner text="Text" validationState="critical" />
      <AlertBanner text="Text" validationState="warning" />
      <AlertBanner text="Text" validationState="success" />
      <AlertBanner text="Text" validationState="accent" />
    </div>
  );
}
