import useRoute from '../../hooks/use-route.ts';
import useFetch from '../../hooks/useFetch.js';
import BaseSelect from '../support/select.jsx';

export default function Select({ seal, context, ...props }) {
  const { fetch } = useFetch();
  const route = useRoute();

  return (
    <BaseSelect
      {...props}
      searchUsing={async (query) => {
        if (!seal.route || !seal.hash) {
          return [];
        }

        const response = await fetch(
          route('hewcode.mount'),
          {
            method: 'POST',
            body: {
              seal,
              context,
              call: {
                name: 'mount',
                params: {
                  name: props.path + '.getSearchResults',
                  args: [query],
                },
              },
            },
          },
          true,
        );

        if (response.ok) {
          return await response.json();
        }

        return [];
      }}
    />
  );
}
