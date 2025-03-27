import React from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { WhitelistRequest } from '../../types';
import { formatRune, shortenAddress } from '../../lib/utils';

interface RequestListProps {
  requests: WhitelistRequest[];
  isNodeOperator?: boolean;
  onApprove?: (request: WhitelistRequest) => void;
  onReject?: (request: WhitelistRequest, reason: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  isNodeOperator = false,
  onApprove,
  onReject,
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No requests found.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string, request?: WhitelistRequest) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'bonded':
        return <Badge variant="success" link={`https://rune.tools/bond?bond_address=${request?.walletAddress}&node_address=${request?.node?.address}`}>Bonded</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const handleReject = (request: WhitelistRequest) => {
    if (onReject) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason !== null) {
        onReject(request, reason);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wallet Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bond Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {isNodeOperator && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.node.address}>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {request.discordUsername}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.xUsername} / {request.telegramUsername}
                  </div>
                </div>
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shortenAddress(request.walletAddress)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatRune(request.intendedBondAmount)} RUNE
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(request.createdAt, 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(request.status, request)}
                {request.status === 'rejected' && request.rejectionReason && (
                  <div className="mt-1 text-xs text-gray-500">
                    Reason: {request.rejectionReason}
                  </div>
                )}
              </td>
              {isNodeOperator && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(request)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onApprove && onApprove(request)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                  {request.status === 'bonded' && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        disabled
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(request)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestList;
