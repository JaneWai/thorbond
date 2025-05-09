import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import NodeOperatorCard from './NodeOperatorCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { NodeOperator } from '../../types';

interface NodeOperatorListProps {
  nodeOperators: NodeOperator[];
  onRequestWhitelist: (nodeOperatorId: string) => void;
}

const NodeOperatorList: React.FC<NodeOperatorListProps> = ({
  nodeOperators,
  onRequestWhitelist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('bondingCapacity');
  const [filterMinBond, setFilterMinBond] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOperators = nodeOperators
    .filter((operator) => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          operator.address.toLowerCase().includes(searchLower) ||
          (operator.description && operator.description.toLowerCase().includes(searchLower)) ||
          (operator.contactInfo && operator.contactInfo.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter((operator) => {
      // Filter by minimum bond
      if (filterMinBond) {
        return operator.minimumBond <= parseInt(filterMinBond);
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case 'bondingCapacity':
          return b.bondingCapacity - a.bondingCapacity;
        case 'minimumBond':
          return a.minimumBond - b.minimumBond;
        case 'feePercentage':
          return a.feePercentage - b.feePercentage;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  return (
    <div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-grow mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search node operators..."
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Filters:</span>
            </div>
            
            <Select
              options={[
                { value: '', label: 'Any Minimum Bond' },
                { value: '5000', label: '≤ 5,000 RUNE' },
                { value: '10000', label: '≤ 10,000 RUNE' },
                { value: '20000', label: '≤ 20,000 RUNE' },
                { value: '50000', label: '≤ 50,000 RUNE' },
              ]}
              value={filterMinBond}
              onChange={setFilterMinBond}
            />
            
            <Select
              options={[
                { value: 'bondingCapacity', label: 'Highest Capacity' },
                { value: 'minimumBond', label: 'Lowest Minimum Bond' },
                { value: 'feePercentage', label: 'Lowest Fee' },
                { value: 'newest', label: 'Newest First' },
              ]}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>
      </div>
      
      {filteredOperators.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No node operators found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperators.map((operator) => (
            <NodeOperatorCard
              key={operator.id}
              nodeOperator={operator}
              onRequestWhitelist={onRequestWhitelist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeOperatorList;
