import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useTranslator from '../../hooks/useTranslator.js';
import { Button } from '../ui/button.jsx';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 20,
  onPageChange,
  showPagination = true,
  requestScope = 'page',
}) => {
  const { __ } = useTranslator();

  if (!showPagination) return null;

  // unnecessary pagination if there's only one page
  if (totalPages <= 1) return null;

  // current URL + page=X
  const pageUrl = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set(requestScope ?? 'page', page);

    return url.toString();
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          asLink={true}
          variant="outline"
          href={pageUrl(currentPage - 1)}
          className={clsx({
            'cursor-not-allowed opacity-50': currentPage === 1,
          })}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {__('hewcode.common.previous')}
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button asLink={true} size="icon" key={pageNum} href={pageUrl(pageNum)} variant={pageNum === currentPage ? 'default' : 'outline'}>
                {pageNum}
              </Button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <Button asLink={true} href={pageUrl(totalPages)} variant="outline">
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          asLink={true}
          variant="outline"
          href={pageUrl(currentPage + 1)}
          className={clsx({
            'cursor-not-allowed opacity-50': currentPage === totalPages,
          })}
        >
          {__('hewcode.common.next')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        {__('hewcode.common.showing_x_to_y_of_z_results', {
          from: startItem,
          to: endItem,
          total: totalItems,
        })}
      </div>
    </div>
  );
};

export default Pagination;
