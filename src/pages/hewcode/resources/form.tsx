import { router, usePage } from '@inertiajs/react';
import Form from '../../../components/form/Form';
import PageLayout from '../../../layouts/pages/page-layout';

export default function FormPage() {
  const { form } = usePage().props;

  return (
    <PageLayout>
      <div className="p-4 py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="">
            <div className="">
              {/*@todo: get index route related to this one*/}
              <Form {...form} onCancel={() => router.visit('/users')} />
            </div>
          </div>
        </div>
      </div>

      {/*<div className="flex gap-8 p-4">*/}
      {/*  <div className="">*/}
      {/*    <h3 className="m-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Posts</h3>*/}
      {/*    <DataTable {...posts} />*/}
      {/*  </div>*/}
      {/*  <div className="">*/}
      {/*    <h3 className="m-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Comments</h3>*/}
      {/*    <DataTable {...comments} />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </PageLayout>
  );
}
