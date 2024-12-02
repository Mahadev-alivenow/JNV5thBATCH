import { Toaster } from 'sonner';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        className: 'toast-class',
        style: {
          background: 'white',
          color: 'black',
        },
      }}
    />
  );
}