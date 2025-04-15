
import React, { useState } from "react";
import { MedicalRecord } from "@/contexts/MedicalRecordContext";

interface RecordCardProps {
  record: MedicalRecord;
  actions?: React.ReactNode;
  isDoctor?: boolean;
  onUpdateRecord?: (id: string, record: Partial<MedicalRecord>) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ 
  record, 
  actions,
  isDoctor = false,
  onUpdateRecord
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(record.description);
  const [prescriptions, setPrescriptions] = useState(record.prescriptions?.join('\n') || '');

  const handleSaveChanges = () => {
    if (onUpdateRecord) {
      onUpdateRecord(record.id, {
        description: notes,
        prescriptions: prescriptions.split('\n').filter(line => line.trim() !== '')
      });
    }
    setIsEditing(false);
  };

  // Format the date
  const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Badge color based on record type
  const getBadgeColor = () => {
    switch (record.type) {
      case 'diagnosis':
        return 'bg-blue-100 text-blue-800';
      case 'prescription':
        return 'bg-green-100 text-green-800';
      case 'test':
        return 'bg-purple-100 text-purple-800';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-medical-dark">{record.title}</h3>
          <div className="flex items-center mt-1 space-x-3">
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor()} capitalize`}>
              {record.type}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-medical-primary rounded-full hover:bg-gray-100"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
          {actions}
        </div>
      </div>

      {/* Card Body (collapsible) */}
      {isOpen && (
        <div className="p-4">
          {record.doctor && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Doctor</span>
              <p className="text-medical-dark">Dr. {record.doctor.name}</p>
            </div>
          )}

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Description</span>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-primary focus:ring focus:ring-medical-primary focus:ring-opacity-50"
                rows={4}
              />
            ) : (
              <p className="text-medical-dark whitespace-pre-line">{record.description}</p>
            )}
          </div>

          {(record.prescriptions && record.prescriptions.length > 0) || isEditing ? (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Prescriptions</span>
              {isEditing ? (
                <textarea
                  value={prescriptions}
                  onChange={(e) => setPrescriptions(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-primary focus:ring focus:ring-medical-primary focus:ring-opacity-50"
                  rows={4}
                  placeholder="Enter each prescription on a new line"
                />
              ) : (
                <ul className="mt-1 list-disc list-inside text-medical-dark">
                  {record.prescriptions?.map((prescription, index) => (
                    <li key={index}>{prescription}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {record.attachmentUrl && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Attachment</span>
              <div className="mt-2">
                <a
                  href={record.attachmentUrl}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  View Document
                </a>
              </div>
            </div>
          )}

          {isDoctor && (
            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                >
                  Edit Record
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordCard;
