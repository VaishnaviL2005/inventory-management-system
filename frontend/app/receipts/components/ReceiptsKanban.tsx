'use client';

import type { Receipt } from '../types';
import React from 'react';

interface ReceiptsKanbanProps {
  receipts: Receipt[];
  draggedReceiptId: string | null;
  onDragStart: (e: React.DragEvent, receiptId: string) => void;
  onDrop: (e: React.DragEvent, newStatus: Receipt['status']) => void;
}

export default function ReceiptsKanban({
  receipts,
  draggedReceiptId,
  onDragStart,
  onDrop,
}: ReceiptsKanbanProps) {
  const statusOptions: Receipt['status'][] = ['Draft', 'Ready', 'In Progress', 'Done', 'Cancelled'];

  const groupedByStatus = statusOptions.reduce((acc, status) => {
    acc[status] = receipts.filter(r => r.status === status);
    return acc;
  }, {} as Record<Receipt['status'], Receipt[]>);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statusOptions.map((status) => (
        <div
          key={status}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, status)}
        >
          <div className="mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">{status}</h3>
            <span className="text-xs text-gray-500">{groupedByStatus[status].length} items</span>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-1">
            {groupedByStatus[status].map((receipt) => (
              <div
                key={receipt.id}
                draggable
                onDragStart={(e) => onDragStart(e, receipt.id)}
                className={`bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${draggedReceiptId === receipt.id ? 'opacity-50 border-blue-400' : ''
                  }`}
              >
                <div className="text-xs font-medium text-gray-900 mb-1">{receipt.reference}</div>
                <div className="text-xs text-gray-600 mb-2">{receipt.contact}</div>
                <div className="text-xs text-gray-500">
                  <div>From: {receipt.from}</div>
                  <div>To: {receipt.to}</div>
                  {receipt.scheduleDate && (
                    <div className="mt-1">Date: {receipt.scheduleDate}</div>
                  )}
                </div>
              </div>
            ))}
            {groupedByStatus[status].length === 0 && (
              <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-300 rounded-lg opacity-80">
                Drag items here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
