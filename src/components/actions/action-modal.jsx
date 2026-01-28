import { useEffect, useState } from 'react';
import useRoute from '../../hooks/use-route.ts';
import useFetch from '../../hooks/useFetch.js';
import useTranslator from '../../hooks/useTranslator.js';
import Form from '../form/Form.jsx';
import Modal from '../modal.jsx';

const ActionModal = ({ seal, context, path, name, args, modalHeading, modalDescription, modalWidth, onSuccess, onError, onFinish, onClose }) => {
  const { __ } = useTranslator();
  const { fetch } = useFetch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!form) {
      setLoading(true);

      fetch(
        route('hewcode.mount'),
        {
          method: 'POST',
          body: {
            seal,
            context,
            call: {
              name: 'mount',
              params: {
                name: path,
                args: {
                  ...args,
                  mountingModal: true,
                },
              },
            },
          },
          onSuccess: async (response) => {
            const data = await response.json();
            setForm(data.data?.form || null);
            setLoading(false);

            if (onSuccess) {
              onSuccess(response);
            }
          },
          onError: (serverErrors) => {
            if (onError) {
              onError(serverErrors);
            }
          },
          onFinish: () => {
            setLoading(false);

            if (onFinish) {
              onFinish();
            }
          },
        },
        true,
      );
    }
  }, [form]);

  if (!form) {
    return (
      <Modal size={modalWidth || 'sm'}>
        <div className="py-4 text-center">
          {/* Loading Spinner */}
          <svg className={`mx-auto h-8 w-8 animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{__('hewcode.common.loading')}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal size={modalWidth || 'sm'} title={modalHeading} description={modalDescription} onClose={onClose}>
      <div className="py-4 text-center">
        <Form
          {...form}
          seal={seal}
          context={context}
          onSuccess={async (action, state, response) => {
            const data = await response.json();
            const shouldClose = data.actions?.[name]?.shouldClose || false;

            if (shouldClose && onClose) {
              onClose();
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default ActionModal;
