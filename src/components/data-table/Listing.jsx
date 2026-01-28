import DataTable from './DataTable.jsx';
import DataCards from './DataCards.jsx';

/**
 * Listing component - Main entry point for listing data
 * Decides whether to render a table or cards layout based on the layout prop
 */
const Listing = ({ layout = 'table', ...props }) => {
  if (layout === 'cards') {
    return <DataCards {...props} />;
  }

  return <DataTable {...props} />;
};

export default Listing;
